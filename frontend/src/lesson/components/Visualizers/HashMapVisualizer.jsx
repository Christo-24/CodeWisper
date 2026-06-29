function getHashMapState(steps) {
	return steps.reduce(
		(state, step) => {
			const key = step.payload?.key;

			if (step.action === "create") {
				return {
					items: {},
					highlightedKey: null,
					notFoundKey: null,
				};
			}

			if (step.action === "insert") {
				return {
					items: {
						...state.items,
						[key]: step.payload?.value,
					},
					highlightedKey: key,
					notFoundKey: null,
				};
			}

			if (step.action === "remove") {
				const updatedItems = { ...state.items };
				delete updatedItems[key];
				return {
					items: updatedItems,
					highlightedKey: null,
					notFoundKey: null,
				};
			}

			if (step.action === "lookup" || step.action === "highlight") {
				return {
					items: state.items,
					highlightedKey: key,
					notFoundKey:
						step.action === "lookup" && !Object.hasOwn(state.items, key)
							? key
							: null,
				};
			}

			return state;
		},
		{
			items: {},
			highlightedKey: null,
			notFoundKey: null,
		},
	);
}

export default function HashMapVisualizer({ action, steps = [] }) {
	const { items, highlightedKey, notFoundKey } = getHashMapState(steps);
	const entries = Object.entries(items);

	return (
		<div className="visualizer-card">
			<div className="visualizer-title">
				<h3>Hash Map</h3>
				<span>{action || "ready"}</span>
			</div>

			{entries.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="hash-map-grid">
					{entries.map(([key, value]) => (
						<div
							className={`hash-map-item ${
								String(highlightedKey) === key ? "is-highlighted" : ""
							}`}
							key={key}
						>
							<span>{key}</span>
							<strong>{"->"}</strong>
							<span>{String(value)}</span>
						</div>
					))}
				</div>
			)}

			{notFoundKey !== null ? (
				<p className="visualizer-note">Key {String(notFoundKey)} not found.</p>
			) : null}
		</div>
	);
}
