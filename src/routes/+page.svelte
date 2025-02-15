<script lang="ts">
	import Panel from "$lib/components/panel.svelte";
	import Header from "$lib/components/header.svelte";
	import LoadingOverlay from "$lib/components/loading-overlay.svelte";
	import { collage_templates } from "$lib/constants";
	import Konva from "konva";
	import { onMount } from "svelte";
	import {
		handleImageUpload,
		exportingCollage,
		stageToBlob,
		setBorders,
	} from "$lib/utils";
	import type { TileConfig } from "$lib/constants/collage-templates";

	let selectedTemplate = $state<number>(0);
	let resolution = $state({ width: 3000, height: 2000 });

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
		resizeCanvas();

		layer = new Konva.Layer();
		tr = new Konva.Transformer({
			rotationSnaps: [0, 90, 180, 270],
			enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
		});

		mainGroup = new Konva.Group({ name: "main-group" });

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
			handleImageUpload(fileInput, cell, tr);
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
		const width = Number(e.currentTarget.value) * 10;
		setBorders(resolution, mainGroup, width, borderConfig.color);
	};

	const handleDownload = async () => {
		const blob = await stageToBlob(stage, resolution);
		if (!blob) return;
		const dataURL = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = dataURL;
		link.download = "collage.png";
		link.click();
		exportingCollage.set(false);
	};
</script>

<Header></Header>
<div class="flex h-full min-h-0 flex-col lg:flex-row-reverse">
	<div class="flex h-full w-full min-w-0 flex-col bg-[#1d1d20] lg:p-4">
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
	</div>
	<div
		class="flex flex-col border-base-800 bg-base-900 lg:w-[300px] lg:border-r">
		<Panel>
			{#snippet collageTab()}
				<div class="flex gap-2">
					<div class="flex basis-1/2 flex-col gap-2">
						<label for="width" class="text-sm font-medium">Width</label>
						<span class="flex w-full items-center rounded-md">
							<input
								id="width"
								class="w-full rounded-md border border-base-700 bg-transparent text-center font-medium"
								type="numeric"
								value={resolution.width}
								onchange={(e) =>
									(resolution.width = Number(e.currentTarget.value))} />
						</span>
					</div>

					<div class="flex basis-1/2 flex-col gap-2">
						<label for="height" class="text-sm font-medium">Height</label>
						<span class="flex w-full items-center rounded-md">
							<input
								id="height"
								class="w-full rounded-md border border-base-700 bg-transparent text-center font-medium"
								type="numeric"
								value={resolution.height}
								onchange={(e) =>
									(resolution.height = Number(e.currentTarget.value))} />
						</span>
					</div>
				</div>
				<div class="flex flex-wrap gap-2 overflow-y-auto lg:content-start">
					{#each collage_templates as template, index}
						<button
							onclick={() => (selectedTemplate = index)}
							class="flex items-center justify-center rounded-lg p-4 hover:bg-base-800 hover:bg-opacity-50 max-lg:basis-1/5 lg:aspect-square lg:w-[calc(50%-0.25rem)] {selectedTemplate ===
								index && 'bg-base-800'}">
							<img src={template.icon} alt={template.name} />
						</button>
					{/each}
				</div>
			{/snippet}
			{#snippet editTab()}
				<div class="flex flex-col gap-2 overflow-y-auto lg:content-start">
					<h2 class="font-medium">Border</h2>
					<input
						type="range"
						min={0}
						max={40}
						bind:value={borderConfig.width}
						oninput={changeBorderWidth} />
				</div>
			{/snippet}
			<button
				disabled={$exportingCollage}
				onclick={handleDownload}
				class="h-fit rounded-lg bg-rose-500 p-2 font-medium disabled:bg-base-600">
				Download
			</button>
		</Panel>
	</div>
</div>
<LoadingOverlay loading={$exportingCollage} />
