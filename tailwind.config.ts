import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#070B14",
          900: "#0B1220",
          800: "#111A2C",
          700: "#182640",
        },
        vital: {
          400: "#5EEAD4",
          500: "#22D3EE",
          600: "#0EA5B7",
        },
        signal: {
          400: "#4ADE80",
          500: "#34D399",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 0 1px rgba(94,234,212,0.25), 0 8px 30px rgba(34,211,238,0.15)",
        card: "0 20px 50px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        pulseline: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        blip: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseline: "pulseline 2.4s ease-out forwards",
        blip: "blip 2.6s ease-in-out infinite",
        floatUp: "floatUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
