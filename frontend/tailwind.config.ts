import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fdf8f6',
                    100: '#f9ede7',
                    200: '#f3d9cc',
                    300: '#e9bda6',
                    400: '#dc9a79',
                    500: '#c97d56',
                    600: '#b5684a',
                    700: '#97533e',
                    800: '#7c4536',
                    900: '#673b30',
                    950: '#381d17',
                },
                gold: {
                    50: '#fdfbe9',
                    100: '#fcf6c5',
                    200: '#f9ea8e',
                    300: '#f5d84d',
                    400: '#f0c41d',
                    500: '#e0ab10',
                    600: '#c1850b',
                    700: '#9a600d',
                    800: '#7f4c12',
                    900: '#6c3e15',
                    950: '#3f2008',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
