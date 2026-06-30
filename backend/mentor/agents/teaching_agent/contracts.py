"""Visualizer contracts — must stay in sync with frontend visualizers."""

from mentor.agents.teaching_agent.enums import VisualizerAction, VisualizerType

VISUALIZER_ACTIONS: dict[VisualizerType, set[VisualizerAction]] = {
    VisualizerType.ARRAY: {
        VisualizerAction.CREATE,
        VisualizerAction.UPDATE,
        VisualizerAction.HIGHLIGHT,
        VisualizerAction.POINTER,
        VisualizerAction.MOVE_POINTER,
        VisualizerAction.SWAP,
    },
    VisualizerType.HASH_MAP: {
        VisualizerAction.CREATE,
        VisualizerAction.INSERT,
        VisualizerAction.REMOVE,
        VisualizerAction.LOOKUP,
        VisualizerAction.HIGHLIGHT,
    },
    VisualizerType.LINKED_LIST: {
        VisualizerAction.CREATE,
        VisualizerAction.APPEND,
        VisualizerAction.INSERT,
        VisualizerAction.REMOVE,
        VisualizerAction.HIGHLIGHT,
        VisualizerAction.MOVE_POINTER,
    },
    VisualizerType.TREE: {
        VisualizerAction.CREATE,
        VisualizerAction.INSERT,
        VisualizerAction.HIGHLIGHT,
        VisualizerAction.VISIT,
        VisualizerAction.REMOVE,
    },
    VisualizerType.BINARY_SEARCH: {
        VisualizerAction.CREATE,
        VisualizerAction.HIGHLIGHT_LEFT,
        VisualizerAction.HIGHLIGHT_MID,
        VisualizerAction.HIGHLIGHT_RIGHT,
        VisualizerAction.FOUND,
    },
    VisualizerType.TWO_POINTER: {
        VisualizerAction.CREATE,
        VisualizerAction.MOVE_LEFT,
        VisualizerAction.MOVE_RIGHT,
        VisualizerAction.HIGHLIGHT,
        VisualizerAction.SWAP,
    },
    VisualizerType.GRAPH: {
        VisualizerAction.CREATE,
        VisualizerAction.ADD_NODE,
        VisualizerAction.ADD_EDGE,
        VisualizerAction.VISIT,
        VisualizerAction.HIGHLIGHT_PATH,
    },
}

VISUALIZER_PAYLOAD_EXAMPLES: dict[VisualizerType, dict[str, str]] = {
    VisualizerType.ARRAY: {
        "create": '{"values":[2,7,11,15]}',
        "update": '{"index":1,"value":9}',
        "highlight": '{"index":0}',
        "pointer": '{"index":2}',
        "move_pointer": '{"index":2}',
        "swap": '{"from":0,"to":3}',
    },
    VisualizerType.HASH_MAP: {
        "create": "{}",
        "insert": '{"key":2,"value":0}',
        "remove": '{"key":2}',
        "lookup": '{"key":7}',
        "highlight": '{"key":2}',
    },
    VisualizerType.LINKED_LIST: {
        "create": '{"values":[1,2,3]}',
        "append": '{"value":4}',
        "insert": '{"index":1,"value":5}',
        "remove": '{"index":0}',
        "highlight": '{"index":2}',
        "move_pointer": '{"name":"current","index":1}',
    },
    VisualizerType.TREE: {
        "create": '{"values":[8,3,10,1,6]}',
        "insert": '{"value":4}',
        "highlight": '{"value":8}',
        "visit": '{"value":3}',
        "remove": '{"value":1}',
    },
    VisualizerType.BINARY_SEARCH: {
        "create": '{"values":[1,3,5,7,9,11]}',
        "highlight_left": '{"index":0}',
        "highlight_mid": '{"index":2}',
        "highlight_right": '{"index":5}',
        "found": '{"index":3}',
    },
    VisualizerType.TWO_POINTER: {
        "create": '{"values":[1,2,3,4,5],"left":0,"right":4}',
        "move_left": '{"index":1}',
        "move_right": '{"index":3}',
        "highlight": '{"indexes":[1,3]}',
        "swap": '{"from":1,"to":3}',
    },
    VisualizerType.GRAPH: {
        "create": '{"nodes":["A","B","C"],"edges":[["A","B"],["B","C"]]}',
        "add_node": '{"id":"D"}',
        "add_edge": '{"from":"A","to":"C"}',
        "visit": '{"id":"B"}',
        "highlight_path": '{"path":["A","B","C"]}',
    },
}


def format_visualizer_contracts() -> str:
    lines: list[str] = []

    for visualizer_type in VisualizerType:
        actions = sorted(
            VISUALIZER_ACTIONS[visualizer_type],
            key=lambda action: action.value,
        )
        action_names = ", ".join(action.value for action in actions)
        lines.append(f"{visualizer_type.value}: {action_names}")

        examples = VISUALIZER_PAYLOAD_EXAMPLES.get(visualizer_type, {})
        for action in actions:
            example = examples.get(action.value)
            if example:
                lines.append(f"  {action.value} → {example}")

        lines.append("")

    return "\n".join(lines).strip()
