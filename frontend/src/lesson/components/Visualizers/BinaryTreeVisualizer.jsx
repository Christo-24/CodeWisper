function makeTreeNode(value) {
	if (typeof value === "object" && value !== null) {
		return {
			id: value.id ?? value.key ?? value.value ?? value.label,
			value: value.value ?? value.label ?? value.id,
			left: value.left ? makeTreeNode(value.left) : null,
			right: value.right ? makeTreeNode(value.right) : null,
		};
	}

	return {
		id: value,
		value,
		left: null,
		right: null,
	};
}

function insertNode(root, value) {
	const nextNode = makeTreeNode(value);

	if (!root) {
		return nextNode;
	}

	if (Number(nextNode.value) < Number(root.value)) {
		return {
			...root,
			left: insertNode(root.left, value),
		};
	}

	return {
		...root,
		right: insertNode(root.right, value),
	};
}

function findMin(node) {
	let current = node;

	while (current?.left) {
		current = current.left;
	}

	return current;
}

function removeNode(root, value) {
	if (!root) {
		return null;
	}

	if (String(value) === String(root.id) || String(value) === String(root.value)) {
		if (!root.left) {
			return root.right;
		}

		if (!root.right) {
			return root.left;
		}

		const successor = findMin(root.right);

		return {
			...successor,
			left: root.left,
			right: removeNode(root.right, successor.value),
		};
	}

	if (Number(value) < Number(root.value)) {
		return {
			...root,
			left: removeNode(root.left, value),
		};
	}

	return {
		...root,
		right: removeNode(root.right, value),
	};
}

function getNodeKey(payload) {
	return payload?.id ?? payload?.value ?? payload?.node;
}

function getBinaryTreeState(steps) {
	return steps.reduce(
		(state, step) => {
			if (step.action === "create") {
				if (step.payload?.root) {
					return {
						root: makeTreeNode(step.payload.root),
						highlightedKey: null,
						visitedKeys: new Set(),
					};
				}

				const values = step.payload?.values || step.payload?.nodes || [];

				return {
					root: values.reduce((root, value) => insertNode(root, value), null),
					highlightedKey: null,
					visitedKeys: new Set(),
				};
			}

			if (step.action === "insert") {
				const value = step.payload?.value ?? step.payload?.node;

				return {
					...state,
					root: insertNode(state.root, value),
					highlightedKey: value,
				};
			}

			if (step.action === "highlight") {
				return {
					...state,
					highlightedKey: getNodeKey(step.payload),
				};
			}

			if (step.action === "visit") {
				const visitedKey = getNodeKey(step.payload);
				const visitedKeys = new Set(state.visitedKeys);
				visitedKeys.add(String(visitedKey));

				return {
					...state,
					highlightedKey: visitedKey,
					visitedKeys,
				};
			}

			if (step.action === "remove") {
				const value = getNodeKey(step.payload);

				return {
					...state,
					root: removeNode(state.root, value),
					highlightedKey: null,
				};
			}

			return state;
		},
		{
			root: null,
			highlightedKey: null,
			visitedKeys: new Set(),
		},
	);
}

function TreeNode({ node, highlightedKey, visitedKeys, action }) {
	if (!node) {
		return null;
	}

	const isHighlighted =
		String(highlightedKey) === String(node.id) ||
		String(highlightedKey) === String(node.value);
	const isVisited =
		visitedKeys.has(String(node.id)) || visitedKeys.has(String(node.value));
	const hasChildren = node.left || node.right;

	return (
		<div className="tree-node-wrap">
			<div
				className={`tree-node ${isHighlighted ? "is-highlighted" : ""} ${
					isVisited ? "is-visited" : ""
				} ${action === "insert" && isHighlighted ? "is-inserting" : ""} ${
					action === "visit" && isHighlighted ? "is-traversing" : ""
				}`}
			>
				{String(node.value)}
			</div>
			{hasChildren ? (
				<div className="tree-children">
					<div className="tree-child">
						<TreeNode
							node={node.left}
							highlightedKey={highlightedKey}
							visitedKeys={visitedKeys}
							action={action}
						/>
					</div>
					<div className="tree-child">
						<TreeNode
							node={node.right}
							highlightedKey={highlightedKey}
							visitedKeys={visitedKeys}
							action={action}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default function BinaryTreeVisualizer({ action, steps = [] }) {
	const { root, highlightedKey, visitedKeys } = getBinaryTreeState(steps);

	return (
		<div className={`visualizer-card visualizer-animate-${action || "ready"}`}>
			<div className="visualizer-title">
				<h3>Binary Tree</h3>
				<span>{action || "ready"}</span>
			</div>

			{root ? (
				<div className="binary-tree-canvas">
					<TreeNode
						node={root}
						highlightedKey={highlightedKey}
						visitedKeys={visitedKeys}
						action={action}
					/>
				</div>
			) : (
				<p className="visualizer-empty">(empty)</p>
			)}
		</div>
	);
}
