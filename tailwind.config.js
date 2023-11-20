/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/views/**/*.vue',
        './src/views/*.vue',
        './src/components/*.vue',
        './src/components/**/*.vue',
        './src/views/*.vue',
        './src/views/**/*.vue',
        './src/layouts/*.vue',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ], 
    plugins: [],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#327b6d',
                'secondary': '#c9e9e2',
                'accent': '#597870',
                'text': '#0a1a17',
                'background': '#edf8f5',
                
                'primary-dark': '#84cdbe',
                'secondary-dark': '#16362f',
                'accent-dark': '#87A69E',
                'text-dark': '#e5f5f2',
                'background-dark': '#07120f',
            }
        }
    }
};