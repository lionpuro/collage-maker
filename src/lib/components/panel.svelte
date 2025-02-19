<script lang="ts">
	import type { Snippet } from "svelte";
	let {
		collageTab,
		editTab,
		children,
	}: {
		collageTab: Snippet;
		editTab: Snippet;
		children: Snippet;
	} = $props();
	let currentTab = $state<"collage" | "edit">("collage");

	const activeClass = `
	relative after:absolute after:left-0 after:bottom-0
	after:content-['_'] after:bg-rose-500 after:h-0.5 after:w-full`;
</script>

<div class="flex h-full flex-col">
	<div class="flex border-b border-base-800">
		<button
			onclick={() => (currentTab = "collage")}
			class="basis-1/2 p-2 font-medium
				{currentTab === 'collage' ? activeClass : 'text-base-400'}"
		>
			Collage
		</button>
		<button
			onclick={() => (currentTab = "edit")}
			class="basis-1/2 p-2 font-medium
				{currentTab === 'edit' ? activeClass : 'text-base-400'}"
		>
			Edit
		</button>
	</div>
	<div class="flex flex-col gap-4 overflow-y-auto p-4">
		{#if currentTab === "collage"}
			{@render collageTab()}
		{/if}
		{#if currentTab === "edit"}
			{@render editTab()}
		{/if}
	</div>
	{@render children()}
</div>
