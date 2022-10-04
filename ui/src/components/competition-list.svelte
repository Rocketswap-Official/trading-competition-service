<script lang="ts">
	import { onMount } from "svelte";
	import axios from "axios";
	import { each } from "svelte/internal";

	let competition_list;
	onMount(async () => {
		try {
			competition_list = (await axios.get("http://0.0.0.0:2001/get_competitions/")).data;
			console.log(competition_list);
		} catch (err) {
			console.log({ err });
		}
	});

	function getDateFromUnix(unix_timestamp: number) {
		const d = new Date(unix_timestamp);
		return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
	}

	function getFullPrize(prizes: number[]) {
		return prizes.reduce((accum, prize) => Number(accum) + Number(prize), 0);
	}
</script>

<div class="main-container">
	<div class="header">Rocketswap Trading Competitions</div>
	{#if competition_list}
		<div class="list-container">
			<div class="comp-header">
				<div class="w-20 t-l">Market</div>
				<div class="w-20 t-l">Start Date</div>
				<div class="w-20 t-l">End Date</div>
				<div class="w-20 t-r">Rewards</div>
			</div>
			{#each competition_list as comp}
				<div class="comp-item">
					<div class="w-20 t-l">{comp.comp_contract_title}</div>
					<div class="w-20 t-l">{getDateFromUnix(comp.date_start_unix)}</div>
					<div class="w-20 t-l">{getDateFromUnix(comp.date_end_unix)}</div>
					<div class="w-20 t-r">{comp.reward_contract_title} {getFullPrize(comp.prizes)}</div>
					<div class="w-10 t-c button-cont"><a class="gradient-button gradient-button-1">More</a></div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gradient-button {
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
		border-radius: 4px;
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
		font-size: 1.3em;
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
	.list-container {
		margin-top: 40px;
		width: 100%;
		/* border: 1px solid red; */
	}
	.header {
		width: 100%;
		height: 70px;
		font-size: 1.5rem;
		text-align: left;
		display: flex;
		align-items: center;
		padding: 0px 25px;
	}
	.main-container {
		min-height: 93%;
		min-width: 93%;
		background-color: rgba(14, 23, 32, 0.7);
	}
</style>
