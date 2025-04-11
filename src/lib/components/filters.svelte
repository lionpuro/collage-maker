<script lang="ts">
	import { Slider } from "$lib/components";
	import { filterValues, mediaQueryStore } from "$lib/stores";
	import {
		getFilterString,
		setFilterValue,
		type FilterKey,
	} from "$lib/stores/filter-store.svelte";
	const smallLayout = mediaQueryStore("(max-width: 640px)");

	type Props = {
		canvas: HTMLCanvasElement;
		disabled: boolean;
	};
	let { canvas, disabled }: Props = $props();

	let currentFilter = $state<null | FilterKey>(null);

	const updateFilter = (key: FilterKey, value: number) => {
		if (!canvas) {
			return console.warn("canvas is undefined");
		}
		setFilterValue(key, value);
		canvas.style.filter = getFilterString();
	};
	const fmtValue = (v: number) => (v - 100).toString();

	const filters: { key: FilterKey; name: string }[] = [
		{ key: "brightness", name: "Brightness" },
		{ key: "contrast", name: "Contrast" },
		{ key: "saturate", name: "Saturation" },
	];
</script>

{#each filters as filter}
	<div
		class="flex gap-4 max-sm:items-center sm:flex-col
		{$smallLayout && currentFilter !== filter.key && 'hidden'}"
	>
		{#if $smallLayout && currentFilter === filter.key}
			<button
				class="flex flex-col items-center justify-center rounded-md bg-base-800 px-4 py-2 font-medium"
				onclick={() => (currentFilter = null)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 -960 960 960"
					width="28px"
					height="28px"
					fill="currentColor"
				>
					<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
				</svg>
				Back
			</button>
		{/if}
		{#if !$smallLayout || currentFilter === filter.key}
			<Slider
				label={filter.name}
				displayValue={fmtValue(filterValues[filter.key])}
				oninput={(e) => updateFilter(filter.key, Number(e.currentTarget.value))}
				min={50}
				max={150}
				value={filterValues[filter.key]}
				step={1}
				{disabled}
				list="input-snap"
				className={`border-b border-base-800 pb-4
					${$smallLayout && currentFilter === filter.key ? "w-full border-none pb-0" : ""}
				`}
			/>
		{/if}
	</div>
{/each}
<datalist id="input-snap" class="hidden">
	<option value="100"></option>
</datalist>
{#if $smallLayout && !currentFilter}
	<div class="flex justify-center">
		{#each filters as filter}
			<button
				class="flex flex-col items-center rounded-md p-3 px-4 text-sm"
				onclick={() => (currentFilter = filter.key)}
			>
				<span class="text-base font-bold">
					{fmtValue(filterValues[filter.key])}
				</span>
				{filter.name}
			</button>
		{/each}
	</div>
{/if}
