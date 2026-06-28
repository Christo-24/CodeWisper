from langgraph.graph import StateGraph,END,START

from .router import route_question

from mentor.graph.state import CodeWispherState
from mentor.graph.node import problem_extraction_node,mentor_node,code_analyze_node,teaching_node,leetcode_router_node



builder = StateGraph(CodeWispherState)

builder.add_node("problem_extraction",problem_extraction_node)
builder.add_node("leetcode_router",leetcode_router_node)
builder.add_node("code_analysis",code_analyze_node)
builder.add_node("mentor",mentor_node)
builder.add_node("teaching",teaching_node)

builder.add_edge(START,"problem_extraction")
builder.add_edge("problem_extraction","leetcode_router")
builder.add_conditional_edges(
    "leetcode_router",
    route_question,
    {
        "code_analyser": "code_analysis",
        "teaching": "teaching",
    }
)
builder.add_edge("code_analysis","mentor")
builder.add_edge("mentor",END)
builder.add_edge("teaching",END)

leetcode_workflow = builder.compile()
