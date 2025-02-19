export type FilterConfig = {
	name: "brightness" | "contrast" | "saturation";
	min: number;
	max: number;
	default: number;
};

export const filterConfig: { [key: string]: FilterConfig } = {
	brightness: {
		name: "brightness",
		min: 0,
		max: 200,
		default: 100,
	},
	contrast: {
		name: "contrast",
		min: 0,
		max: 200,
		default: 100,
	},
	saturate: {
		name: "saturation",
		min: 0,
		max: 200,
		default: 100,
	},
};
