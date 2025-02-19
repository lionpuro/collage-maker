<script lang="ts">
	import Slider from "$lib/components/slider.svelte";
	import { filterValues } from "$lib/stores";
	import {
		getFilterString,
		setFilterValue,
		type FilterKey,
	} from "$lib/stores/filter-store.svelte";
	let { canvas }: { canvas: HTMLCanvasElement } = $props();

	const updateFilter = (key: FilterKey, value: number) => {
		if (!canvas) {
			return console.warn("canvas is undefined");
		}
		setFilterValue(key, value);
		canvas.style.filter = getFilterString();
	};
</script>

<Slider
	label="Brightness"
	displayValue={filterValues.brightness - 100}
	oninput={(e) => updateFilter("brightness", Number(e.currentTarget.value))}
	min={0}
	max={200}
	defaultvalue={100}
	step={1}
/>
<Slider
	label="Contrast"
	displayValue={filterValues.contrast - 100}
	oninput={(e) => updateFilter("contrast", Number(e.currentTarget.value))}
	min={0}
	max={200}
	defaultvalue={100}
	step={1}
/>
<Slider
	label="Saturation"
	displayValue={filterValues.saturate - 100}
	oninput={(e) => updateFilter("saturate", Number(e.currentTarget.value))}
	min={0}
	max={200}
	defaultvalue={100}
	step={1}
/>
