import { filterConfig } from "$lib/constants/filter-config";

export type FilterKey = "brightness" | "contrast" | "saturate";
type FilterValues = { [K in FilterKey]: number };

const initValues: FilterValues = {
	brightness: 100,
	contrast: 100,
	saturate: 100,
};

export const filterValues = $state<FilterValues>(initValues);

export function setFilterValue(key: FilterKey, value: number) {
	filterValues[key] = value;
}

export function getFilterString(): string {
	const filters: string[] = [];
	Object.entries(filterValues).forEach(([key, value]) => {
		if (value !== filterConfig[key].default) {
			filters.push(`${key}(${value}%)`);
		}
	});
	return filters.length > 0 ? filters.join(" ") : "none";
}

export function resetFilters() {
	filterValues.brightness = initValues.brightness;
	filterValues.contrast = initValues.contrast;
	filterValues.saturate = initValues.saturate;
}
