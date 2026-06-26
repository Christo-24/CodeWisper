from langgraph.graph import StateGraph,END,START

from mentor.graph.state import CodeWispherState
from mentor.graph.node import problem_extraction_node,mentor_node,code_analyze_node,chat_node,supervisor_node

from .router import route_question


builder = StateGraph(CodeWispherState)

builder.add_node("supervisor",supervisor_node)
builder.add_node("chat",chat_node)
builder.add_node("problem_extraction",problem_extraction_node)
builder.add_node("code_analysis",code_analyze_node)
builder.add_node("mentor",mentor_node)

builder.add_edge(START,"supervisor")
builder.add_conditional_edges("supervisor",
    route_question,
    {
        "leetcode": "problem_extraction",
        "general_chat": "chat"
    }
)
builder.add_edge("problem_extraction","code_analysis")
builder.add_edge("code_analysis","mentor")
builder.add_edge("mentor",END)
builder.add_edge("chat",END)

workflow = builder.compile()