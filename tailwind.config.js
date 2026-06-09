/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#070709",     // Наш фирменный глубокий черный
        aura: "#6d28d9",     // Фиолетовый неон для кнопок и акцентов
        mystic: "#a78bfa",   // Светло-пурпурный для второстепенного текста
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        "aura-glow": "0 0 25px rgba(109, 40, 217, 0.45)",
      }
    },
  },
  plugins: [],
};