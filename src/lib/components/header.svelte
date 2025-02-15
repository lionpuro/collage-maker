<script lang="ts">
	import type { Snippet } from "svelte";

	let { children } = $props<{ children?: Snippet }>();
</script>

<header class="flex justify-between border-b border-base-800 bg-base-900">
	<h1 class="p-3 px-4 font-semibold">Collage maker</h1>
	{#if children}
		{@render children()}
	{/if}
</header>
