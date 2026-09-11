import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#ebfeef",
          dim: "#ccdfd0",
          bright: "#ebfeef",
          "container-lowest": "#ffffff",
          "container-low": "#e5f8ea",
          container: "#dff3e4",
          "container-high": "#daedde",
          "container-highest": "#d4e7d9",
        },
        on: {
          surface: "#0f1f16",
          "surface-variant": "#414942",
        },
        outline: {
          DEFAULT: "#717972",
          variant: "#c0c9c0",
        },
        primary: {
          DEFAULT: "#00361e",
          on: "#ffffff",
          container: "#1b4d33",
          "on-container": "#89bd9c",
          fixed: "#b9efcb",
          hover: "#5a7d3c",
        },
        secondary: {
          DEFAULT: "#466729",
          on: "#ffffff",
          container: "#c6efa1",
          "on-container": "#4c6e2f",
          hover: "#5a7d3c",
        },
        tertiary: {
          DEFAULT: "#213302",
          container: "#374a16",
          "on-container": "#a2ba7a",
        },
        error: {
          DEFAULT: "#ba1a1a",
          on: "#ffffff",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        tag: {
          DEFAULT: "#8fa668",
        },
        canvas: "#FAF8F2",
        parchment: "#F3EFE6",
        hairline: "#E3DED2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["38px", { lineHeight: "46px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["30px", { lineHeight: "38px", letterSpacing: "0em", fontWeight: "600" }],
        "headline-md": ["28px", { lineHeight: "36px", fontWeight: "500" }],
        "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "500" }],
        "title-lg": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.04em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.08em", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        "2xs": "0.25rem",
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4.5rem",
        "4xl": "6rem",
        gutter: "1.5rem",
      },
      maxWidth: {
        container: "75rem",
      },
      boxShadow: {
        "elevation-low":
          "0 2px 6px -1px rgba(27, 77, 51, 0.05), 0 1px 3px -1px rgba(19, 35, 26, 0.04)",
        "elevation-mid":
          "0 8px 24px -4px rgba(27, 77, 51, 0.08), 0 4px 12px -2px rgba(19, 35, 26, 0.04)",
        "elevation-high":
          "0 20px 40px -8px rgba(19, 35, 26, 0.12), 0 8px 16px -4px rgba(27, 77, 51, 0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drawer-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out both",
        "drawer-in": "drawer-in 280ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;