const { Component } = require('lucide-react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/Components/**/*.{js,jsx,ts,tsx,html}",
    "./src/**/*.{js,jsx,ts,tsx,html}" // Include all JS, JSX, TS, and TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
