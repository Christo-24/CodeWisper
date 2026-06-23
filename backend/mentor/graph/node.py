from mentor.agents.mentor_agent.agent import MentorAgent
from mentor.agents.problem_extractor.agent import ProblemExtractorAgent

from mentor.models import Conversation 

problem_agent = ProblemExtractorAgent()
mentor_agent = MentorAgent()

def problem_extraction_node(state):
    result=problem_agent.run(state["ocr_text"])
    return{
        "problem_name": result.problem_name
    }

def mentor_node(state):
    result=mentor_agent.run(problem_name=state["problem_name"],code=state["code"],question=state["question"])
    answer=result["messages"][-1].content
    Conversation.objects.create(
        question=state["question"],
        answer=answer,
    )
    return{
        "answer": answer
    }