import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          deep: "#0A2540",
          yellow: "#FFC72C",
          bright: "#00E5FF", // Solar blue highlight
          slate: "#1E293B",
          dark: "#030D1A",
          gray: "#F4F6F8",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-solar": "linear-gradient(135deg, #0A2540 0%, #030D1A 100%)",
        "gradient-sun": "linear-gradient(135deg, #FFC72C 0%, #FF9E00 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.15)",
        solar: "0 0 50px -10px rgba(255, 199, 44, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shine": "shine 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
