<script lang="ts">
	import { onMount } from "svelte";
	import { params } from "svelte-hash-router";
	import { competitions_store } from "../store";
	import { getTokenInfo } from "../utils/api.utils";
	import { addCommas, formatAccountAddress } from "../utils/misc.utils";

	import Rules from "./rules.svelte";

	let id = $params.id;
	let comp;
	let description;
	let url;

	onMount(async () => {
		competitions_store.subscribe((comps) => {
			comp =
				comps["active"].find((c) => c.id === id) ||
				comps["upcoming"].find((c) => c.id === id) ||
				comps["finished"].find((c) => c.id === id);
		});
		if (comp) {
			const token_info = await getTokenInfo(comp.comp_contract);
			console.log(token_info);
			if (token_info) {
				description = token_info.description;
				url = token_info.url;
			}
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
		<!-- <Rules type={"windowed"} /> -->
		<div class="content">
			{description}
			<div class="url">
			 Visit their website : <a target="_blank" href="https://{url}">{url}</a>
			</div>
		</div>
		<div class="comp-headings">
			<div class="w-10 t-l plr-2">#</div>
			<div class="w-25 t-l">Address</div>
			<div class="w-20 t-r">Volume (TAU)</div>
			<div class="w-20 t-r">Net Vol. (TAU)</div>
			<div class="w-25 t-r">Prize ({comp.reward_contract_title})</div>
		</div>
		{#if comp.results.length}
			{#each comp.results as result, i}
				<div class="comp-item">
					<div class="w-10 t-l plr-2">{i + 1}</div>
					<div class="w-25 t-l">{result.rocket_id || formatAccountAddress(result.user_vk)}</div>
					<div class="w-20 t-r p-r-1">{addCommas(result.volume_tau, 0)}</div>
					<div class="w-20 t-r p-r-1">{addCommas(result.volume_tau, 0)}</div>
					<div class="w-25 t-r"><b>{comp.prizes[i] ? addCommas(comp.prizes[i]) : "-"}</b></div>
				</div>
			{/each}
		{:else}
			{#each comp.prizes as prize, i}
				<div class="comp-item">
					<div class="w-15 t-l plr-2">{i + 1}</div>
					<div class="w-25 t-l" />
					<div class="w-20 t-r" />
					<div class="w-20 t-r" />
					<div class="w-25 t-r">{prize}</div>
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	.url {
		margin-top: 20px;

	}

	.url a {
		text-decoration: underline;
	}
	.comp-item {
		font-size: var(--units-1vw);
	}
	.comp-headings {
		font-size: var(--units-1_3vw);
		font-weight: 600;
	}

	.comp-item,
	.comp-headings {
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
</style>
