import { useEffect, useMemo, useState } from "react";

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
	const { items, highlightedKey, notFoundKey } = useMemo(
		() => getHashMapState(steps),
		[steps],
	);
	const entries = useMemo(() => Object.entries(items), [items]);
	const latestStep = steps[steps.length - 1];
	const activeKey = latestStep?.payload?.key;
	const [displayEntries, setDisplayEntries] = useState(entries);
	const isRemoving = action === "remove";

	useEffect(() => {
		if (!isRemoving) {
			const updateDisplay = window.setTimeout(() => {
				setDisplayEntries(entries);
			}, 0);

			return () => window.clearTimeout(updateDisplay);
		}

		const collapseDisplay = window.setTimeout(() => {
			setDisplayEntries(entries);
		}, 360);

		return () => window.clearTimeout(collapseDisplay);
	}, [entries, isRemoving]);

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Hash Map</h3>
				<span>{action || "ready"}</span>
			</div>

			{displayEntries.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="hash-map-grid">
					{displayEntries.map(([key, value]) => (
						<div
							className={`hash-map-item ${
								String(highlightedKey) === key ? "is-highlighted" : ""
							} ${
								action === "insert" && String(activeKey) === key
									? "is-inserting"
									: ""
							} ${
								(action === "lookup" || action === "highlight") &&
								String(activeKey) === key
									? "is-pulsing"
									: ""
							} ${
								isRemoving && String(activeKey) === key ? "is-removing" : ""
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
				<p className="visualizer-note is-not-found">
					Key {String(notFoundKey)} not found.
				</p>
			) : null}
		</div>
	);
}
