<script lang="ts">
	import { onMount } from "svelte";
	import { getDateFromUnix, getFullPrize } from "../utils/misc.utils";
	import { competitions_store } from "../store";

	const home_title = "Rocketswap Leaderboard";

	let show_back = false;
	let active_title = home_title;
	let comp;
	let competitions = $competitions_store;

	onMount(() => {
		handleUrl(window.location.href);
		addEventListener("hashchange", (event) => handleHashChange(event));
	});

	function handleHashChange(event: HashChangeEvent) {
		handleUrl(event.newURL);
	}

	function handleUrl(url: string) {
		const parts = url.split("#");
		const body = parts[1];
		const path_segments = [];

		body?.split("/").forEach((s) => {
			if (s) path_segments.push(s);
		});

		if (!path_segments.length) {
			// home page
			show_back = false;
			comp = undefined;
			active_title = home_title;
			return;
		}

		const page = path_segments[0];
		const arg = path_segments[1];

		if (page === "competition") {
			// competition page
			comp =
				competitions["active"].find((c) => c.id === arg) ||
				competitions["upcoming"].find((c) => c.id === arg) ||
				competitions["finished"].find((c) => c.id === arg);

			active_title = `${comp.comp_contract_title} Leaderboard`;
			show_back = true;
		}
	}
</script>

<div class="header-container flex row">
	<div class="back-container flex align-center justify-center">
		{#if show_back}
			<div class="button-cont">
				<a href={`/#/`} class="circle-button gradient-button-1"><img src="icon-back.svg" alt="" /></a>
			</div>
		{:else}
			<div class="button-cont flex align-center justify-center">
				<img class="logo" src="rswp-logo.svg" alt="" />
			</div>
		{/if}
	</div>
	<div class="header-title flex row align-center space-between grow-1">
		<div>{active_title}</div>
		{#if comp}
			<div class="dates-container flex col">
				<div class="flex col">
					<div class="date-title">Starts :</div>
					<div class="date">{getDateFromUnix(comp.date_start_unix)}</div>
				</div>
				<div class="flex col">
					<div class="date-title">Ends:</div>
					<div class="date">
						{getDateFromUnix(comp.date_end_unix)}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.logo {
		margin-left: var(--units-1_5vw);
		margin-top: var(--units-07vw);
		min-width: var(--units-3vw);
		min-height: var(--units-3vw)
	}

	.date {
		margin-left: var(--units-07vw);
	}
	.date-title {
		font-size: var(--units-07vw);
	}
	.dates-container {
		font-size: var(--units-1_2vw);
		width: var(--units-10vw);
		/* font-weight: 400; */
	}
	.back-container {
		height: 100%;
		min-width: var(--units-5vw);
		/* border: 1px solid pink; */
	}

	.back-container img {
		width: 100%;
	}

	.header-container {
		/* overflow: hidden; */
		width: 100%;
		/* padding: 25px 25px; */
		min-height: var(--units-10vw);
		/* border: 1px solid purple; */
		/* height: var(--units-2vw); */
	}

	.header-title {
		text-align: left;
		font-size: var(--units-2_5vw);
		padding: var(--units-1vw);
		min-height: var(--units-8vw);
	}

	.circle-button {
		/* margin: 10px; */
		/* font-family: "Arial Black", Gadget, sans-serif; */
		font-size: 0.8em;
		padding: 7px;
		text-align: center;
		text-transform: uppercase;
		transition: 0.5s;
		background-size: 200% auto;
		color: black;
		font-weight: 600;
		box-shadow: 0 0 20px #eee;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		cursor: pointer;
		display: inline-block;
		height: var(--units-2_5vw);
		width: var(--units-2_5vw);
		border-radius: 50%;
	}

	.gradient-button:hover {
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
	}

	.gradient-button-1 {
		background-image: linear-gradient(to right, #20c5c0 0%, #a4f4ac 51%, #73e2b6 100%);
	}

	.gradient-button-1:hover {
		background-position: right center;
	}

	.button-cont img {
		margin-right: 1px;
		height: 100%;
		width: 100%;
	}
</style>
