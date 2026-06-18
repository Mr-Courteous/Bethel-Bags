import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97A",
          dark: "#A07C2A",
          muted: "#F5EDD6",
        },
        empire: {
          black: "#0A0A0A",
          charcoal: "#1A1A1A",
          dark: "#111111",
          grey: "#6B6B6B",
          light: "#F8F6F0",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A07C2A 100%)",
        "gold-shimmer": "linear-gradient(90deg, #A07C2A 0%, #E8C97A 30%, #C9A84C 50%, #E8C97A 70%, #A07C2A 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
