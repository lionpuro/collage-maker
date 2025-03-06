import type { Layer } from "konva/lib/Layer";
import type { Resolution } from "$lib/types";
import { exporting } from "$lib/stores";

export async function exportCollage(
	imageLayer: Layer,
	topLayer: Layer,
	resolution: Resolution,
	filter: string,
): Promise<Blob | null> {
	exporting.set(true);
	const stage = imageLayer.getStage();
	const container = stage?.container();
	if (!stage || !container) {
		return null;
	}
	const ratio = resolution.height / resolution.width;
	const scale = Math.min(
		container.clientWidth / resolution.width,
		(ratio * container.clientWidth) / resolution.height,
	);
	stage.scale({ x: 1, y: 1 });

	const canvasConfig = {
		x: 0,
		y: 0,
		width: resolution.width,
		height: resolution.height,
	};
	const borders = topLayer.toCanvas(canvasConfig);
	const canvas = imageLayer.toCanvas(canvasConfig);
	const ctx = canvas?.getContext("2d");
	if (!canvas || !ctx) {
		return null;
	}
	ctx.filter = filter;
	ctx.drawImage(canvas, 0, 0);

	const imgBlob = await canvasToBlob(canvas);
	if (!imgBlob) {
		return null;
	}

	const images = await asyncImage(URL.createObjectURL(imgBlob));

	const resultCanvas = document.createElement("canvas");
	resultCanvas.width = resolution.width;
	resultCanvas.height = resolution.height;

	const resultCtx = resultCanvas.getContext("2d");
	if (!resultCtx) {
		return null;
	}
	resultCtx.drawImage(images, 0, 0);
	resultCtx.drawImage(borders, 0, 0);

	const result = await canvasToBlob(resultCanvas);

	stage.scale({ x: scale, y: scale });

	return result;
}

async function canvasToBlob(canvas: HTMLCanvasElement) {
	return new Promise<Blob | null>((resolve) => {
		canvas.toBlob((blob) => resolve(blob));
	});
}

async function asyncImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject;
		image.src = src;
	});
}
