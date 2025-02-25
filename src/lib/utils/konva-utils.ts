import { exporting } from "$lib/stores";
import type { Resolution } from "$lib/types";
import { nanoid } from "nanoid";
import Konva from "konva";

export async function exportCollage(
	imageLayer: Konva.Layer,
	topLayer: Konva.Layer,
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

export function handleImageUpload(
	fileInput: HTMLInputElement,
	cell: Konva.Group,
	onSelect: (node: Konva.Node | null) => void,
	callback?: (img: Konva.Image) => void,
) {
	fileInput.onchange = async (e) => {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		const reader = new FileReader();
		reader.readAsDataURL(input.files[0]);
		reader.onload = (e: ProgressEvent<FileReader>) => {
			if (!(e.target instanceof FileReader)) {
				return;
			}
			if (!e.target.result) return;
			const src = e.target.result.toString();
			const image = new window.Image();
			image.src = src;
			image.onload = () => {
				image.width = image.naturalWidth;
				image.height = image.naturalHeight;
				const scale = Math.max(
					cell.width() / image.width,
					cell.height() / image.height,
				);
				const size = {
					width: image.width * scale,
					height: image.height * scale,
				};

				const img = new Konva.Image({
					id: nanoid(),
					name: "image",
					image: image,
					x: 0,
					y: 0,
					width: size.width,
					height: size.height,
					draggable: true,
				});
				const box = new Konva.Group({
					width: cell.width(),
					height: cell.height(),
				});
				img.on("mousedown touchstart", () => {
					onSelect(img);
				});
				box.add(img);
				cell.add(box);
				cell.findOne(".cell-background")?.destroy();
				cell.findOne(".cell-plus")?.destroy();
				onSelect(img);
				if (callback) {
					callback(img);
				}
			};
		};
	};
	fileInput.click();
	fileInput.value = "";
}

export function setBorders(
	resolution: Resolution,
	group: Konva.Group,
	width: number,
	color: string,
) {
	const stage = group.getStage();
	if (!stage) return;
	group.find(".border").forEach((node) => node.destroy());
	const outerBorder = new Konva.Rect({
		name: "border",
		x: 0,
		y: 0,
		width: resolution.width,
		height: resolution.height,
		strokeWidth: width * 2,
		stroke: color,
		listening: false,
	});
	group.add(outerBorder);
	stage.find(".cell").forEach((shape) => {
		if (shape.getType() === "Group") {
			const cell = shape as Konva.Group;
			const border = new Konva.Rect({
				name: "border",
				x: cell.x(),
				y: cell.y(),
				width: cell.width(),
				height: cell.height(),
				strokeWidth: width,
				stroke: color,
				listening: false,
			});
			group.add(border);
		}
	});
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
export function scaleImage(image: Konva.Node, zoom: number) {
	const scale = zoom / 100;
	const box = image.getParent();
	const cell = box?.getParent();
	if (!box || !cell) {
		return;
	}

	const center = {
		x: (cell.width() - cell.width() * scale) / 2,
		y: (cell.height() - cell.height() * scale) / 2,
	};
	box.scale({ x: scale, y: scale });
	box.position(center);
}
