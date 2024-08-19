import { useLoader, useThrelte, type AsyncWritable } from "@threlte/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import type { Object3D } from "three";

type Nodes = Record<string, any>;
type Materials = Record<string, any>;

type SceneGraph = {
	nodes: Nodes;
	materials: Materials;
};

const buildSceneGraph = <Graph extends SceneGraph = any>(object: Object3D): Graph => {
	const data: Graph = { nodes: {}, materials: {} } as Graph;
	if (object) {
		object.traverse((obj: any) => {
			if (obj.name) data.nodes[obj.name as any] = obj;
			if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name as any] = obj.material;
		});
	}
	return data as Graph;
};
type ThrelteGltf<Graph extends SceneGraph> = GLTF & Graph;

type UseGltfOptions = {
	useDraco?: boolean | string | DRACOLoader;
	useMeshopt?: boolean;
	ktxTranscoderPath?: string;
};

const defaultDracoLoaderInstances: Record<string, DRACOLoader> = {};

export function useGltf(options?: UseGltfOptions): {
	load: <
		Graph extends SceneGraph = {
			nodes: Record<string, any>;
			materials: Record<string, any>;
		},
	>(
		url: string,
	) => AsyncWritable<ThrelteGltf<Graph>>;
};
export function useGltf<
	Graph extends SceneGraph = {
		nodes: Record<string, any>;
		materials: Record<string, any>;
	},
>(url: string, options?: UseGltfOptions): AsyncWritable<ThrelteGltf<Graph>>;
export function useGltf<
	Graph extends SceneGraph = {
		nodes: Record<string, any>;
		materials: Record<string, any>;
	},
>(
	urlOrOptions?: string | UseGltfOptions,
	options?: UseGltfOptions,
):
	| AsyncWritable<ThrelteGltf<Graph>>
	| {
			load: <
				Graph extends SceneGraph = {
					nodes: Record<string, any>;
					materials: Record<string, any>;
				},
			>(
				url: string,
			) => AsyncWritable<ThrelteGltf<Graph>>;
	  } {
	const { renderer } = useThrelte();
	const opts = typeof urlOrOptions === "string" ? options : urlOrOptions;
	const loader = useLoader(GLTFLoader, {
		extend(loader) {
			if (opts?.useDraco) {
				if (typeof opts.useDraco === "string" || typeof opts.useDraco === "boolean") {
					// default draco
					const path = typeof opts.useDraco === "string" ? opts.useDraco : "https://www.gstatic.com/draco/versioned/decoders/1.4.3/";

					if (!defaultDracoLoaderInstances[path]) {
						defaultDracoLoaderInstances[path] = new DRACOLoader().setDecoderPath(path);
					}
					loader.setDRACOLoader(defaultDracoLoaderInstances[path]);
				} else {
					// user's draco
					loader.setDRACOLoader(opts.useDraco);
				}
			}

			if (opts?.useMeshopt) {
				loader.setMeshoptDecoder(MeshoptDecoder);
			}

			if (opts?.ktxTranscoderPath) {
				const ktx2Loader = new KTX2Loader();
				ktx2Loader.setTranscoderPath(opts?.ktxTranscoderPath);
				ktx2Loader.detectSupport(renderer);
				loader.setKTX2Loader(ktx2Loader);
			}
		},
	});

	const load = (url: string) => {
		return loader.load(url, {
			transform(result) {
				return {
					...result,
					...buildSceneGraph(result.scene),
				};
			},
		});
	};

	const url = typeof urlOrOptions === "string" ? urlOrOptions : undefined;

	if (url) {
		return load(url);
	} else {
		return {
			load,
		};
	}
}
