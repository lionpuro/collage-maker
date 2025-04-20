<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { Icon } from "svelte-icons-pack";
	import { IconCaretUp } from "$lib/icons";

	type Props = {
		active: boolean;
		className?: string;
		children?: Snippet;
	} & HTMLButtonAttributes;
	let { active, children, className = "", ...props }: Props = $props();
</script>

<button
	class="relative flex grow basis-1 flex-col items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium sm:flex-row sm:gap-4 {className} {active
		? 'text-base-50'
		: 'text-base-400'}"
	{...props}
>
	{@render children?.()}
	{#if active}
		<Icon src={IconCaretUp} className="fill-rose-400 absolute bottom-0" />
	{/if}
</button>
