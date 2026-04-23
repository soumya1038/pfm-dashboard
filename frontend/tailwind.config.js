export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
        },
        background: {
          light: "#F9FAFB",
          dark: "#1F2937",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          light: "#F3F4F6",
        },
      },
    },
  },
  plugins: [],
};
