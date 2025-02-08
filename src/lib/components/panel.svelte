<script lang="ts">
	import { collage_templates } from "$lib/constants";
	let {
		selectedTemplate,
		selectTemplate,
	}: { selectedTemplate: number; selectTemplate: (i: number) => void } = $props();
</script>

<div class="flex flex-col gap-2 p-2">
	<div class="flex flex-wrap gap-2 overflow-y-auto lg:content-start">
		{#each collage_templates as template, index}
			<button
				onclick={() => selectTemplate(index)}
				class="flex items-center justify-center rounded-lg p-4 hover:bg-base-800 hover:bg-opacity-50 max-lg:basis-1/5 lg:aspect-square lg:w-[calc(50%-0.25rem)] {selectedTemplate ===
					index && 'bg-base-800'}"
			>
				<img src={template.icon} alt={template.name} />
			</button>
		{/each}
	</div>
	<button class="h-fit rounded-lg bg-rose-500 p-2 font-medium lg:mt-auto lg:w-full">
		Download
	</button>
</div>
