from mentor.agents.mentor_agent.agent import MentorAgent
from mentor.agents.problem_extractor.agent import ProblemExtractorAgent
from mentor.agents.code_analyzer.agent import CodeAnalyzerAgent
from mentor.agents.chat_agent.agent import ChatAgent
from mentor.agents.supervisor.agent import SupervisorAgent


from mentor.models import Conversation 

problem_agent = ProblemExtractorAgent()
mentor_agent = MentorAgent()
code_analyzer_agent = CodeAnalyzerAgent()
chat_agent = ChatAgent()
supervisor_agent = SupervisorAgent()

def supervisor_node(state):
    result=supervisor_agent.run(question=state["question"])
    return{
        "route": result.route
    }

def chat_node(state):
    result=chat_agent.run(question=state["question"])
    return{
        "answer": result.answer
    }

def problem_extraction_node(state):
    result=problem_agent.run(ocr_text=state["ocr_text"])
    return{
        "problem_name": result.problem_name
    }


def code_analyze_node(state):
    result=code_analyzer_agent.run(problem_name=state["problem_name"], code=state["code"])
    return{
        "analyze": result
    }


def mentor_node(state):
    result=mentor_agent.run(problem_name=state["problem_name"],analyze=state["analyze"],code=state["code"],question=state["question"])
    answer=result["messages"][-1].content
    Conversation.objects.create(
        question=state["question"],
        answer=answer,
    )
    return{
        "answer": answer
    }