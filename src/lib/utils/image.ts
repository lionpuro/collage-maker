import Konva from "konva";
import { nanoid } from "nanoid";

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
