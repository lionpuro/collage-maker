<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = {
		label?: string;
		displayValue?: string | number;
		className?: string;
	} & HTMLInputAttributes;
	let { label, displayValue, className, ...restProps }: Props = $props();
</script>

<div class="flex flex-col gap-2 {className}">
	{#if label}
		<span class="flex justify-between">
			<h2 class="font-medium">{label}</h2>
			{#if displayValue}
				<span class="font-medium">
					{restProps.disabled ? "--" : displayValue.toString()}
				</span>
			{/if}
		</span>
	{/if}
	<input type="range" {...restProps} />
</div>
