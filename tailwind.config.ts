import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {
			colors: {
				base: {
					50: "rgb(250 250 250)",
					100: "rgb(244 244 245)",
					200: "rgb(228 228 231)",
					300: "rgb(212 212 216)",
					400: "rgb(161 161 170)",
					500: "rgb(113 113 122)",
					600: "rgb(82 82 91)",
					700: "rgb(63 63 70)",
					800: "rgb(39 39 42)",
					900: "rgb(24 24 27)",
					950: "rgb(9 9 11)",
				},
			},
		},
	},

	plugins: [],
} satisfies Config;
