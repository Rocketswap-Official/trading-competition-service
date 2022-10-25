<script lang="ts">
	import { onMount } from "svelte";
	import { startStars } from "../utils/canvas.utils";

	onMount(() => startStars());
</script>

<canvas id="canvas" style="width: 100%; height: 100%; padding: 0; margin: 0; z-index: 99" />
