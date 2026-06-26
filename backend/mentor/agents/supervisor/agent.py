from ...llms.factory import LLMFactory

from .prompts import SUPERVISOR_SYSTEM_PROMPT, SUPERVISOR_USER_PROMPT
from .schemas import SupervisorOutput

from langchain.agents import create_agent

class SupervisorAgent:
    def __init__(self):
        self.llm = LLMFactory.get_supervisor_llm()
        self.agent = create_agent(
            model=self.llm,
            tools=[],
            system_prompt=SUPERVISOR_SYSTEM_PROMPT,
            response_format=SupervisorOutput
        )
    def run(self, question):
        user_prompt = SUPERVISOR_USER_PROMPT.format(question=question)
        result = self.agent.invoke(
            {
                "messages":[{"role": "user", "content": user_prompt}]
            }
        )
        return result["structured_response"]