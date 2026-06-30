from enum import Enum


class VisualizerType(str, Enum):
    ARRAY = "array"
    HASH_MAP = "hash_map"
    BINARY_SEARCH = "binary_search"
    GRAPH = "graph"
    TREE = "tree"
    LINKED_LIST = "linked_list"
    TWO_POINTER = "two_pointer"


class VisualizerAction(str, Enum):
    # Shared
    CREATE = "create"
    INSERT = "insert"
    REMOVE = "remove"
    HIGHLIGHT = "highlight"
    SWAP = "swap"
    VISIT = "visit"

    # Array
    UPDATE = "update"
    POINTER = "pointer"
    MOVE_POINTER = "move_pointer"

    # Hash map
    LOOKUP = "lookup"

    # Linked list
    APPEND = "append"

    # Binary search
    HIGHLIGHT_LEFT = "highlight_left"
    HIGHLIGHT_MID = "highlight_mid"
    HIGHLIGHT_RIGHT = "highlight_right"
    FOUND = "found"

    # Two pointer
    MOVE_LEFT = "move_left"
    MOVE_RIGHT = "move_right"

    # Graph
    ADD_NODE = "add_node"
    ADD_EDGE = "add_edge"
    HIGHLIGHT_PATH = "highlight_path"
