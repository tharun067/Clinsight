/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E6F7F5',
          100: '#B3E8E1',
          200: '#80D9CD',
          300: '#4DCAB9',
          400: '#1ABBA5',
          500: '#14B8A6',
          600: '#10A693',
          700: '#0D9480',
          800: '#0A826D',
          900: '#07705A',
        },
        success: { 50: '#E8F5E9', 100: '#C8E6C9', 500: '#4CAF50', 600: '#43A047', 700: '#388E3C' },
        warning: { 50: '#FFF8E1', 100: '#FFECB3', 500: '#FFA726', 600: '#FB8C00', 700: '#F57C00' },
        danger: { 50: '#FFEBEE', 100: '#FFCDD2', 500: '#EF5350', 600: '#E53935', 700: '#D32F2F' },
        info: { 50: '#E3F2FD', 100: '#BBDEFB', 500: '#2196F3', 600: '#1E88E5', 700: '#1976D2' },
      },
      borderRadius: {
        card: '1rem',
        button: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        modal: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
