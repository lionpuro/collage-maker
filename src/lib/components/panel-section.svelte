<script lang="ts">
	import { IconChevronDown } from "$lib/icons";
	import { type Snippet } from "svelte";
	import { Icon } from "svelte-icons-pack";
	type Props = { heading: string; children: Snippet };
	let { heading, children }: Props = $props();
	let open = $state(true);
</script>

<div
	class="flex flex-col border-base-800 p-4 max-lg:px-6 [&:not(:last-child)]:border-b"
>
	<div class="flex justify-between font-semibold">
		{heading}
		<button
			onclick={() => (open = !open)}
			class="flex justify-between font-semibold max-lg:hidden"
		>
			<Icon
				src={IconChevronDown}
				size="24"
				className={open ? "scale-y-[-1]" : ""}
			/>
		</button>
	</div>
	<div class="section-content {open ? 'open' : ''}">
		<div class="min-h-0 before:block before:h-4 before:content-['_']">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	@media (width >= 1024px) {
		.section-content {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows 0.25s ease-in-out;
			overflow: hidden;

			&.open {
				grid-template-rows: 1fr;
			}
		}
	}
</style>
