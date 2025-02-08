type TileConfig = {
	x: number;
	y: number;
	width: number;
	height: number;
};
export type CollageTemplate = {
	name: string;
	icon: string;
	config: TileConfig[];
};

export const collage_templates: CollageTemplate[] = [
	{
		name: "Two landscape photos",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_8)'%3E%3Crect x='0.5' y='15.5' width='29' height='14' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='29' height='15' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_8'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 2,
				width: 1,
			},
			{
				x: 0,
				y: 1 / 2,
				height: 1 / 2,
				width: 1,
			},
		],
	},
	{
		name: "Three landscape photos",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_2)'%3E%3Crect x='0.5' y='9.5' width='29' height='11' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='29' height='9' stroke='white'/%3E%3Crect x='0.5' y='20.5' width='29' height='9' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_2'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 3,
				width: 1,
			},
			{
				x: 0,
				y: 1 / 3,
				height: 1 / 3,
				width: 1,
			},
			{
				x: 0,
				y: 2 / 3,
				height: 1 / 3,
				width: 1,
			},
		],
	},
	{
		name: "Two portrait photos",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_12)'%3E%3Crect x='0.5' y='29.5' width='29' height='14' transform='rotate(-90 0.5 29.5)' stroke='white'/%3E%3Crect x='14.5' y='29.5' width='29' height='15' transform='rotate(-90 14.5 29.5)' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_12'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 0,
				height: 1,
				width: 1 / 2,
			},
		],
	},
	{
		name: "Three portrait photos",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_7_30)'%3E%3Crect x='9.5' y='29.5' width='29' height='11' transform='rotate(-90 9.5 29.5)' stroke='white'/%3E%3Crect x='0.5' y='29.5' width='29' height='9' transform='rotate(-90 0.5 29.5)' stroke='white'/%3E%3Crect x='20.5' y='29.5' width='29' height='9' transform='rotate(-90 20.5 29.5)' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_7_30'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1,
				width: 1 / 3,
			},
			{
				x: 1 / 3,
				y: 0,
				height: 1,
				width: 1 / 3,
			},
			{
				x: 2 / 3,
				y: 0,
				height: 1,
				width: 1 / 3,
			},
		],
	},
	{
		name: "4 squares",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_18)'%3E%3Crect x='15.5' y='15.5' width='14' height='14' stroke='white'/%3E%3Crect x='0.5' y='15.5' width='15' height='14' stroke='white'/%3E%3Crect x='15.5' y='0.5' width='14' height='15' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='15' height='15' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_18'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 0,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 0,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
		],
	},
	{
		name: "6 portrait",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_8_2)'%3E%3Crect x='20.5' y='0.5' width='9' height='15' stroke='white'/%3E%3Crect x='20.5' y='15.5' width='9' height='14' stroke='white'/%3E%3Crect x='10.5' y='0.5' width='10' height='15' stroke='white'/%3E%3Crect x='10.5' y='15.5' width='10' height='14' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='10' height='15' stroke='white'/%3E%3Crect x='0.5' y='15.5' width='10' height='14' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_8_2'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 2,
				width: 1 / 3,
			},
			{
				x: 1 / 3,
				y: 0,
				height: 1 / 2,
				width: 1 / 3,
			},
			{
				x: 2 / 3,
				y: 0,
				height: 1 / 2,
				width: 1 / 3,
			},
			{
				x: 0,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 3,
			},
			{
				x: 1 / 3,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 3,
			},
			{
				x: 2 / 3,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 3,
			},
		],
	},
	{
		name: "4 squares uneven",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_24)'%3E%3Crect x='15.5' y='11.5' width='14' height='18' stroke='white'/%3E%3Crect x='0.5' y='18.5' width='15' height='11' stroke='white'/%3E%3Crect x='15.5' y='0.5' width='14' height='11' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='15' height='18' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_24'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 6 / 10,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 0,
				height: 4 / 10,
				width: 1 / 2,
			},
			{
				x: 0,
				y: 6 / 10,
				height: 4 / 10,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 4 / 10,
				height: 6 / 10,
				width: 1 / 2,
			},
		],
	},
	{
		name: "3 squares - 2 left, 1 right",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_29)'%3E%3Crect x='0.5' y='15.5' width='15' height='14' stroke='white'/%3E%3Crect x='15.5' y='0.5' width='14' height='29' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='15' height='15' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_29'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 0,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 0,
				height: 1,
				width: 1 / 2,
			},
		],
	},
	{
		name: "3 squares - 2 right, 1 left",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_34)'%3E%3Crect x='14.5' y='15.5' width='15' height='14' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='14' height='29' stroke='white'/%3E%3Crect x='14.5' y='0.5' width='15' height='15' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_34'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 0,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
		],
	},
	{
		name: "1 landscape, 2 squares bottom",
		icon: "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5_18)'%3E%3Crect x='15.5' y='14.5' width='14' height='15' stroke='white'/%3E%3Crect x='0.5' y='14.5' width='15' height='15' stroke='white'/%3E%3Crect x='0.5' y='0.5' width='29' height='14' stroke='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5_18'%3E%3Crect width='30' height='30' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
		config: [
			{
				x: 0,
				y: 0,
				height: 1 / 2,
				width: 1,
			},
			{
				x: 0,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
			{
				x: 1 / 2,
				y: 1 / 2,
				height: 1 / 2,
				width: 1 / 2,
			},
		],
	},
];
