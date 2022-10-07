<script lang="ts">
	import { onMount } from "svelte";
	import PoweredByLamden from "../powered-by-lamden.svelte";
	import Router from "svelte-hash-router";
	import { syncCompetitions } from "../utils/api.utils";

	export let width = "190px";

	onMount(async () => {
		await syncCompetitions();
		const canvas: any = window.document.getElementById("canvas");
		const c = canvas.getContext("2d");

		let w;
		let h;

		const setCanvasExtents = () => {
			w = document.body.clientWidth;
			h = document.body.clientHeight;
			canvas.width = w;
			canvas.height = h;
		};

		setCanvasExtents();

		window.onresize = () => {
			setCanvasExtents();
		};

		const makeStars = (count) => {
			const out = [];
			for (let i = 0; i < count; i++) {
				const s = {
					x: Math.random() * 1600 - 800,
					y: Math.random() * 900 - 450,
					z: Math.random() * 1000
				};
				out.push(s);
			}
			return out;
		};

		let stars = makeStars(4000);

		const clear = () => {
			c.fillStyle = "black";
			c.fillRect(0, 0, canvas.width, canvas.height);
		};

		const putPixel = (x, y, brightness) => {
			const intensity = brightness * 255;
			const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
			c.fillStyle = rgb;
			c.fillRect(x, y, 3, 3);
		};

		const moveStars = (distance) => {
			const count = stars.length;
			for (var i = 0; i < count; i++) {
				const s = stars[i];
				s.z -= distance;
				while (s.z <= 1) {
					s.z += 1000;
				}
			}
		};

		let prevTime;
		const init = (time) => {
			prevTime = time;
			requestAnimationFrame(tick);
		};

		const tick = (time) => {
			let elapsed = time - prevTime;
			prevTime = time;

			moveStars(elapsed * 0.1);

			clear();

			const cx = w / 2;
			const cy = h / 2;

			const count = stars.length;
			for (var i = 0; i < count; i++) {
				const star = stars[i];

				const x = cx + star.x / (star.z * 0.001);
				const y = cy + star.y / (star.z * 0.001);

				if (x < 0 || x >= w || y < 0 || y >= h) {
					continue;
				}

				const d = star.z / 1000.0;
				const b = 1 - d * d;

				putPixel(x, y, b);
			}

			requestAnimationFrame(tick);
		};

		requestAnimationFrame(init);
	});
</script>

<main>
	<div
		style="position: absolute; top:0%; left: 0%; text-align: center; height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column"
	>
		<Router />
	</div>
	<canvas id="canvas" style="width: 100%; height: 100%; padding: 0; margin: 0; z-index: 99" />
	<div id="powered">
		<PoweredByLamden />
	</div>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}

	:global(.main-container) {
		height: 93%;
		width: 93%;
		max-height: 600px;
		max-width: 800px;
		background-color: rgba(14, 23, 32, 0.7);
		overflow-y: scroll;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	:global(.main-container::-webkit-scrollbar) {
		display: none;
	}

	main {
		height: 100%;
		width: 100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
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
			width: 100%;
			position: relative;
			bottom: 60px;
			right: unset;
			/* bottom: 40px; */
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
