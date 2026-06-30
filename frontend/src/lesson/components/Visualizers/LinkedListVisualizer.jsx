import { useEffect, useMemo, useState } from "react";

function findNodeIndex(nodes, payload) {
	if (payload?.index !== undefined) {
		return payload.index;
	}

	if (payload?.id !== undefined) {
		return nodes.findIndex((node) => String(node.id) === String(payload.id));
	}

	if (payload?.value !== undefined) {
		return nodes.findIndex((node) => node.value === payload.value);
	}

	return -1;
}

function toNode(value, index) {
	if (typeof value === "object" && value !== null) {
		return {
			id: value.id ?? value.key ?? index,
			value: value.value ?? value.label ?? value.id ?? index,
		};
	}

	return {
		id: index,
		value,
	};
}

function getLinkedListState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				const values =
					step.payload?.nodes || step.payload?.values || step.payload?.items || [];

				return {
					nodes: values.map(toNode),
					highlightedIndex: null,
					pointers: {},
				};
			}

			if (step.action === "append") {
				return {
					...state,
					nodes: [...state.nodes, toNode(step.payload?.value, state.nodes.length)],
					highlightedIndex: state.nodes.length,
				};
			}

			if (step.action === "insert") {
				const nextNodes = [...state.nodes];
				const index = Math.max(
					0,
					Math.min(step.payload?.index ?? nextNodes.length, nextNodes.length),
				);

				nextNodes.splice(index, 0, toNode(step.payload?.value, index));

				return {
					...state,
					nodes: nextNodes,
					highlightedIndex: index,
				};
			}

			if (step.action === "remove") {
				const nextNodes = [...state.nodes];
				const index = findNodeIndex(nextNodes, step.payload);

				if (index < 0 || index >= nextNodes.length) {
					return state;
				}

				nextNodes.splice(index, 1);

				return {
					...state,
					nodes: nextNodes,
					highlightedIndex: null,
				};
			}

			if (step.action === "highlight") {
				return {
					...state,
					highlightedIndex: findNodeIndex(state.nodes, step.payload),
				};
			}

			if (step.action === "move_pointer") {
				const pointerName = step.payload?.name || step.payload?.pointer || "current";
				const pointerIndex = findNodeIndex(state.nodes, step.payload);

				return {
					...state,
					pointers: {
						...state.pointers,
						[pointerName]: pointerIndex,
					},
					highlightedIndex: pointerIndex,
				};
			}

			return state;
		},
		{
			nodes: [],
			highlightedIndex: null,
			pointers: {},
		},
	);
}

export default function LinkedListVisualizer({ action, steps = [] }) {
	const { nodes, highlightedIndex, pointers } = useMemo(
		() => getLinkedListState(steps),
		[steps],
	);
	const pointerEntries = Object.entries(pointers).filter(([, index]) => index >= 0);
	const latestStep = steps[steps.length - 1];
	const previousNodes = useMemo(
		() => getLinkedListState(steps.slice(0, -1)).nodes,
		[steps],
	);
	const [displayNodes, setDisplayNodes] = useState(nodes);
	const isRemoving = action === "remove";
	const removedIndex = isRemoving
		? findNodeIndex(previousNodes, latestStep?.payload)
		: -1;

	useEffect(() => {
		if (!isRemoving) {
			const updateDisplay = window.setTimeout(() => {
				setDisplayNodes(nodes);
			}, 0);

			return () => window.clearTimeout(updateDisplay);
		}

		const collapseDisplay = window.setTimeout(() => {
			setDisplayNodes(nodes);
		}, 360);

		return () => window.clearTimeout(collapseDisplay);
	}, [nodes, isRemoving]);

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Linked List</h3>
				<span>{action || "ready"}</span>
			</div>

			{displayNodes.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<div className="linked-list-row">
					{displayNodes.map((node, index) => (
						<div
							className={`linked-list-item ${
								action === "create" || action === "append" || action === "insert"
									? "is-created"
									: ""
							} ${removedIndex === index ? "is-removing" : ""}`}
							key={`${node.id}-${index}`}
							style={{ "--cell-index": index }}
						>
							<div className="linked-list-pointers">
								{pointerEntries
									.filter(([, pointerIndex]) => pointerIndex === index)
									.map(([name]) => (
										<span key={name}>{name}</span>
									))}
							</div>
							<div
								className={`list-node ${
									highlightedIndex === index ? "is-highlighted" : ""
								}`}
							>
								{String(node.value)}
							</div>
							{index < displayNodes.length - 1 ? (
								<span className="list-arrow is-arrow-animated">{"->"}</span>
							) : null}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
