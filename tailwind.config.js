/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fff",
        primary: "#FBF3D5",
        secondary: "#332941",
        lightBlue: "#C4E4FF",
        darkBlue: "#7AA2E3",
        gray: "#EEEEEE",
      },
    },
  },
  plugins: [],
};
