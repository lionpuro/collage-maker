<script lang="ts">
	import Canvas from "$lib/components/canvas.svelte";
	import Panel from "$lib/components/panel.svelte";
	import Header from "$lib/components/header.svelte";
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
	<div class="flex border-base-800 bg-base-900 lg:w-[300px] lg:border-r">
		<Panel {selectedTemplate} selectTemplate={(i) => (selectedTemplate = i)} />
	</div>
</div>
