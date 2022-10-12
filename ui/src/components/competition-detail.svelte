<script lang="ts">
	import { onMount } from "svelte";
	import { params } from "svelte-hash-router";
	import { competitions_store } from "../store";
	import { getTokenInfo } from "../utils/api.utils";
	import { addCommas, formatAccountAddress } from "../utils/misc.utils";

	let id = $params.id;
	let comp;
	let description;

	onMount(async () => {
		competitions_store.subscribe((comps) => {
			comp = comps.find((c) => c.id === id);
		});
		if (comp) {
			const token_info = await getTokenInfo(comp.comp_contract);
			console.log(token_info);
			if (token_info) description = token_info.description;
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

{#if comp && description}
	<div class="list-container">
		<div class="content">
			{description}
		</div>
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

<style>
	.comp-item {
		font-size: var(--units-1vw);
	}
	.comp-header {
		font-size: var(--units-1_3vw);
		font-weight: 600;
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
		font-size: var(--units-1_8vw);
		text-align: left;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0px 25px;
	}
</style>
