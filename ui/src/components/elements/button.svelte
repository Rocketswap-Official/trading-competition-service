<script lang="ts">
	export let type: "outline" | "full" | "alternative";
	export let text: string = "default";
</script>

<div>
	<button>
		{text}
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
	button.connect {
		width: 50%;
		margin: var(--units-1vw) auto 0;
	}
	button.connect > div {
		padding-left: var(--units-1vw);
		padding-right: var(--units-1vw);
	}

	@media (max-width: 480px) {
		/* 
        button.connect{
            width: 100%;
        } */
	}
</style>
