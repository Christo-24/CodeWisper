import {
	ArrayVisualizer,
	HashMapVisualizer,
	VisualPlaceholder,
} from "../components/Visualizers";

export function getVisualizer(visualizerType) {
	if (visualizerType === "hash_map") {
		return HashMapVisualizer;
	}

	if (visualizerType === "array") {
		return ArrayVisualizer;
	}

	return VisualPlaceholder;
}
