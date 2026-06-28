from langchain.agents import create_agent

from ...llms.factory import LLMFactory
from .prompts import LEETCODE_ROUTER_SYSTEM_PROMPT, LEETCODE_ROUTER_USER_PROMPT
from .schemas import LeetcodeRouterOutput


class LeetcodeRouterAgent:
    def __init__(self):
        self.llm = LLMFactory.get_leetcode_router_llm()
        self.agent = create_agent(
            model=self.llm,
            tools=[],
            system_prompt=LEETCODE_ROUTER_SYSTEM_PROMPT,
            response_format=LeetcodeRouterOutput,
        )

    def run(self, question, problem_name):
        user_prompt = LEETCODE_ROUTER_USER_PROMPT.format(
            question=question,
            problem_name=problem_name,
        )
        result = self.agent.invoke(
            {
                "messages": [{"role": "user", "content": user_prompt}]
            }
        )
        return result["structured_response"]
