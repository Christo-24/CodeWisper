from langchain.agents import create_agent

from .prompts import (TEACHING_SYSTEM_PROMPT, TEACHING_USER_PROMPT)
from .schemas import TeachingOutput
from ...llms.factory import LLMFactory

class TeachingAgent:
    def __init__(self):
        self.llm = LLMFactory.get_mentor_llm()
        self.agent = create_agent(
            model=self.llm,
            tools=[],
            system_prompt=TEACHING_SYSTEM_PROMPT,
            response_format=TeachingOutput
        )
    def run(self,problem_name: str):
        user_prompt = TEACHING_USER_PROMPT.format(problem_name=problem_name)
        result= self.agent.invoke({
            "messages": [{"role": "user", "content": user_prompt}]
        })
        return result["structured_response"]
