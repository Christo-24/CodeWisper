from ...llms.factory import LLMFactory
from ...tools.memory_tool import get_recent_conversation
from .prompts import MENTOR_SYSTEM_PROMPT, MENTOR_USER_PROMPT
from .schemas import MentorOutput

from langchain.agents import create_agent


class MentorAgent:
    def __init__(self):
        self.llm = LLMFactory.get_mentor_llm()
        
        self.agent=create_agent(
            model=self.llm,
            tools=[get_recent_conversation],
            system_prompt=MENTOR_SYSTEM_PROMPT
        )
    def run(self,problem_name,code,question):
        user_promt = MENTOR_USER_PROMPT.format(problem_name=problem_name,code=code,question=question)
        answer = self.agent.invoke({
            "messages": [{"role": "user", "content": user_promt}
            ]
        })
        return answer