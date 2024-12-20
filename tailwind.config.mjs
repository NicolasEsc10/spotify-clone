/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#121212',
				secondary: '#2a2a2a',
				tertiary: '#b3b3b3',
			},
		},
	},
	plugins: [],
}
