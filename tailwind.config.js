/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './node_modules/@tremor/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            fontSize: {
                'display-large': '64px',
                'display-medium': '48px',
                'display-small': '40px',
                'headline-large': '32px',
                'headline-medium': '28px',
                'headline-small': '24px',
                'title-large': '22px',
                'title-medium': '20px',
                'title-small': '18px',
                'label-large': '16px',
                'label-medium': '14px',
                'label-small': '12px',
                'body-large': '16px',
                'body-medium': '14px',
                'body small': '12px',
            },
        },
    },
    plugins: [],
};
