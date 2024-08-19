<script lang="ts">
	import { T, useThrelte } from "@threlte/core";
	import { Color } from "three";

	import vertexShader from "./vertex.glsl?raw";
	import fragmentShader from "./fragment.glsl?raw";
	import { getContext, onMount } from "svelte";

	let { ...props } = $props();

	let dark: Color = new Color(5 / 255, 7 / 255, 15 / 255);
	let darker: Color = new Color(3 / 255, 4 / 255, 10 / 255);
	let darkest: Color = new Color(1 / 255, 1 / 255, 4 / 255);

	type Uniforms = { time: { value: number }; uColor: { value: Array<Color> }; scale: { value: number } };
	let uniforms: Uniforms = {
		time: {
			value: 0,
		},
		uColor: {
			value: [],
		},
		scale: {
			value: 100,
		},
	};

	const { invalidate } = useThrelte();

	function updateUniforms() {
		uniforms.time.value++;
		uniforms.scale.value = clamp(Math.round(resolution().window_width / 10), 50, 200);
		invalidate();
	}

	onMount(() => {
		uniforms.uColor.value = [dark, darker, darkest, darkest];
		const interval_id = setInterval(updateUniforms, 1);
		return () => {
			clearInterval(interval_id);
		};
	});

	const resolution = getContext<() => { window_width: number; window_height: number }>("resolution");

	function clamp(value: number, min: number, max: number): number {
		return value < min ? min : value > max ? max : value;
	}

	function getGeometryArgs() {
		return [
			resolution().window_width * 1.5,
			resolution().window_height * 1.5,
			clamp(Math.round(resolution().window_width / 3), 10, 300),
			clamp(Math.round(resolution().window_height / 3), 10, 300),
			// 1400, 800, 300, 300,
		];
	}
</script>

<T.Group {...props}>
	<T.Mesh>
		<T.PlaneGeometry args={getGeometryArgs()} />
		<T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} />
	</T.Mesh>
</T.Group>
