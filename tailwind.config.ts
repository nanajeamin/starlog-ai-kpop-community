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
        ink: "#1c1c1e",
        canvas: "#ffffff",
        surface: "#f7f8fa",
        "surface-soft": "#fafbfc",
        hairline: "#e0e2e8",
        "hairline-soft": "#eef0f3",
        "hairline-strong": "#c7cad5",
        steel: "#6b6f7e",
        slate: "#555a6a",
        stone: "#8e91a0",
        muted: "#a5a8b5",
        charcoal: "#2c2c34",
        "on-dark": "#ffffff",
        "on-dark-muted": "#a5a8b5",
        "footer-bg": "#1c1c1e",
        "brand-blue": "#4262ff",
        success: "#00b473",
        "block-lilac": "#ede8f8",
        "block-rose": "#fde0f0",
        "block-teal": "#c3faf5",
        "block-coral": "#ffc6c6",
        "block-yellow": "#fff4c4",
        "block-navy": "#1a1a3e",
        "block-mint": "#d4f5e9",
        "bts-purple": "#9B59B6",
        "bts-light": "#ede8f8",
        "bp-pink": "#E91E8C",
        "bp-light": "#fde0f0",
        "aespa-blue": "#00B4D8",
        "aespa-light": "#c3faf5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
        feature: "32px",
        full: "9999px",
      },
      boxShadow: {
        card: "rgba(5, 0, 56, 0.06) 0px 4px 12px 0px",
        mockup: "rgba(5, 0, 56, 0.08) 0px 12px 32px -4px",
        subtle: "rgba(5, 0, 56, 0.04) 0px 1px 2px 0px",
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
