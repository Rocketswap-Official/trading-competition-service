<script lang="ts">
	import { onMount } from "svelte";
	import PoweredByLamden from "../powered-by-lamden.svelte";
	import Router from "svelte-hash-router";
	import { syncCompetitions } from "../utils/api.utils";
	import Stars from "./stars.svelte";
	import { startStars } from "../utils/canvas.utils";
	import Header from "./header.svelte";
	import { competitions_store } from "../store";
	import Modal from "./modal.svelte";

	onMount(async () => {
		await startSyncCompetitionTimer();
	});

	async function startSyncCompetitionTimer() {
		await syncCompetitions();
		setInterval(async () => {
			await syncCompetitions();
		}, 10000);
	}
</script>

{#if $competitions_store['active']}
	<main>
		<div
			style="position: absolute; top:0%; left: 0%; text-align: center; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column"
		>
			<div class="main-container flex col">
				<Header />
				<div class="scroll-container fancy-scrollbar">
					<Router />
				</div>
			</div>
		</div>
		<!-- <canvas id="canvas" style="width: 100%; height: 100%; padding: 0; margin: 0; z-index: 99" /> -->
		<Stars />
		<div id="powered">
			<PoweredByLamden />
		</div>
	</main>
	<!-- <Modal/> -->
{/if}

<style>
	:global(*) {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	:global(.content) {
		/* font-style: italic; */
		text-align: left;
		font-size: var(--units-1_2vw);
		padding: 0 var(--units-1_8vw) var(--units-1_4vw);
		line-height: var(--units-1_8vw);
	}

	.main-container {
		height: 93%;
		width: 93%;
		max-height: 800px;
		max-width: 900px;
		background-color: rgba(14, 23, 32, 0.8);
		border-radius: var(--panel-border-radius);
		/* overflow: scroll; */
	}

	.scroll-container {
		flex-grow: 1;
		overflow-y: scroll;
		padding-bottom: 60px;
	}

	main {
		height: 100%;
		width: 100%;
	}

	#powered {
		position: absolute;
		bottom: 40px;
		right: 100px;
	}

	@media (max-width: 500px) {
		main {
			max-width: none;
		}

		#powered {
			/* width: 100%;
			position: relative;
			bottom: 60px;
			right: unset;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center; */
			position: absolute;
			bottom: 20px;
			right: 50px;
		}

		.main-container {
			min-width: 100%;
			min-height: 100%;
			border-radius: 0px;
			padding: 0px;
		}

		:global(.comp-headings, .comp-item) {
			width: 100%;
			display: flex;
			flex-direction: row;
			padding: 10px 6px !important;
			align-items: center;
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
		}

		:global(.comp-title) {
			padding: 14px 6px !important;
		}

		:global(.header-title) {
			padding: var(--units-0_5vw);
			overflow-x: hidden;
		}
	}
</style>
