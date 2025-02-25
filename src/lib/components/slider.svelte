<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = {
		label: string;
		displayValue?: string | number;
	} & HTMLInputAttributes;
	let { label, displayValue, ...restProps }: Props = $props();
</script>

<div class="flex flex-col gap-2 border-b border-base-800 pb-4">
	<span class="flex justify-between">
		<h2 class="font-medium">{label}</h2>
		{#if displayValue}
			<span class="font-medium"
				>{restProps.disabled ? "--" : displayValue.toString()}</span
			>
		{/if}
	</span>
	<input type="range" {...restProps} />
</div>
