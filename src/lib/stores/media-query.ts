import { writable } from "svelte/store";

export default function mediaQueryStore(query: string) {
	const { subscribe, set } = writable(false, () => {
		const mql = window.matchMedia(query);
		set(mql.matches);

		const onChange = () => set(mql.matches);

		mql.addEventListener("change", onChange);

		return () => {
			mql.removeEventListener("change", onChange);
		};
	});
	return { subscribe };
}
