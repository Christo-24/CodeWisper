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
	const latestStep = steps[steps.length - 1];
	const animatedIndex = latestStep?.payload?.index;
	const swapFrom = latestStep?.payload?.from ?? latestStep?.payload?.indexA;
	const swapTo = latestStep?.payload?.to ?? latestStep?.payload?.indexB;

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Array</h3>
				<span>{action || "ready"}</span>
			</div>

			{values.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div
					className="array-row array-row-animated"
					style={{
						"--pointer-index": pointerIndex ?? 0,
						"--has-pointer": pointerIndex === null ? 0 : 1,
					}}
				>
					{values.map((value, index) => (
						<div
							className={`array-cell-wrap ${
								action === "create" ? "is-created" : ""
							} ${
								action === "swap" && (index === swapFrom || index === swapTo)
									? "is-swapping"
									: ""
							}`}
							key={`${index}-${value}`}
							style={{
								"--cell-index": index,
								"--swap-offset":
									index === swapFrom
										? (swapTo - swapFrom) * 68
										: index === swapTo
											? (swapFrom - swapTo) * 68
											: 0,
							}}
						>
							<div
								className={`array-cell ${
									highlightedIndex === index ? "is-highlighted" : ""
								} ${
									action === "update" && animatedIndex === index
										? "is-updated"
										: ""
								}`}
							>
								{String(value)}
							</div>
							<div className="array-index">{index}</div>
						</div>
					))}
					<div className="array-motion-pointer">^</div>
				</div>
			)}
		</div>
	);
}
