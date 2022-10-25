<script lang="ts">
	import IconArrow from "../svg/icon-arrow.svelte";
	export let type: "windowed" | "basic";
	let expanded = false;

	function handleExpandClick() {
		console.log("clicked");
		expanded = !expanded;
	}
</script>

<div class="content">
	<div class="flex row">
		<div class="expand-button">
			<button class="flex" on:click={handleExpandClick}
				>Rules <div class="rotator {expanded ? 'rotate-90' : 'rotate-0'}"><IconArrow /></div></button
			>
		</div>
	</div>
	<div class="rules-detail-container {expanded ? 'height-100 border' : 'height-0'}">
		<div class="rules-inner">This is where the rules go, baby.</div>
	</div>
</div>

<style>
    .rules-inner {
		border: 1px solid var(--primary-color-dim);
        border-radius: 2px;
        padding: var(--units-1_2vw)
    }
	.rotator {
		height: var(--units-1_8vw);
		width: var(--units-1_8vw);
		transition: all 0.1s ease-in-out;
	}

	.rotate-0 {
		transform: rotate(0deg);
		rotate: 0;
	}

	.rotate-90 {
		transform: rotate(90deg);
		rotate: 90;
	}

	.height-100 {
		height: auto;
	}

	.height-0 {
		height: 0px;
	}
/* 
	.border {
		border: 1px solid var(--primary-color-dim);
	} */

	.rules-detail-container {
		/* height: 0px; */
		font-size: var(--units-1_2vw);
		transition: height 0.5s ease-in-out;
		overflow: hidden;
	}

	button {
		border: 1px solid var(--primary-color);
		border-radius: 2px;
        font-size: var(--units-1vw)
	}

	/* button span {
		max-height: var(--units-1vw);
	} */

	.expand-button button {
		height: var(--units-3vw);
		/* width: var(--units-2_5vw); */
		/* border-radius: 50%; */
		color: var(--primary-color);
		background-color: #ffffff00;
	}
</style>
