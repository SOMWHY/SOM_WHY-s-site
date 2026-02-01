export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#333333",
          dark: "#ffffff",
        },
        background: {
          light: "#f8f8f8",
          dark: "#000000",
        },
        text: {
          light: "#333333",
          dark: "#ffffff",
        },
        muted: {
          light: "#666666",
          dark: "#666666",
        },
        accent: {
          light: "#00ff41",
          dark: "#00ff41",
        },
      },
    },
  },
  plugins: [],
}
