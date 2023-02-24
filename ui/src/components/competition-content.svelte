<script lang="ts">
	import { addCommas, getDateFromUnix, getFullPrize, getUtcTimeFromUnix } from "../utils/misc.utils";
	import { gotoPath, openLinkInNewTab } from "../utils/nav.utils";
	import NoCompetitions from "./no-competitions.svelte";
	import Button from "./elements/button/button.svelte";

	export let competitions;
	export let title;
</script>

<div class="comp-wrapper">
	<div class="comp-title">
		<!-- <span> -->
		{title}
		<div class="title-underline" />
		<!-- </span> -->
	</div>
	{#if competitions.length}
		<div class="comp-headings">
			<div class="w-20 t-l">Market</div>
			<div class="w-20 t-l">Starts</div>
			<div class="w-20 t-l">Ends</div>
			<div class="w-20 t-r">Rewards</div>
		</div>
		{#each competitions as comp}
			<div class="comp-item">
				<div class="token-symbol w-20 t-l">{comp.comp_contract_title}</div>
				<div class="w-20 t-l">{getDateFromUnix(comp.date_start_unix)} <br />{getUtcTimeFromUnix(comp.date_start_unix)}</div>
				<div class="w-20 t-l">{getDateFromUnix(comp.date_end_unix)} <br />{getUtcTimeFromUnix(comp.date_end_unix)}</div>
				<div class="w-20 t-r">{comp.reward_contract_title} {addCommas(getFullPrize(comp.prizes))}</div>
				<div class="w-20 t-c button-cont flex col a-end">
					<button
						on:click={() => {
							gotoPath(`/#/competition/${comp.id}`);
						}}
						class="gradient-button gradient-button-1">More</button
					>
					<button
						on:click={() => {
							openLinkInNewTab(`https://rocketswap.exchange/#/swap/${comp.comp_contract}`);
						}}
						class="gradient-button gradient-button-1">Trade</button
					>
				</div>
			</div>
		{/each}
	{:else}
		<NoCompetitions context={title} />
	{/if}
</div>

<style>
	.comp-wrapper {
		margin-bottom: var(--units-1vw);
	}
	.title-underline {
		height: 4px;
		max-width: 300px;
		max-width: 20%;
		min-width: 100px;
		background-image: var(--primary-gradient-fade);
	}
	.comp-title {
		font-size: var(--units-1_6vw);
		font-style: oblique;
		text-align: left;
		text-transform: capitalize;
		padding: var(--units-1_5vw) var(--units-08vw);
		font-weight: 400;
		/* text-decoration: underline; */
		color: var(--primary-color);
	}

	.token-symbol {
		font-size: var(--units-1_5vw);
	}
	.gradient-button {
		font-size: var(--units-08vw);
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
		/* border-radius: 4px; */
		min-width: var(--units-4vw);
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

	.t-r {
		text-align: right;
	}

	.t-c {
		text-align: center;
	}
	.t-l {
		text-align: left;
	}
	.w-20 {
		width: 20%;
	}
	.w-10 {
		width: 20%;
	}

	.w-25 {
		width: 25%;
	}

	.comp-headings {
		font-weight: 400;
		font-size: var(--units-1_3vw);
	}

	.comp-item,
	.comp-headings {
		width: 100%;
		display: flex;
		flex-direction: row;
		padding: 10px 20px;
		align-items: center;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	.comp-item {
		font-size: var(--units-1vw);
	}
</style>
