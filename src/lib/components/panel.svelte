<script lang="ts">
	import { Icon } from "svelte-icons-pack";
	import { IconLayout, IconFrame, IconPicture, IconSliders } from "$lib/icons";
	import { PanelTab } from "$lib/components";
	import type { Snippet } from "svelte";
	import { mediaQueryStore } from "$lib/stores";
	import Section from "./panel-section.svelte";
	type TabKey = "canvas" | "layout" | "image" | "adjust";
	let currentTab = $state<TabKey>("canvas");

	const setTab = (t: TabKey) => (currentTab = t);
	let {
		canvasTab,
		layoutTab,
		imageTab,
		adjustTab,
		children,
	}: {
		canvasTab: Snippet;
		layoutTab: Snippet;
		imageTab: Snippet;
		adjustTab: Snippet;
		children?: Snippet;
	} = $props();

	const lgViewport = mediaQueryStore("(min-width: 1024px)");
</script>

<div class="flex h-full flex-col">
	{#if $lgViewport}
		<div class="flex flex-col overflow-y-auto">
			<Section heading="Canvas">
				{@render canvasTab()}
			</Section>
			<Section heading="Layout">
				{@render layoutTab()}
			</Section>
			<Section heading="Image">
				{@render imageTab()}
			</Section>
			<Section heading="Adjust">
				{@render adjustTab()}
			</Section>
		</div>
		{@render children?.()}
	{:else}
		<div class="flex flex-col border-t border-base-800">
			{#if currentTab === "canvas"}
				{@render canvasTab()}
			{:else}
				<div class="flex h-24 flex-col justify-center sm:h-auto">
					{#if currentTab === "layout"}
						{@render layoutTab()}
					{/if}
					{#if currentTab === "image"}
						{@render imageTab()}
					{/if}
					{#if currentTab === "adjust"}
						{@render adjustTab()}
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex gap-2 border-t border-base-800 px-4">
			<PanelTab
				active={currentTab === "canvas"}
				onclick={() => setTab("canvas")}
			>
				<Icon src={IconFrame} className="size-5 sm:size-4" />
				Canvas
			</PanelTab>
			<PanelTab
				active={currentTab === "layout"}
				onclick={() => setTab("layout")}
			>
				<Icon src={IconLayout} className="size-5 sm:size-4" />
				Layout
			</PanelTab>
			<PanelTab active={currentTab === "image"} onclick={() => setTab("image")}>
				<Icon src={IconPicture} className="size-5 sm:size-4" />
				Image
			</PanelTab>
			<PanelTab
				active={currentTab === "adjust"}
				onclick={() => setTab("adjust")}
			>
				<Icon src={IconSliders} className="size-5 sm:size-4" />
				Adjust
			</PanelTab>
		</div>
	{/if}
</div>
