/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        card: "#131929",
        border: "#1E2A3A",
        teal: { DEFAULT: "#00D4AA", dim: "#00D4AA22" },
        cyan: "#22D3EE",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
}

