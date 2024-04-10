/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFF7FC",
        primary: "#EA8140",
        secondary: "#1B1B1B",
        lightBlue: "#C4E4FF",
        darkBlue: "#7AA2E3",
      },
    },
  },
  plugins: [],
};
