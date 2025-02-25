<script lang="ts">
	import Slider from "$lib/components/slider.svelte";
	import { filterValues } from "$lib/stores";
	import {
		getFilterString,
		setFilterValue,
		type FilterKey,
	} from "$lib/stores/filter-store.svelte";
	let { canvas, disabled }: { canvas: HTMLCanvasElement; disabled: boolean } =
		$props();

	const updateFilter = (key: FilterKey, value: number) => {
		if (!canvas) {
			return console.warn("canvas is undefined");
		}
		setFilterValue(key, (value - 50) * 2);
		canvas.style.filter = getFilterString();
	};
	const fmtValue = (v: number) => ((v - 100) / 2).toString();
</script>

<datalist id="input-snap" class="hidden">
	<option value="100"> </option></datalist
>
<Slider
	label="Brightness"
	displayValue={fmtValue(filterValues.brightness)}
	oninput={(e) => updateFilter("brightness", Number(e.currentTarget.value))}
	min={50}
	max={150}
	defaultvalue={100}
	step={1}
	{disabled}
	list="input-snap"
/>
<Slider
	label="Contrast"
	displayValue={fmtValue(filterValues.contrast)}
	oninput={(e) => updateFilter("contrast", Number(e.currentTarget.value))}
	min={50}
	max={150}
	defaultvalue={100}
	step={1}
	{disabled}
	list="input-snap"
/>
<Slider
	label="Saturation"
	displayValue={fmtValue(filterValues.saturate)}
	oninput={(e) => updateFilter("saturate", Number(e.currentTarget.value))}
	min={50}
	max={150}
	defaultvalue={100}
	step={1}
	{disabled}
	list="input-snap"
/>
