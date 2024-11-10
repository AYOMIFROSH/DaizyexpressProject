/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6153CD",
      },
      fontFamily: {
        inter: ["Inter", "sans-sarif"],
        cursive: ["Ephesis", "serif"],
      },
      container: {
        center: true,
        padding: {
          default: "1rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
        },
      },
    },
  },
  plugins: [],
};
