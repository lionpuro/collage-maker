import type { Resolution } from "$lib/types";
import Konva from "konva";

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
