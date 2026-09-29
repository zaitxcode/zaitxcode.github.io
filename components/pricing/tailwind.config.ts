import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 dark tonal palette — ZaitXCode identity
        surface: "rgb(var(--md-surface) / <alpha-value>)",
        "surface-container": "rgb(var(--md-surface-container) / <alpha-value>)",
        "surface-container-high":
          "rgb(var(--md-surface-container-high) / <alpha-value>)",
        "on-surface": "rgb(var(--md-on-surface) / <alpha-value>)",
        "on-surface-variant":
          "rgb(var(--md-on-surface-variant) / <alpha-value>)",
        primary: "rgb(var(--md-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--md-on-primary) / <alpha-value>)",
        secondary: "rgb(var(--md-secondary) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
