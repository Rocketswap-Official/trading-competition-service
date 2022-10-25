<script lang="ts">
	import type { T_ButtonIcon, T_ButtonStyle, T_ButtonType } from "../button/button.types";

	export let act: any;
	export let type: T_ButtonType = "full";
	export let style: T_ButtonStyle = "";
	export let icon: T_ButtonIcon = "";

	// primary,
</script>

<div>
	<button on:click={act} class="connect outlined white {style}">
		<div>
			<slot />
		</div>
	</button>
</div>

<style>
	button {
		margin-top: var(--units-1vw);
	}

	button.icon {
		margin: 0 auto;
		padding: var(--units-1vw) var(--units-1_4vw);
		border-radius: 100%;
	}
	button.icon:hover {
		background-color: var(--panel-background-highlight);
	}
	button {
		/* width: 50%; */
		margin: var(--units-1vw) auto 0;
	}
	button > div {
		padding-left: var(--units-1vw);
		padding-right: var(--units-1vw);
	}
	@media (max-width: 480px) {
	}
</style>
