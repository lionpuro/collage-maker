import { filterConfig } from "$lib/constants/filter-config";

export type FilterKey = "brightness" | "contrast" | "saturate";
type FilterValues = { [K in FilterKey]: number };

export const filterValues = $state<FilterValues>({
	brightness: 100,
	contrast: 100,
	saturate: 100,
});

export function setFilterValue(key: FilterKey, value: number) {
	filterValues[key] = value;
}

export function getFilterString(): string {
	const filters: string[] = [];
	Object.entries(filterValues).forEach(([key, value]) => {
		const cssValue = (value - 50) * 2;
		if (value !== filterConfig[key].default) {
			filters.push(`${key}(${cssValue}%)`);
		}
	});
	return filters.length > 0 ? filters.join(" ") : "none";
}

export function resetFilters() {
	filterValues.brightness = 100;
	filterValues.contrast = 100;
	filterValues.saturate = 100;
}
