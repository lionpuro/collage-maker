<script lang="ts">
	import Konva from "konva";
	import { onMount } from "svelte";
	import { collage_templates } from "$lib/constants";

	type Props = {
		resolution: { width: number; height: number };
		selectedTemplate: number;
	};

	let { resolution, selectedTemplate }: Props = $props();

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let mainGroup: Konva.Group;
	let tr: Konva.Transformer;

	let wrapperSize = $state({ width: 0, height: 0 });

	let containerWidth: number = $state(resolution.width);
	let containerHeight: number = $state(resolution.height);
	let borderConfig = $state({ width: 0, color: "#ffffff" });

	onMount(() => {
		stage = new Konva.Stage({
			container: "stage-container",
			width: containerWidth,
			height: containerHeight,
		});
		stage.on("mousedown touchstart", (e) => {
			if (e.target === stage) {
				return tr.nodes([]);
			}
		});
		setDimensions();

		layer = new Konva.Layer();
		tr = new Konva.Transformer();

		const circle = new Konva.Circle({
			x: stage.width() / 2,
			y: stage.height() / 2,
			radius: 70,
			fill: "red",
			stroke: "black",
			strokeWidth: 4,
			draggable: true,
		});
		circle.on("mousedown touchstart", () => {
			tr.nodes([circle]);
		});

		mainGroup = new Konva.Group();
		mainGroup.add(circle);

		layer.add(mainGroup);
		layer.add(tr);

		stage.add(layer);
		layer.draw();
	});

	$effect(() => {
		if (!stage) return;
		const scale = Math.min(
			wrapperSize.width / resolution.width,
			wrapperSize.height / resolution.height,
		);
		stage.width(resolution.width * scale);
		stage.height(resolution.height * scale);
		stage.scale({ x: scale, y: scale });
	});

	const clearStage = () => {
		tr.nodes([]);
		const nodesToDestroy = mainGroup
			.getChildren()
			.filter((node) => node.name() === "cell" || node.name() === "border");
		nodesToDestroy.forEach((node) => node.destroy());
		borderConfig.width = 0;
	};

	$effect(() => {
		clearStage();
		const template = collage_templates[selectedTemplate];
		template.config.forEach((conf) => {
			const cell = new Konva.Group({
				name: "cell",
				x: resolution.width * conf.x,
				y: resolution.height * conf.y,
				width: resolution.width * conf.width,
				height: resolution.height * conf.height,
				clipWidth: resolution.width * conf.width,
				clipHeight: resolution.height * conf.height,
			});
			const rect = new Konva.Rect({
				name: "rect",
				x: 0,
				y: 0,
				width: resolution.width * conf.width,
				height: resolution.height * conf.height,
				fill: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
				draggable: true,
			});
			rect.on("mousedown touchstart", () => {
				tr.nodes([rect]);
			});
			cell.add(rect);
			mainGroup.add(cell);
		});
	});

	const setDimensions = () => {
		const scale = Math.min(
			wrapperSize.width / resolution.width,
			wrapperSize.height / resolution.height,
		);
		stage.width(resolution.width * scale);
		stage.height(resolution.height * scale);
		stage.scale({ x: scale, y: scale });
	};

	const downloadStage = () => {
		const ratio = resolution.height / resolution.width;
		const scale = Math.min(
			containerWidth / resolution.width,
			(ratio * containerWidth) / resolution.height,
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
	};

	type ChangeEvent<T extends HTMLElement> = Event & {
		currentTarget: EventTarget & T;
	};

	const changeBorderColor = (e: ChangeEvent<HTMLInputElement>) => {
		const color = e.currentTarget.value;
		const borders = layer.find(".border") as Konva.Rect[];
		borders.forEach((child) => child.stroke(color));
	};

	const changeBorderWidth = (e: ChangeEvent<HTMLInputElement>) => {
		const width = Number(e.currentTarget.value) * 10;
		mainGroup.find(".border").forEach((node) => node.destroy());
		const outerBorder = new Konva.Rect({
			name: "border",
			x: 0,
			y: 0,
			width: resolution.width,
			height: resolution.height,
			strokeWidth: width * 2,
			stroke: borderConfig.color,
			listening: false,
		});
		mainGroup.add(outerBorder);
		layer.find(".cell").forEach((shape) => {
			if (shape.getType() === "Group") {
				const cell = shape as Konva.Group;
				const border = new Konva.Rect({
					name: "border",
					x: 0,
					y: 0,
					width: cell.width(),
					height: cell.height(),
					strokeWidth: width,
					stroke: borderConfig.color,
					listening: false,
				});
				cell.add(border);
			}
		});
	};
</script>

<div
	id="container"
	class="flex h-full min-h-0 w-full flex-col items-center justify-center"
	bind:clientWidth={wrapperSize.width}
	bind:clientHeight={wrapperSize.height}
>
	<div
		id="stage-container"
		class="bg-base-800"
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}
	></div>
</div>
<input type="color" bind:value={borderConfig.color} onchange={changeBorderColor} />
<input type="range" min={0} max={20} bind:value={borderConfig.width} onchange={changeBorderWidth} />
<button onclick={() => downloadStage()}>Download</button>
