<script lang="ts">
	import { onMount } from "svelte";
	import { competitions_store } from "../store";
	import { addCommas, getDateFromUnix, getFullPrize, getUtcTimeFromUnix } from "../utils/misc.utils";
	import { gotoPath, openLinkInNewTab } from "../utils/nav.utils";

	onMount(() => {});
</script>

<div class="list-container fancy-scrollbar">
	<div class="content">
		The Rocketswap Leaderboard is a tool that rewards users for the volume of trading they perform on Rocketswap.<br />
		All users who perform trades on eligble pairs are automatically added to the leaderboard.<br />
		Rewards are distributed at the end of the period.
	</div>
	<div class="comp-header">
		<div class="w-20 t-l">Market</div>
		<div class="w-20 t-l">Starts</div>
		<div class="w-20 t-l">Ends</div>
		<div class="w-20 t-r">Rewards</div>
	</div>
	{#each $competitions_store as comp}
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
</div>

<style>
	.token-symbol {
		font-size: var(--units-1_5vw);
	}
	.gradient-button {
		/* margin: 10px; */
		/* font-family: "Arial Black", Gadget, sans-serif; */
		font-size: var(--units-08vw);
		/* padding: 7px; */
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

	.comp-header {
		font-weight: 600;
		font-size: var(--units-1_3vw);
	}

	.comp-item,
	.comp-header {
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

	.list-container {
		margin-top: 10px;
		width: 100%;
		/* margin-bottom: 50px; */
	}
</style>
