/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Tharo Brand Colors
                burgundy: {
                    50: "#fdf2f4",
                    100: "#fce7eb",
                    200: "#f9d2da",
                    300: "#f4b0bd",
                    400: "#eb8296",
                    500: "#df5670",
                    600: "#c93451",
                    700: "#a8233e",
                    800: "#8c2036", // Primary Brand Color
                    900: "#761f31",
                    950: "#430d18",
                },
                cream: {
                    50: "#fbfaf9",
                    100: "#f6f4f0",
                    200: "#ede8e0",
                    300: "#e0d6c8",
                    400: "#d0bfa8",
                    500: "#c2a88b",
                    600: "#b59373",
                    700: "#96785d",
                    800: "#7d6450",
                    900: "#655243",
                    950: "#362b23",
                },
                gold: {
                    500: "#d4af37",
                    600: "#b8962e",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-montserrat)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
                script: ["var(--font-pinyon-script)", "cursive"],
            },
        },
    },
    plugins: [],
};
module.exports = config;
