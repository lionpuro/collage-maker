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
</script>

<div class="flex h-full flex-col gap-2 p-2">
	<div class="mb-2 flex">
		<button
			onclick={() => (currentTab = "collage")}
			class="basis-1/2 border-b-2 p-2 font-medium
				{currentTab === 'collage' ? 'border-rose-500' : 'border-base-600'}">
			Collage
		</button>
		<button
			onclick={() => (currentTab = "edit")}
			class="basis-1/2 border-b-2 p-2 font-medium
				{currentTab === 'edit' ? 'border-rose-500' : 'border-base-600'}">
			Edit
		</button>
	</div>
	{#if currentTab === "collage"}
		{@render collageTab()}
	{/if}
	{#if currentTab === "edit"}
		{@render editTab()}
	{/if}
	{@render children()}
</div>
