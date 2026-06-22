from mentor.agents.mentor_agent.agent import MentorAgent
from mentor.agents.problem_extractor.agent import ProblemExtractorAgent

problem_agent = ProblemExtractorAgent()
mentor_agent = MentorAgent()

def problem_extraction_node(state):
    result=problem_agent.run(state["ocr_text"])
    return{
        "problem_name": result.problem_name
    }

def mentor_node(state):
    result=mentor_agent.run(problem_name=state["problem_name"],code=state["code"],question=state["question"])
    return{
        "answer":result["messages"][-1].content
    }