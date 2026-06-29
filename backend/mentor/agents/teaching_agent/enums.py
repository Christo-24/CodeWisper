from enum import Enum

class LessonStepType(str, Enum):
    SPEECH = "speech"
    VISUAL = "visual"


class VisualizerType(str, Enum):
    ARRAY = "array"
    HASH_MAP = "hash_map"
    BINARY_SEARCH="binary_search"
    GRAPH="graph"
    TREE="tree"
    LINKED_LIST="linked_list"
    STACK="stack"
    QUEUE="queue"
    HEAP="heap"
    DP_TABLE="dp_table"
    SLIDING_WINDOW="sliding_window"

class VisualizerAction(str, Enum):
    CREATE = "create"
    INSERT = "insert"
    REMOVE = "remove"
    HIGHLIGHT = "highlight"
    LOOKUP = "lookup"
    MOVE_POINTER = "move_pointer"
    SWAP = "swap"
    VISIT = "visit"
    UPDATE = "update"
    COMPLETE = "complete"