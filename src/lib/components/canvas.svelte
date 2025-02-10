<script lang="ts">
	import Konva from "konva";
	import { onMount } from "svelte";
	import { collage_templates } from "$lib/constants";
	import type { TileConfig } from "$lib/constants/collage-templates";

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

	let fileInput: HTMLInputElement | null = $state(null);

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
		tr = new Konva.Transformer({
			rotationSnaps: [0, 90, 180, 270],
			enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
		});

		mainGroup = new Konva.Group();

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

	const handleImageUpload = (cell: Konva.Group) => {
		if (!fileInput) return;
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
	};

	const createCell = (conf: TileConfig) => {
		const width = resolution.width * conf.width;
		const height = resolution.height * conf.height;
		const cell = new Konva.Group({
			name: "cell",
			x: resolution.width * conf.x,
			y: resolution.height * conf.y,
			width: width,
			height: height,
			clipWidth: resolution.width * conf.width,
			clipHeight: resolution.height * conf.height,
		});

		const background = new Konva.Rect({
			name: "cell-background",
			x: 5,
			y: 5,
			width: width - 10,
			height: height - 10,
			fill: "#48484866",
			draggable: false,
		});
		background.on("click", () => {
			handleImageUpload(cell);
		});
		background.on("mouseenter", (e) => {
			const container = e.target.getStage()?.container();
			if (container) {
				container.style.cursor = "pointer";
			}
		});
		background.on("mouseleave", (e) => {
			const container = e.target.getStage()?.container();
			if (container) {
				container.style.cursor = "default";
			}
		});

		const plus = new Konva.Text({
			name: "cell-plus",
			text: "+",
			fill: "#eee",
			fontSize: 150,
			listening: false,
		});
		plus.x((resolution.width * conf.width - plus.width()) / 2);
		plus.y((resolution.height * conf.height - plus.height()) / 2);
		cell.add(background);
		cell.add(plus);
		return cell;
	};
	$effect(() => {
		clearStage();
		const template = collage_templates[selectedTemplate];
		template.config.forEach((conf) => {
			const cell = createCell(conf);
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
	bind:clientHeight={wrapperSize.height}>
	<div
		id="stage-container"
		class="bg-base-800"
		bind:clientWidth={containerWidth}
		bind:clientHeight={containerHeight}>
	</div>
</div>
<div class="hidden">
	<input bind:this={fileInput} type="file" accept="image/*" />
</div>
<input
	type="color"
	bind:value={borderConfig.color}
	onchange={changeBorderColor} />
<input
	type="range"
	min={0}
	max={20}
	bind:value={borderConfig.width}
	onchange={changeBorderWidth} />
<button onclick={() => downloadStage()}>Download</button>
