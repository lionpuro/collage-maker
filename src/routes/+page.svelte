<script lang="ts">
	import Canvas from "$lib/components/canvas.svelte";
	import Panel from "$lib/components/panel.svelte";
	import Header from "$lib/components/header.svelte";
	import { collage_templates } from "$lib/constants";
	let selectedTemplate = $state<number>(0);
	let size = $state({ width: 3000, height: 2000 });
</script>

<Header>
	<div class="flex gap-8">
		<div class="flex items-center gap-2">
			<label for="width" class="text-sm font-medium">w:</label>
			<span class="flex items-center rounded-md">
				<input
					id="width"
					class="w-16 rounded-md bg-base-800 text-center font-medium"
					type="numeric"
					bind:value={size.width}
				/>
			</span>
		</div>

		<div class="flex items-center gap-2">
			<label for="height" class="text-sm font-medium">h:</label>
			<span class="flex items-center rounded-md">
				<input
					id="height"
					class="w-16 rounded-md bg-base-800 text-center font-medium"
					type="numeric"
					bind:value={size.height}
				/>
			</span>
		</div>
	</div>
</Header>
<div class="flex h-full min-h-0 flex-col lg:flex-row-reverse">
	<div class="flex h-full w-full min-w-0 flex-col bg-[#1d1d20] lg:p-4">
		<Canvas resolution={size} {selectedTemplate} />
	</div>
	<div
		class="flex flex-col border-base-800 bg-base-900 lg:w-[300px] lg:border-r">
		<Panel>
			{#snippet collageTab()}
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
				<h2 class="font-semibold">Border</h2>
			{/snippet}
		</Panel>
	</div>
</div>
