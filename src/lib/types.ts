export type Resolution = {
	width: number;
	height: number;
};

export type TileConfig = {
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
