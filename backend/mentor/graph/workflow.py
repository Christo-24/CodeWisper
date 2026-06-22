from langgraph.graph import StateGraph,END,START

from mentor.graph.state import CodeWispherState
from mentor.graph.node import problem_extraction_node,mentor_node

builder = StateGraph(CodeWispherState)

builder.add_node("problem_extraction",problem_extraction_node)
builder.add_node("mentor",mentor_node)

builder.add_edge(START,"problem_extraction")
builder.add_edge("problem_extraction","mentor")
builder.add_edge("mentor",END)

workflow = builder.compile()