from langgraph.graph import StateGraph,END,START

from mentor.graph.state import CodeWispherState
from mentor.graph.node import chat_node,supervisor_node

from .leetcode_graph import leetcode_workflow
from .router import route_question


builder = StateGraph(CodeWispherState)

builder.add_node("supervisor",supervisor_node)
builder.add_node("chat",chat_node)
builder.add_node("leetcode",leetcode_workflow)

builder.add_edge(START,"supervisor")
builder.add_conditional_edges("supervisor",
    route_question,
    {
        "leetcode": "leetcode",
        "general_chat": "chat"
    }
)
builder.add_edge("chat",END)

workflow = builder.compile()
