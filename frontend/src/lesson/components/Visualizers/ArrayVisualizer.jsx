function getArrayState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				return {
					values: step.payload?.values || [],
					highlightedIndex: null,
					pointerIndex: null,
				};
			}

			if (step.action === "update") {
				return {
					...state,
					values: state.values.map((value, index) =>
						index === step.payload?.index ? step.payload?.value : value,
					),
					highlightedIndex: step.payload?.index,
				};
			}

			if (step.action === "highlight") {
				return {
					...state,
					highlightedIndex: step.payload?.index,
				};
			}

			if (step.action === "pointer" || step.action === "move_pointer") {
				return {
					...state,
					pointerIndex: step.payload?.index,
				};
			}

			if (step.action === "swap") {
				const nextValues = [...state.values];
				const firstIndex = step.payload?.from ?? step.payload?.indexA;
				const secondIndex = step.payload?.to ?? step.payload?.indexB;

				if (
					firstIndex === undefined ||
					secondIndex === undefined ||
					firstIndex < 0 ||
					secondIndex < 0 ||
					firstIndex >= nextValues.length ||
					secondIndex >= nextValues.length
				) {
					return state;
				}

				[nextValues[firstIndex], nextValues[secondIndex]] = [
					nextValues[secondIndex],
					nextValues[firstIndex],
				];

				return {
					...state,
					values: nextValues,
					highlightedIndex: secondIndex,
				};
			}

			return state;
		},
		{
			values: [],
			highlightedIndex: null,
			pointerIndex: null,
		},
	);
}

export default function ArrayVisualizer({ action, steps = [] }) {
	const { values, highlightedIndex, pointerIndex } = getArrayState(steps);

	return (
		<div className="visualizer-card">
			<div className="visualizer-title">
				<h3>Array</h3>
				<span>{action || "ready"}</span>
			</div>

			{values.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="array-row">
					{values.map((value, index) => (
						<div className="array-cell-wrap" key={`${index}-${value}`}>
							<div
								className={`array-cell ${
									highlightedIndex === index ? "is-highlighted" : ""
								}`}
							>
								{String(value)}
							</div>
							<div className="array-index">{index}</div>
							<div className="array-pointer">
								{pointerIndex === index ? "^" : ""}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
