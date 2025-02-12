<script lang="ts">
	let { loading } = $props<{ loading: boolean }>();
</script>

{#if loading}
	<div
		class="fixed z-[900] flex h-full w-full items-center justify-center bg-black bg-opacity-75">
		<div class="text-base-white flex flex-col items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={42}
				height={42}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="animate-spin">
				<path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</svg>

			<span class="text-lg">Creating collage...</span>
		</div>
	</div>
{/if}
