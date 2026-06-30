function getIndex(payload) {
	return payload?.index ?? payload?.left ?? payload?.right ?? payload?.mid;
}

function getBinarySearchState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				return {
					values: step.payload?.values || step.payload?.array || [],
					leftIndex: null,
					midIndex: null,
					rightIndex: null,
					foundIndex: null,
				};
			}

			if (step.action === "highlight_left") {
				return {
					...state,
					leftIndex: getIndex(step.payload),
				};
			}

			if (step.action === "highlight_mid") {
				return {
					...state,
					midIndex: getIndex(step.payload),
				};
			}

			if (step.action === "highlight_right") {
				return {
					...state,
					rightIndex: getIndex(step.payload),
				};
			}

			if (step.action === "found") {
				return {
					...state,
					foundIndex: getIndex(step.payload),
				};
			}

			return state;
		},
		{
			values: [],
			leftIndex: null,
			midIndex: null,
			rightIndex: null,
			foundIndex: null,
		},
	);
}

export default function BinarySearchVisualizer({ action, steps = [] }) {
	const { values, leftIndex, midIndex, rightIndex, foundIndex } =
		getBinarySearchState(steps);
	const intervalStart = leftIndex ?? 0;
	const intervalEnd = rightIndex ?? values.length - 1;

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Binary Search</h3>
				<span>{action || "ready"}</span>
			</div>

			{values.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="pointer-array-row">
					{values.map((value, index) => (
						<div className="pointer-cell-wrap" key={`${index}-${value}`}>
							<div className="pointer-label-row">
								{leftIndex === index ? (
									<span className="pointer-left is-pointer-moving">L</span>
								) : null}
								{midIndex === index ? (
									<span className="pointer-mid is-pointer-moving">M</span>
								) : null}
								{rightIndex === index ? (
									<span className="pointer-right is-pointer-moving">R</span>
								) : null}
							</div>
							<div
								className={`array-cell ${
									foundIndex === index ? "is-found" : ""
								} ${midIndex === index ? "is-mid" : ""} ${
									leftIndex === index || rightIndex === index ? "is-bounded" : ""
								} ${
									index >= intervalStart && index <= intervalEnd
										? "is-in-search-window"
										: "is-outside-search-window"
								}`}
							>
								{String(value)}
							</div>
							<div className="array-index">{index}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
