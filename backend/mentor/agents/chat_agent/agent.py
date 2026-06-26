from ...llms.factory import LLMFactory
from ...tools.memory_tool import get_recent_conversation

from .prompts import CHAT_SYSTEM_PROMPT, CHAT_USER_PROMPT
from .schemas import ChatOutput

from langchain.agents import create_agent

class ChatAgent:
    def __init__(self):
        self.llm = LLMFactory.get_supervisor_llm()
        self.agent = create_agent(
            model=self.llm,
            tools=[get_recent_conversation],
            system_prompt=CHAT_SYSTEM_PROMPT,
            response_format=ChatOutput
        )
    def run(self, question):
        user_prompt = CHAT_USER_PROMPT.format(question=question)
        result = self.agent.invoke(
            {
                "messages":[{"role": "user", "content": user_prompt}]
            }
        )
        return result["structured_response"]