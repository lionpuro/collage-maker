<script lang="ts">
	import {
		Panel,
		Header,
		LoadingOverlay,
		Filters,
		Slider,
	} from "$lib/components";
	import { collage_templates } from "$lib/constants";
	import Konva from "konva";
	import { onMount } from "svelte";
	import {
		handleImageUpload,
		exportCollage,
		setBorders,
		scaleImage,
	} from "$lib/utils";
	import type { TileConfig } from "$lib/types";
	import { exporting, mediaQueryStore } from "$lib/stores";
	import { getFilterString } from "$lib/stores/filter-store.svelte";
	import { resetFilters } from "$lib/stores/filter-store.svelte";
	const lgViewport = mediaQueryStore("(min-width: 1024px)");

	let selectedTemplate = $state<number>(0);
	let selectedNode = $state<Konva.Node | null>(null);
	let resolution = $state({ width: 3000, height: 2000 });
	let orientation = $derived<"square" | "landscape" | "portrait">(
		resolution.width === resolution.height
			? "square"
			: resolution.width > resolution.height
				? "landscape"
				: "portrait",
	);

	let stage: Konva.Stage;
	let layer: Konva.Layer = new Konva.Layer();
	let topLayer: Konva.Layer;
	let mainGroup: Konva.Group;
	let borderGroup: Konva.Group;
	let tr: Konva.Transformer;

	let wrapperSize = $state({ width: 0, height: 0 });
	let containerWidth: number = $state(0);
	let containerHeight: number = $state(0);
	let borderConfig = $state({ width: 0, color: "#ffffff" });

	let fileInput: HTMLInputElement | null = $state(null);

	let images = $state<{ id: string; zoom: number }[]>([]);

	const selectNode = (node: Konva.Node | null) => {
		if (!node) {
			tr.nodes([]);
			selectedNode = null;
			return;
		}
		tr.nodes([node]);
		selectedNode = node;
	};

	onMount(() => {
		stage = new Konva.Stage({
			container: "stage-container",
			width: containerWidth,
			height: containerHeight,
		});
		stage.on("mousedown touchstart", (e) => {
			if (e.target === stage) {
				return selectNode(null);
			}
		});
		resizeCanvas();

		topLayer = new Konva.Layer({ id: "top-layer" });

		tr = new Konva.Transformer({
			rotationSnaps: [0, 90, 180, 270],
			enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
		});

		mainGroup = new Konva.Group({ name: "main-group" });
		layer.add(mainGroup);

		borderGroup = new Konva.Group({ id: "border-group" });
		topLayer.add(borderGroup);
		topLayer.add(tr);

		stage.add(layer);
		stage.add(topLayer);
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
		selectNode(null);
		const nodesToDestroy = [
			...mainGroup.getChildren().filter((node) => node.name() === "cell"),
			...borderGroup.getChildren().filter((node) => node.name() === "border"),
		];
		nodesToDestroy.forEach((node) => node.destroy());
		borderConfig.width = 0;
		resetFilters();
		layer.getCanvas()._canvas.style.filter = "none";
		images = [];
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
		background.on("click tap", () => {
			if (!fileInput) return;
			handleImageUpload(fileInput, cell, selectNode, (img) => {
				images.push({ id: img.id(), zoom: 100 });
			});
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

	const resizeCanvas = () => {
		const scale = Math.min(
			wrapperSize.width / resolution.width,
			wrapperSize.height / resolution.height,
		);
		stage.width(resolution.width * scale);
		stage.height(resolution.height * scale);
		stage.scale({ x: scale, y: scale });
	};

	type ChangeEvent<T extends HTMLElement> = Event & {
		currentTarget: EventTarget & T;
	};

	const changeBorderWidth = (e: ChangeEvent<HTMLInputElement>) => {
		const val = Number(e.currentTarget.value);
		borderConfig.width = val;
		const length = Math.max(resolution.width, resolution.height);
		const width = Math.round((length * (val / 100)) | 0);
		setBorders(resolution, borderGroup, width, borderConfig.color);
	};

	const handleDownload = async () => {
		tr.hide();
		const filter = getFilterString();
		const blob = await exportCollage(layer, topLayer, resolution, filter);
		if (!blob) return;
		const dataURL = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = "collage.png";
		link.click();
		exporting.set(false);
		tr.show();
	};

	const changeOrientation = (val: typeof orientation) => {
		if (orientation === val) {
			return;
		}
		resolution = { width: resolution.height, height: resolution.width };
	};

	function handleZoom(e: ChangeEvent<HTMLInputElement>) {
		const zoom = Number(e.currentTarget.value);
		if (!selectedNode) return;
		scaleImage(selectedNode, zoom);
		const index = images.findIndex((img) => img.id === selectedNode?.id());
		if (index < 0) return;
		images[index].zoom = zoom;
	}
</script>

{#if !$lgViewport}
	<Header>
		<div class="flex p-2">
			<button
				disabled={$exporting}
				onclick={handleDownload}
				class="rounded-md bg-rose-500 px-3 text-sm font-semibold disabled:bg-base-600"
			>
				Download
			</button>
		</div>
	</Header>
{/if}
<div class="flex h-full min-h-0 flex-col lg:flex-row-reverse">
	<div
		class="flex h-full min-h-0 w-full min-w-0 flex-col bg-[#1d1d20] p-1 lg:p-4"
	>
		<div
			id="container"
			class="flex h-full min-h-0 w-full flex-col items-center justify-center"
			bind:clientWidth={wrapperSize.width}
			bind:clientHeight={wrapperSize.height}
		>
			<div
				id="stage-container"
				class="bg-base-800 {$exporting && 'opacity-0'}"
				bind:clientWidth={containerWidth}
				bind:clientHeight={containerHeight}
			></div>
		</div>
		<div class="hidden">
			<input bind:this={fileInput} type="file" accept="image/*" />
		</div>
	</div>
	<div
		class="flex flex-col border-base-800 bg-base-900 lg:w-[300px] lg:border-r"
	>
		<Panel>
			{#snippet canvasTab()}
				<div class="flex flex-col gap-4 max-lg:px-6 max-lg:py-4">
					<div class="flex gap-2">
						<div class="flex basis-1/2 flex-col gap-2">
							<label for="width" class="text-sm font-medium">Width</label>
							<span class="flex w-full items-center rounded-md">
								<input
									id="width"
									class="w-full rounded-md border border-base-700 bg-transparent px-2 py-0.5 font-medium outline-2 -outline-offset-2 outline-blue-500 focus:outline"
									type="numeric"
									value={resolution.width}
									onchange={(e) =>
										(resolution.width = Number(e.currentTarget.value))}
								/>
							</span>
						</div>

						<div class="flex basis-1/2 flex-col gap-2">
							<label for="height" class="text-sm font-medium">Height</label>
							<span class="flex w-full items-center rounded-md">
								<input
									id="height"
									class="w-full rounded-md border border-base-700 bg-transparent px-2 py-0.5 font-medium outline-2 -outline-offset-2 outline-blue-500 focus:outline"
									type="numeric"
									value={resolution.height}
									onchange={(e) =>
										(resolution.height = Number(e.currentTarget.value))}
								/>
							</span>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<span class="text-sm font-medium">Orientation</span>
						<div
							class="flex gap-0.5 overflow-hidden rounded-md bg-base-800 p-0.5"
						>
							<button
								disabled={orientation === "square"}
								class="flex basis-1/2 items-center justify-center rounded py-1
								text-sm font-medium disabled:bg-base-800 disabled:text-base-500
								{orientation === 'landscape' && 'bg-rose-500'}"
								onclick={() => changeOrientation("landscape")}
							>
								Landscape
							</button>
							<button
								disabled={orientation === "square"}
								class="flex basis-1/2 items-center justify-center rounded py-1
								text-sm font-medium disabled:bg-base-800 disabled:text-base-500
								{orientation === 'portrait' && 'bg-rose-500'}"
								onclick={() => changeOrientation("portrait")}
							>
								Portrait
							</button>
						</div>
					</div>
					<Slider
						label="Border"
						displayValue={(borderConfig.width * 4).toString()}
						min={0}
						max={12.5}
						step={0.25}
						value={borderConfig.width}
						oninput={changeBorderWidth}
					/>
				</div>
			{/snippet}

			{#snippet layoutTab()}
				<div class="flex max-lg:p-4">
					<div
						class="flex max-h-16 w-full flex-wrap gap-2 max-lg:flex-col max-lg:overflow-x-auto sm:max-h-36 lg:max-h-none lg:content-start"
					>
						{#each collage_templates as template, index}
							<button
								onclick={() => (selectedTemplate = index)}
								class="flex items-center justify-center rounded-lg p-4 hover:bg-base-800 hover:bg-opacity-50 max-lg:flex-col max-sm:h-full sm:h-[calc(50%-0.25rem)] lg:aspect-square lg:h-auto lg:w-[calc(50%-0.25rem)]
							{selectedTemplate === index && 'bg-base-800'}"
							>
								<img src={template.icon} alt={template.name} />
							</button>
						{/each}
					</div>
				</div>
			{/snippet}
			{#snippet imageTab()}
				<div
					class="flex flex-col gap-2 overflow-y-auto max-lg:px-6 max-lg:py-4 lg:content-start"
				>
					{#if !selectedNode}
						<Slider
							label="Size"
							displayValue={100 + "%"}
							min={100}
							max={400}
							step={1}
							value={100}
							disabled={true}
						/>
					{:else}
						{#each images as image}
							{#if selectedNode?.id() === image.id}
								<Slider
									label="Size"
									displayValue={image.zoom + "%"}
									min={100}
									max={400}
									step={1}
									value={image.zoom}
									oninput={handleZoom}
								/>
							{/if}
						{/each}
					{/if}
				</div>
			{/snippet}
			{#snippet adjustTab()}
				<div
					class="flex flex-col gap-2 overflow-y-auto px-6 sm:py-4 lg:content-start lg:p-0"
				>
					<Filters
						canvas={layer.getCanvas()._canvas}
						disabled={images.length <
							collage_templates[selectedTemplate].config.length}
					/>
				</div>
			{/snippet}
			{#if $lgViewport}
				<div class="flex flex-col p-3 lg:mt-auto lg:w-full">
					<button
						disabled={$exporting}
						onclick={handleDownload}
						class="h-fit rounded-lg bg-rose-500 p-2 font-medium disabled:bg-base-600"
					>
						Download
					</button>
				</div>
			{/if}
		</Panel>
	</div>
</div>
<LoadingOverlay loading={$exporting} />
