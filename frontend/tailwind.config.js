/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a', // deep background
          800: '#1e293b', // card background
          700: '#334155', // border
        },
        primary: {
          500: '#3b82f6', // blue primary
          600: '#2563eb', // blue hover
        },
        accent: {
          success: '#10b981', // green
          danger: '#ef4444', // red
          warning: '#f59e0b', // yellow
        }
      }
    },
  },
  plugins: [],
}
