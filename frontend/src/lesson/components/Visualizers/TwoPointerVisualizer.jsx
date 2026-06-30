function resolveIndex(values, payload, fallbackKey) {
	if (payload?.index !== undefined) {
		return payload.index;
	}

	if (payload?.[fallbackKey] !== undefined) {
		return payload[fallbackKey];
	}

	if (payload?.value !== undefined) {
		return values.findIndex((value) => value === payload.value);
	}

	return null;
}

function getTwoPointerState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				return {
					values: step.payload?.values || step.payload?.array || [],
					leftIndex: step.payload?.left ?? 0,
					rightIndex:
						step.payload?.right ??
						Math.max((step.payload?.values || step.payload?.array || []).length - 1, 0),
					highlightedIndexes: new Set(),
				};
			}

			if (step.action === "move_left") {
				return {
					...state,
					leftIndex: resolveIndex(state.values, step.payload, "left"),
				};
			}

			if (step.action === "move_right") {
				return {
					...state,
					rightIndex: resolveIndex(state.values, step.payload, "right"),
				};
			}

			if (step.action === "highlight") {
				const indexes = step.payload?.indexes || step.payload?.indices;
				const highlightedIndexes = new Set(
					Array.isArray(indexes)
						? indexes
						: [resolveIndex(state.values, step.payload, "index")],
				);

				return {
					...state,
					highlightedIndexes,
				};
			}

			if (step.action === "swap") {
				const nextValues = [...state.values];
				const firstIndex = step.payload?.from ?? step.payload?.indexA ?? state.leftIndex;
				const secondIndex = step.payload?.to ?? step.payload?.indexB ?? state.rightIndex;

				if (
					firstIndex === null ||
					secondIndex === null ||
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
					highlightedIndexes: new Set([firstIndex, secondIndex]),
				};
			}

			return state;
		},
		{
			values: [],
			leftIndex: null,
			rightIndex: null,
			highlightedIndexes: new Set(),
		},
	);
}

export default function TwoPointerVisualizer({ action, steps = [] }) {
	const { values, leftIndex, rightIndex, highlightedIndexes } =
		getTwoPointerState(steps);
	const latestStep = steps[steps.length - 1];
	const swapFrom = latestStep?.payload?.from ?? latestStep?.payload?.indexA ?? leftIndex;
	const swapTo = latestStep?.payload?.to ?? latestStep?.payload?.indexB ?? rightIndex;
	const windowStart = Math.min(leftIndex ?? 0, rightIndex ?? values.length - 1);
	const windowEnd = Math.max(leftIndex ?? 0, rightIndex ?? values.length - 1);

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Two Pointer</h3>
				<span>{action || "ready"}</span>
			</div>

			{values.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="pointer-array-row">
					{values.map((value, index) => (
						<div
							className={`pointer-cell-wrap ${
								action === "swap" && (index === swapFrom || index === swapTo)
									? "is-swapping"
									: ""
							}`}
							key={`${index}-${value}`}
							style={{
								"--swap-offset":
									index === swapFrom
										? (swapTo - swapFrom) * 68
										: index === swapTo
											? (swapFrom - swapTo) * 68
											: 0,
							}}
						>
							<div className="pointer-label-row">
								{leftIndex === index ? (
									<span className="pointer-left is-pointer-moving">L</span>
								) : null}
								{rightIndex === index ? (
									<span className="pointer-right is-pointer-moving">R</span>
								) : null}
							</div>
							<div
								className={`array-cell ${
									highlightedIndexes.has(index) ? "is-highlighted" : ""
								} ${
									index >= windowStart && index <= windowEnd
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
