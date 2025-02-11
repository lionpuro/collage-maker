import type { Resolution } from "$lib/types";
import Konva from "konva";

export function downloadStage(stage: Konva.Stage, resolution: Resolution) {
	const mainGroup = stage.findOne(".main-group");
	const container = stage.container();
	if (!mainGroup || !container) {
		return;
	}

	const ratio = resolution.height / resolution.width;
	const scale = Math.min(
		container.clientWidth / resolution.width,
		(ratio * container.clientWidth) / resolution.height,
	);
	stage.scale({ x: 1, y: 1 });

	const dataURL = mainGroup.toDataURL({
		x: mainGroup.x(),
		y: mainGroup.y(),
		width: resolution.width,
		height: resolution.height,
	});
	stage.scale({ x: scale, y: scale });

	const link = document.createElement("a");
	link.href = dataURL;
	link.download = "collage.png";
	link.click();
}

export function handleImageUpload(
	fileInput: HTMLInputElement,
	cell: Konva.Group,
	tr: Konva.Transformer,
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
					image: image,
					x: 0,
					y: 0,
					width: size.width,
					height: size.height,
					draggable: true,
				});
				img.on("mousedown touchstart", () => {
					tr.nodes([img]);
				});
				cell.add(img);
				cell.findOne(".cell-background")?.destroy();
				cell.findOne(".cell-plus")?.destroy();
				tr.nodes([img]);
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
	const layer = group.getLayer();
	if (!layer) return;
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
	group.find(".cell").forEach((shape) => {
		if (shape.getType() === "Group") {
			const cell = shape as Konva.Group;
			const border = new Konva.Rect({
				name: "border",
				x: 0,
				y: 0,
				width: cell.width(),
				height: cell.height(),
				strokeWidth: width,
				stroke: color,
				listening: false,
			});
			cell.add(border);
		}
	});
}
