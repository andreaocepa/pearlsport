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
        pearl: {
          red: "#C0160C",
          deep: "#7F0E08",
          light: "#FDECEA",
          soft: "#FAD3CF",
          blush: "#F5B8B3",
        },
        warm: {
          white: "#FFF7F6",
        },
        dark: {
          text: "#1A1A1A",
        },
        muted: {
          text: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 4px rgba(192, 22, 12, 0.08)",
        "card-hover": "0 4px 16px rgba(192, 22, 12, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
