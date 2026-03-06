import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"], // High-tech, digital-style font for readouts
        sans: ["Roboto", "sans-serif"], // Clean, readable font for body text
      },
      colors: {
        primary: "#3b82f6", // A vibrant blue for controls and highlights
        "background-light": "#e2e8f0", // Light mode: cool light gray
        "background-dark": "#0a0e14", // Dark mode: deep, near-black blue
      },
    },
  },
  plugins: [],
} satisfies Config;
