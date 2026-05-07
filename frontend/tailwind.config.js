// tailwind.config.js
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },
      borderRadius: {
        DEFAULT: "0.625rem",
      },
    },
  },
  plugins: [animatePlugin],
};
