import { getObjectFromPath, formatLabel } from "../utils/Misc";
import Notify from "../shared/Notify";
import Logger from "../shared/Logger";
import { onMount, onCleanup, createSignal } from "solid-js";
import { Plus, Minus } from "../assets/icons";

const log = Logger.create("Input");

export default (props: InputProps) => {
  // Defaults
  const notifyMode: InputNotifyMode = props.notifyMode || "input";
  const notifyCategory = props.notifyCategory || "input_changes";
  const debounceApply = props.debounceApply ?? 0;
  let inputAttributes: any = {};
  let defaultValue: any;
  let reference: HTMLInputElement | undefined;

  const multipliers = [1, 2, 5, 10, 100];
  const [currentMultiplierIndex, setCurrentMultiplierIndex] = createSignal(0);
  const multiplier = () => multipliers[currentMultiplierIndex()];
  const cycleMultiplier = () => {
    setCurrentMultiplierIndex((prev) => (prev + 1) % multipliers.length);
  };

  // Stacked Batch Commit State for high performance rapid adjustments
  let stackTimeout: number | null = null;
  let applyTimeout: number | null = null;
  let lastCommittedValue: any = null;

  const commitStackedChange = (value: number) => {
    if (stackTimeout) {
      clearTimeout(stackTimeout);
      stackTimeout = null;
    }

    // Debounce physical write and notifications by 80ms so rapid arrow presses stay buttery smooth
    stackTimeout = window.setTimeout(() => {
      try {
        const res = resource();
        if (res && props.name) {
          (res as any)[props.name] = value;
        }

        if (props.onChange && value !== lastCommittedValue) {
          props.onChange(value);
        }

        if (notifyMode === "input" || notifyMode === "both") {
          Notify.success(`${props.name} set to ${value}`, notifyCategory);
        }

        scheduleApply(value);
        lastCommittedValue = value;
      } catch (e) {
        log.error("Failed to commit stacked input change:", e);
      } finally {
        stackTimeout = null;
      }
    }, 80);
  };

  const scheduleApply = (value: any) => {
    if (!props.onApply) return;
    if (applyTimeout) {
      clearTimeout(applyTimeout);
      applyTimeout = null;
    }
    if (debounceApply && debounceApply > 0) {
      applyTimeout = window.setTimeout(() => {
        try {
          props.onApply && props.onApply(value);
        } catch (e) {
          /* ignore */
        }
        applyTimeout = null;
      }, debounceApply);
    } else {
      try {
        props.onApply && props.onApply(value);
      } catch (e) {
        /* ignore */
      }
    }
  };

  const flushApply = (value: any) => {
    if (applyTimeout) {
      clearTimeout(applyTimeout);
      applyTimeout = null;
    }
    try {
      props.onApply && props.onApply(value);
    } catch (e) {
      /* ignore */
    }
  };

  const notify = (msg: string, type: string = "success") => {
    const category = props.notifyCategory || notifyCategory;
    switch (type) {
      case "error":
        Notify.error(msg, category);
        break;
      case "info":
        Notify.info(msg, category);
        break;
      case "warning":
        Notify.warning(msg, category);
        break;
      default:
        Notify.success(msg, category);
    }
  };

  const resetToDefault = () => {
    if (defaultValue === undefined) return;
    if (!reference) return;
    if (!isResourceValid() && props.value === undefined) return;

    const parsedValue = prototypeOfValue() === "number" ? parseFloat(defaultValue) : defaultValue;

    if (reference) reference.value = parsedValue as any;

    const res = resource();
    if (res && props.name) {
      (res as any)[props.name] = parsedValue;
    }

    if (props.onChange) props.onChange(parsedValue);
    if (props.onApply) props.onApply(parsedValue);

    if (prototypeOfValue() === "number") calculateMax();
  };

  try {
    if (!props.resource && props.value === undefined && !props.name) {
      throw new Error("Input component requires either a resource/name pair or a value prop.");
    }
    if (props.resource && typeof props.resource !== "string" && typeof props.resource !== "object") {
      throw new Error("Input component resource prop must be an object or string.");
    }
  } catch (e) {
    log.error("Input validation failed:", e);
    return null;
  }

  const resource = () => {
    if (!props.resource) return null;
    if (typeof props.resource === "string") {
      const obj = getObjectFromPath(props.resource, true);
      if (!obj) return null;
      return obj;
    }
    return props.resource;
  };

  const isResourceValid = () => {
    const res = resource();
    return res !== null && res !== undefined;
  };

  const prototypeOfValue = () => {
    return ["int", "float"].includes(props.type ?? "") ? "number" : "text";
  };

  const values = () => {
    if (!isResourceValid()) return {};

    if (prototypeOfValue() === "number") {
      const res = resource();
      if (!res || !props.name || !(props.name in res)) return {};

      const resourceValue = (res as any)[props.name];
      const isNegative = resourceValue < 0;

      return {
        min: isNegative ? String(resourceValue * 2) : "0",
        value: resourceValue,
        max: isNegative ? "-1" : String(resourceValue * 2),
        step: props.type == "float" ? "0.1" : "1",
      };
    }
  };

  const setDefaults = () => {
    if (!isResourceValid()) return;
    const res = resource();
    if (res && props.name && props.name in res) {
      defaultValue = (res as any)[props.name];
    }
  };

  const between = () => {
    if (prototypeOfValue() !== "number" || !reference) return false;

    const value = Number(reference.value);
    const min = Number(reference.min);
    const max = Number(reference.max);

    if (isNaN(value)) return false;
    return value >= min && value <= max;
  };

  const calculateMax = () => {
    if (!reference) return;

    if (props.min !== undefined && props.max !== undefined) {
      reference.min = String(props.min);
      reference.max = String(props.max);
      reference.placeholder = `Between ${reference.min} and ${reference.max}`;
      return;
    }

    if (!isResourceValid()) {
      reference.min = "-999999";
      reference.max = "999999";
      return;
    }

    const res = resource();
    if (!res || !props.name || !(props.name in res)) return;

    const currentValue = Number((res as any)[props.name]) || 0;
    const isNegative = currentValue < 0;

    if (isNegative) {
      reference.min = String(Math.min(-100000, currentValue * 10));
      reference.max = "0";
    } else {
      reference.min = "0";
      reference.max = String(Math.max(100000, currentValue * 10));
    }

    reference.placeholder = `Min ${reference.min}, Max ${reference.max}`;
  };

  const reset = () => {
    if (!isResourceValid()) return;
    if (defaultValue === undefined) return notify("No default value set.", "error");

    const res = resource();
    if (!res || !props.name) return;

    reference!.value = defaultValue as any;
    (res as any)[props.name] = reference!.value;
    notify(`${props.name} reset to ${reference!.value}`, "info");
  };

  if (props.ref) {
    props.ref({ reset: reset, resetToDefault });
  }

  const apply = (event: KeyboardEvent | InputEvent) => {
    if (prototypeOfValue() === "number") {
      if (event instanceof KeyboardEvent) {
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          const isMac = navigator.platform === "MacIntel";
          const currentValue = isNaN(parseFloat(reference?.value || "0"))
            ? parseFloat(reference?.min || "0") || 0
            : parseFloat(reference?.value || "0");

          const direction = event.key === "ArrowUp" ? 1 : -1;
          const typeModifier = props.type === "int" ? 10 : 1;
          const keyboardModifier = (isMac ? event.metaKey : event.ctrlKey)
            ? 100 * typeModifier
            : event.shiftKey
              ? 10 * typeModifier
              : event.altKey
                ? 0.1 * typeModifier
                : 1 * typeModifier;
          const currentMultiplier = multiplier();
          const totalModifier = keyboardModifier * currentMultiplier;

          const decimals = Math.max(
            (currentValue.toString().split(".")[1] || "").length,
            event.altKey ? 1 : 0
          );

          const newValue = currentValue + direction * totalModifier;
          reference!.value = newValue.toFixed(decimals);

          if (!between()) {
            if (!isResourceValid()) return;
            const res = resource();
            if (res && props.name && props.name in res) {
              reference!.value = (res as any)[props.name];
            }
            return notify(`Value must be between ${reference?.min} and ${reference?.max}`, "error");
          }

          calculateMax();
          commitStackedChange(parseFloat(reference!.value));
        }
      } else if (event instanceof InputEvent) {
        if (!between()) {
          if (!isResourceValid()) return;
          const res = resource();
          if (res && props.name && props.name in res) {
            reference!.value = (res as any)[props.name];
          }
          return notify(`Value must be between ${reference?.min} and ${reference?.max}`, "error");
        }

        const numericValue = parseFloat(reference!.value);
        calculateMax();
        commitStackedChange(numericValue);
      }
    }
  };

  const increment = () => {
    if (prototypeOfValue() !== "number" || !reference) return;
    if (!isResourceValid()) return;

    const currentValue = isNaN(parseFloat(reference.value || "0"))
      ? parseFloat(reference.min || "0") || 0
      : parseFloat(reference.value || "0");

    const baseStep = props.type === "int" ? 1 : 0.1;
    const step = baseStep * multiplier();
    const decimals = props.type === "int" ? 0 : Math.max(1, Math.ceil(Math.log10(1 / step)));
    const newValue = currentValue + step;

    reference.value = newValue.toFixed(decimals);

    if (!between()) {
      const res = resource();
      if (res && props.name && props.name in res) {
        reference.value = (res as any)[props.name];
      }
      return notify(`Value must be between ${reference.min} and ${reference.max}`, "error");
    }

    calculateMax();
    commitStackedChange(parseFloat(reference.value));
  };

  const decrement = () => {
    if (prototypeOfValue() !== "number" || !reference) return;
    if (!isResourceValid()) return;

    const currentValue = isNaN(parseFloat(reference.value || "0"))
      ? parseFloat(reference.min || "0") || 0
      : parseFloat(reference.value || "0");

    const baseStep = props.type === "int" ? 1 : 0.1;
    const step = baseStep * multiplier();
    const decimals = props.type === "int" ? 0 : Math.max(1, Math.ceil(Math.log10(1 / step)));
    const newValue = currentValue - step;

    reference.value = newValue.toFixed(decimals);

    if (!between()) {
      const res = resource();
      if (res && props.name && props.name in res) {
        reference.value = (res as any)[props.name];
      }
      return notify(`Value must be between ${reference.min} and ${reference.max}`, "error");
    }

    calculateMax();
    commitStackedChange(parseFloat(reference.value));
  };

  inputAttributes = values();
  onMount(() => {
    calculateMax();
    setDefaults();
  });
  onCleanup(() => {
    if (stackTimeout) {
      clearTimeout(stackTimeout);
      stackTimeout = null;
    }
    if (applyTimeout) {
      clearTimeout(applyTimeout);
      applyTimeout = null;
    }
    reference = undefined;
  });

  // Special rendering for color
  if (props.type === "color") {
    const currentVal = () => {
      if (props.value !== undefined) {
        if (typeof props.value === "function") {
          try {
            return String((props.value as any)());
          } catch (e) {
            return String(props.value as any);
          }
        }
        return String(props.value as any);
      }
      const res = resource();
      if (res && props.name && props.name in res) return String((res as any)[props.name]);
      return "#ffffff";
    };

    return (
      <div class="w-full bg-gray-900 dark:bg-black rounded-md p-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">{props.label || formatLabel(String(props.name || ""))}</span>
          <span class="text-sm font-mono text-green-400">{currentVal()}</span>
        </div>
        <input
          type="color"
          value={currentVal()}
          class="w-full h-8 rounded cursor-pointer"
          onInput={(e: InputEvent) => {
            const value = String((e.currentTarget as HTMLInputElement).value);
            props.onChange && props.onChange(value);
            if (isResourceValid() && props.name) {
              const res = resource();
              if (res) (res as any)[props.name] = value;
            }
            scheduleApply(value);
          }}
        />
      </div>
    );
  }

  // Special rendering for boolean toggle
  if (props.type === "boolean") {
    const currentVal = () => {
      if (props.value !== undefined) {
        if (typeof props.value === "function") {
          try {
            return Boolean((props.value as any)());
          } catch (e) {
            return Boolean(props.value as any);
          }
        }
        return Boolean(props.value as any);
      }
      const res = resource();
      if (res && props.name && props.name in res) return Boolean((res as any)[props.name]);
      return false;
    };

    return (
      <div class="w-full bg-gray-900 dark:bg-black rounded-md p-3 flex items-center justify-between">
        <div>
          <span class="text-sm text-gray-400">{props.label || formatLabel(String(props.name || ""))}</span>
          {props.comment && <div class="text-xs text-gray-500">{props.comment}</div>}
        </div>
        <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
          <button
            type="button"
            class={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
              currentVal() ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
            role="switch"
            aria-checked={currentVal()}
            onclick={() => {
              const newValue = !currentVal();
              props.onChange && props.onChange(newValue);
              if (isResourceValid() && props.name) {
                const res = resource();
                if (res) (res as any)[props.name] = newValue;
              }
              flushApply(newValue);
            }}
          >
            <span
              class={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${
                currentVal() ? "right-0 border-green-500" : "left-0 border-gray-300 dark:border-gray-600"
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  // Special rendering for range (slider)
  if (props.type === "range") {
    const currentVal = () => {
      if (props.value !== undefined) {
        if (typeof props.value === "function") {
          try {
            return Number((props.value as any)());
          } catch (e) {
            return Number(props.value as any);
          }
        }
        return Number(props.value as any);
      }
      const res = resource();
      if (res && props.name && props.name in res) return Number((res as any)[props.name]);
      return 0;
    };

    const decimals = (() => {
      const s = props.step ?? 1;
      const n = typeof s === "number" ? s : parseFloat(String(s));
      if (!isFinite(n) || n <= 0) return 0;
      const d = Math.max(0, -Math.floor(Math.log10(n)));
      return d;
    })();

    const formatValue = (v: number) => {
      if (props.valueFormatter) return props.valueFormatter(v);
      return Number.isFinite(v) ? v.toFixed(decimals) : String(v);
    };

    const showLimits = props.showLimits !== undefined ? props.showLimits : true;

    return (
      <div class="w-full bg-gray-900 dark:bg-black rounded-md p-3">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="text-sm text-gray-400">{props.label || formatLabel(String(props.name || ""))}</span>
          </div>
          <span class="text-sm font-mono text-green-400">
            {formatValue(currentVal())}
            {props.unit ? ` ${props.unit}` : ""}
          </span>
        </div>
        <input
          type="range"
          min={props.min ?? 0}
          max={props.max ?? 100}
          step={props.step ?? 1}
          value={currentVal()}
          class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          onInput={(e: InputEvent) => {
            const value = Number((e.currentTarget as HTMLInputElement).value);
            if (props.onChange) props.onChange(value);
            if (isResourceValid() && props.name) {
              const res = resource();
              if (res && props.name) (res as any)[props.name] = value;
            }
            if (notifyMode === "input" || notifyMode === "both") {
              Notify.success(
                `${formatValue(value)}${props.unit ? " " + props.unit : ""}`,
                props.notifyCategory || notifyCategory
              );
            }
            scheduleApply(value);
          }}
          onPointerUp={(e) => {
            const v = Number((e.currentTarget as HTMLInputElement).value);
            flushApply(v);
          }}
        />
        {props.comment && (
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">{props.comment}</div>
        )}
        {showLimits && (
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {props.min ?? 0}
              {props.unit ? ` ${props.unit}` : ""}
              {props.minLabel ? ` • ${props.minLabel}` : ""}
            </span>
            <span>
              {props.max ?? 100}
              {props.unit ? ` ${props.unit}` : ""}
              {props.maxLabel ? ` • ${props.maxLabel}` : ""}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default rendering: numeric/text with multiplier controls
  return (
    <div class="w-full bg-gray-900 dark:bg-black rounded-md p-3 flex items-center justify-between">
      <span class="text-sm text-gray-400">{formatLabel(String(props.name || ""))}</span>
      <div class="flex items-center space-x-3">
        <input
          class="font-display text-2xl text-cyan-400 bg-transparent border-none w-28 text-right focus:ring-0 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type={prototypeOfValue()}
          {...inputAttributes}
          ref={reference}
          onInput={(e: InputEvent) => apply(e)}
          onKeyDown={(e: KeyboardEvent) => apply(e)}
        />
        <button
          type="button"
          class="font-display bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center transition-colors select-none"
          onClick={cycleMultiplier}
        >
          x{multiplier()}
        </button>
        <div class="flex items-center space-x-1">
          <button
            type="button"
            class="bg-gray-700 hover:bg-gray-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            onClick={decrement}
          >
            <Minus class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            onClick={increment}
          >
            <Plus class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
