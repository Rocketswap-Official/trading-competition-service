<script lang="ts">
	import { onMount } from "svelte";
	import { competitions_store } from "../store";
	import CompetitionContent from "./competition-content.svelte";
	import Button from "./elements/button/button.svelte";

	function someHandler() {
		console.log("clicked");
	}

	onMount(() => {});
</script>

<div class="list-container fancy-scrollbar">
	<div class="content">
		The Rocketswap Leaderboard is a tool that rewards users for the volume of trading they perform on Rocketswap.<br />
		All users who perform trades on eligble pairs are automatically added to the leaderboard.<br />
		Rewards are distributed at the end of the period.
	</div>
	<CompetitionContent competitions={$competitions_store["active"]} title={"active"} />
	<CompetitionContent competitions={$competitions_store["upcoming"]} title={"upcoming"} />
	<CompetitionContent competitions={$competitions_store["finished"]} title={"finished"} />
	<!-- <Button on:click={someHandler} act={someHandler} style="primary">Continue</Button> -->
</div>

<style>
	.list-container {
		margin-top: 10px;
		width: 100%;
	}
</style>
