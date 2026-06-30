import {
	ArrayVisualizer,
	BinarySearchVisualizer,
	BinaryTreeVisualizer,
	GraphVisualizer,
	HashMapVisualizer,
	LinkedListVisualizer,
	TwoPointerVisualizer,
	VisualPlaceholder,
} from "../components/Visualizers";

export function getVisualizer(visualizerType) {
	const visualizers = {
		array: ArrayVisualizer,
		hash_map: HashMapVisualizer,
		linked_list: LinkedListVisualizer,
		tree: BinaryTreeVisualizer,
		binary_search: BinarySearchVisualizer,
		two_pointer: TwoPointerVisualizer,
		graph: GraphVisualizer,
	};

	return visualizers[visualizerType] || VisualPlaceholder;
}
