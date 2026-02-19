module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                linkedin: {
                    blue: '#0a66c2',
                    light: '#f3f2ef',
                    dark: '#000000e6',
                    gray: '#666666',
                },
                coral: { 500: '#ff7f50' },
                navy: { 900: '#000080' },
                amber: { 600: '#d97706' },
                emerald: { 600: '#059669' },
                rose: { 600: '#e11d48' },
                cyan: { 600: '#0891b2' },
                teal: { 600: '#0d9488' }
            }
        },
    },
    plugins: [],
}
