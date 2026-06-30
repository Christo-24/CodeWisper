function normalizeNode(node, index) {
	if (typeof node === "object" && node !== null) {
		return {
			id: String(node.id ?? node.key ?? node.label ?? index),
			label: String(node.label ?? node.value ?? node.id ?? index),
			x: node.x,
			y: node.y,
		};
	}

	return {
		id: String(node),
		label: String(node),
		x: undefined,
		y: undefined,
	};
}

function normalizeEdge(edge) {
	if (Array.isArray(edge)) {
		return {
			from: String(edge[0]),
			to: String(edge[1]),
		};
	}

	return {
		from: String(edge.from ?? edge.source ?? edge.start),
		to: String(edge.to ?? edge.target ?? edge.end),
	};
}

function positionNodes(nodes) {
	const centerX = 320;
	const centerY = 160;
	const radius = nodes.length > 4 ? 118 : 96;

	return nodes.map((node, index) => {
		if (node.x !== undefined && node.y !== undefined) {
			return node;
		}

		const angle = (Math.PI * 2 * index) / Math.max(nodes.length, 1) - Math.PI / 2;

		return {
			...node,
			x: Math.round(centerX + Math.cos(angle) * radius),
			y: Math.round(centerY + Math.sin(angle) * radius),
		};
	});
}

function getGraphState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				return {
					nodes: positionNodes(
						(step.payload?.nodes || []).map((node, index) =>
							normalizeNode(node, index),
						),
					),
					edges: (step.payload?.edges || []).map(normalizeEdge),
					visitedNodes: new Set(),
					highlightedPath: new Set(),
				};
			}

			if (step.action === "add_node") {
				return {
					...state,
					nodes: positionNodes([
						...state.nodes,
						normalizeNode(step.payload?.node ?? step.payload?.id, state.nodes.length),
					]),
				};
			}

			if (step.action === "add_edge") {
				return {
					...state,
					edges: [...state.edges, normalizeEdge(step.payload)],
				};
			}

			if (step.action === "visit") {
				const nodeId = String(step.payload?.id ?? step.payload?.node);
				const visitedNodes = new Set(state.visitedNodes);
				visitedNodes.add(nodeId);

				return {
					...state,
					visitedNodes,
				};
			}

			if (step.action === "highlight_path") {
				const path = step.payload?.path || step.payload?.nodes || [];

				return {
					...state,
					highlightedPath: new Set(path.map(String)),
				};
			}

			return state;
		},
		{
			nodes: [],
			edges: [],
			visitedNodes: new Set(),
			highlightedPath: new Set(),
		},
	);
}

export default function GraphVisualizer({ action, steps = [] }) {
	const { nodes, edges, visitedNodes, highlightedPath } = getGraphState(steps);
	const nodeMap = new Map(nodes.map((node) => [node.id, node]));
	const latestStep = steps[steps.length - 1];
	const activeNode = String(latestStep?.payload?.id ?? latestStep?.payload?.node);

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Graph</h3>
				<span>{action || "ready"}</span>
			</div>

			{nodes.length === 0 ? (
				<p className="visualizer-empty">(empty)</p>
			) : (
				<svg className="graph-canvas" viewBox="0 0 640 320" role="img">
					{edges.map((edge, index) => {
						const from = nodeMap.get(edge.from);
						const to = nodeMap.get(edge.to);
						const isPathEdge =
							highlightedPath.has(edge.from) && highlightedPath.has(edge.to);

						if (!from || !to) {
							return null;
						}

						return (
							<line
								className={`graph-edge ${isPathEdge ? "is-highlighted" : ""} ${
									action === "add_edge" ? "is-drawing" : ""
								}`}
								key={`${edge.from}-${edge.to}-${index}`}
								x1={from.x}
								y1={from.y}
								x2={to.x}
								y2={to.y}
							/>
						);
					})}
					{nodes.map((node) => {
						const isVisited = visitedNodes.has(node.id);
						const isPathNode = highlightedPath.has(node.id);

						return (
							<g
								className={`graph-node ${isVisited ? "is-visited" : ""} ${
									isPathNode ? "is-highlighted" : ""
								} ${
									action === "add_node" || activeNode === node.id
										? "is-animating"
										: ""
								}`}
								key={node.id}
							>
								<circle cx={node.x} cy={node.y} r="24" />
								<text x={node.x} y={node.y} textAnchor="middle" dy="0.35em">
									{node.label}
								</text>
							</g>
						);
					})}
				</svg>
			)}
		</div>
	);
}
