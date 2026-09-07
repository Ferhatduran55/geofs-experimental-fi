import type { MarketRates } from "./MarketEngine";

export interface TransportPayload {
  type: "passenger" | "cargo";
  amount: number;       // Pax count or kg cargo
  maxCapacity: number;
}

export interface FlightFinancials {
  // --- Fixed Contract Data (Müşteri ile Kilitlenen Değerler) ---
  fixedDistanceNm: number;          // Kuş uçuşu kalkış-varış mesafesi (NM)
  baseHandlingFee: number;          // Sabit operasyon/hizmet bedeli ($)
  ratePerUnitNm: number;            // Sözleşme anındaki birim fiyat ($/pax/NM veya $/kg/NM)
  grossContractRevenue: number;     // Müşterinin ödeyeceği toplam brüt bedel ($)

  // --- Flight Performance & Comfort (Pilot Performansı) ---
  smoothnessBonus: number;          // Yumuşak iniş ve sakin uçuş bonusu (+$)
  timingBonus: number;              // Zamanında varış bonusu/kesintisi (+$ / -$)
  landingPenalty: number;           // Sert iniş / aşırı G cezası (-$)
  totalBonusPenalty: number;        // Net performans farkı ($)

  // --- Operational Costs (Şirkete / Hesaba Kalan Maliyetler) ---
  burnedFuelGal: number;            // Uçuş boyunca harcanan toplam yakıt (gal)
  fuelPricePerGal: number;          // İniş anındaki galon yakıt fiyatı ($/gal)
  fuelCost: number;                 // Yakıt gideri (-$)
  landingFee: number;               // Havalimanı iniş/taksi harcı (İleride genişletilebilir) (-$)
  maintenanceFee: number;           // Uçak yıpranma & bakım payı (İleride genişletilebilir) (-$)

  // --- Final Financial Result (Nihai Net Bilanço) ---
  totalExpenses: number;            // Toplam operasyonel gider ($)
  netIncome: number;                // Pilot/Şirket hesabına geçen NET KÂR ($)
  rating: "S" | "A" | "B" | "C" | "D";
}

export class FinancialEngine {
  /**
   * Calculate Fixed Contract Price at the moment of mission generation / acceptance.
   * This value NEVER changes regardless of the actual path flown.
   */
  static calculateFixedContractRevenue(
    fixedDistanceNm: number,
    payload: TransportPayload,
    rates: MarketRates
  ): { grossRevenue: number; ratePerUnitNm: number; baseHandlingFee: number } {
    const baseHandlingFee = rates.baseContractFee;
    let ratePerUnitNm = 0;
    let distanceRevenue = 0;

    if (payload.type === "passenger") {
      ratePerUnitNm = rates.passengerRatePerNm;
      // Formula: Pax * Distance * Rate
      distanceRevenue = payload.amount * fixedDistanceNm * ratePerUnitNm;
    } else {
      ratePerUnitNm = rates.cargoRatePerNm;
      // Formula: Cargo Kg * Distance * Rate
      distanceRevenue = payload.amount * fixedDistanceNm * ratePerUnitNm;
    }

    const grossRevenue = Math.round(baseHandlingFee + distanceRevenue);

    return {
      grossRevenue,
      ratePerUnitNm,
      baseHandlingFee,
    };
  }

  /**
   * Final Settlement on Landing:
   * Calculates net income by taking the fixed contract revenue, adding performance incentives,
   * and deducting actual operational expenses (fuel burned, penalties, wear & tear).
   */
  static calculateSettlement(
    grossContractRevenue: number,
    fixedDistanceNm: number,
    ratePerUnitNm: number,
    baseHandlingFee: number,
    flightDurationMs: number,
    expectedDurationMs: number,
    maxGForce: number,
    touchdownVsfpm: number,
    burnedFuelGal: number,
    currentFuelRatePerGal: number,
    additionalFees?: { landingFee?: number; maintenanceFee?: number }
  ): FlightFinancials {
    // 1. Performance Bonus & Penalties
    let smoothnessBonus = 0;
    let landingPenalty = 0;
    let timingBonus = 0;

    // Smooth landing check (Touchdown Vertical Speed)
    // Positive or mild negative VS is smooth (e.g. -50 to -250 fpm)
    if (touchdownVsfpm > -250) {
      smoothnessBonus += Math.round(grossContractRevenue * 0.10); // +10% Butter Landing Bonus
    } else if (touchdownVsfpm < -750) {
      landingPenalty += Math.round(grossContractRevenue * 0.35); // -35% Crash/Heavy Impact Penalty
    } else if (touchdownVsfpm < -450) {
      landingPenalty += Math.round(grossContractRevenue * 0.15); // -15% Hard Landing Penalty
    }

    // G-Force Penalty
    if (maxGForce > 3.0) {
      landingPenalty += Math.round(grossContractRevenue * 0.20); // -20% Passenger Terror / Structural stress
    } else if (maxGForce > 2.2) {
      landingPenalty += Math.round(grossContractRevenue * 0.08);
    } else if (maxGForce <= 1.5) {
      smoothnessBonus += Math.round(grossContractRevenue * 0.05); // +5% Passenger Comfort
    }

    // Timing Bonus (capped at ±10%)
    if (expectedDurationMs > 0 && flightDurationMs > 0) {
      const timeDiff = expectedDurationMs - flightDurationMs;
      const ratio = timeDiff / expectedDurationMs;
      timingBonus = Math.round(grossContractRevenue * Math.max(-0.10, Math.min(0.10, ratio)));
    }

    const totalBonusPenalty = smoothnessBonus + timingBonus - landingPenalty;

    // 2. Operational Costs (Şirketin/Pilotun Üstlendiği Gerçek Giderler)
    const fuelCost = Math.round(burnedFuelGal * currentFuelRatePerGal);
    const landingFee = additionalFees?.landingFee ?? 0;
    const maintenanceFee = additionalFees?.maintenanceFee ?? 0;
    const totalExpenses = fuelCost + landingFee + maintenanceFee;

    // 3. Final Net Income
    const netIncome = Math.max(0, grossContractRevenue + totalBonusPenalty - totalExpenses);

    // 4. Performance Rating
    let rating: "S" | "A" | "B" | "C" | "D" = "C";
    const performanceRatio = (grossContractRevenue + totalBonusPenalty) / grossContractRevenue;

    if (landingPenalty === 0 && performanceRatio >= 1.10) rating = "S";
    else if (landingPenalty === 0 && performanceRatio >= 1.0) rating = "A";
    else if (landingPenalty <= grossContractRevenue * 0.15) rating = "B";
    else if (landingPenalty <= grossContractRevenue * 0.30) rating = "C";
    else rating = "D";

    return {
      fixedDistanceNm,
      baseHandlingFee,
      ratePerUnitNm,
      grossContractRevenue,
      smoothnessBonus,
      timingBonus,
      landingPenalty,
      totalBonusPenalty,
      burnedFuelGal: Number(burnedFuelGal.toFixed(2)),
      fuelPricePerGal: currentFuelRatePerGal,
      fuelCost,
      landingFee,
      maintenanceFee,
      totalExpenses,
      netIncome,
      rating,
    };
  }
}
