<script lang="ts">
	import { onMount } from "svelte";
	import axios from "axios";
	import { each } from "svelte/internal";
	import { params } from "svelte-hash-router";
	import { competitions_store } from "../store";
	import { formatAccountAddress } from "../utils/misc.utils";
	import { addCommas } from "../utils";

	let id = $params.id;
	let comp;
	onMount(async () => {
		competitions_store.subscribe((comps) => {
			comp = comps.find((c) => c.id === id);
			// console.log(comp);
		});
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
	{#if comp}
		<div class="header">
			<div class="button-cont">
				<a href={`/#/`} class="circle-button gradient-button-1"><img src="icon-back.svg" alt="" /></a>
			</div>
			<div style="margin-left: 1em">{comp?.comp_contract_title} Leaderboard</div>
			<div class="dates-cont">{getDateFromUnix(comp.date_start_unix)} - {getDateFromUnix(comp.date_end_unix)}</div>
		</div>
		<!-- {#if comp} -->
		<div class="list-container">
			<div class="comp-header">
				<div class="w-5 t-l">#</div>
				<div class="w-30 t-l">Address</div>
				<div class="w-30 t-l">Volume (TAU)</div>
				<div class="w-30 t-r">Prize ({comp.reward_contract_title})</div>
			</div>
			{#each comp.results as result, i}
				<div class="comp-item">
					<div class="w-5 t-l">{i + 1}</div>
					<div class="w-30 t-l">{result.rocket_id || formatAccountAddress(result.user_vk)}</div>
					<div class="w-30 t-l">{addCommas(result.volume_tau, 4)}</div>
					<div class="w-30 t-r">{comp.prizes[i] ? addCommas(comp.prizes[i]) : "0"}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dates-cont {
		/* justify-self: flex-end; */
		flex-grow: 1;
		text-align: right;
		font-size: 0.8em;
		font-style: italic;
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
		height: 1.6em;
		width: 1.6em;
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

	.t-r {
		text-align: right;
	}

	.t-c {
		text-align: center;
	}
	.t-l {
		text-align: left;
	}
	.w-5 {
		width: 5%;
	}
	.w-10 {
		width: 10%;
	}
	.w-20 {
		width: 20%;
	}

	.w-25 {
		width: 25%;
	}
	.w-30 {
		width: 30%;
	}

	.comp-header {
		font-weight: 600;
		font-size: 1.3em;
	}

	.circle-button img {
		height: 1.1em;
		width: 1.1em;
		margin-left: -0.17em;
		margin-top: -0.05em;
	}

	.comp-item,
	.comp-header {
		width: 100%;
		display: flex;
		flex-direction: row;
		padding: 10px 20px;
		align-items: center;
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
		flex-direction: row;
		align-items: center;
		padding: 0px 25px;
	}

</style>
