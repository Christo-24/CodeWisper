from ...llms.factory import LLMFactory

from .prompts import CODE_ANALYZER_PROMPT
from .schemas import CodeAnalyzerOutput

from langchain_core.prompts import ChatPromptTemplate

class CodeAnalyzerAgent:
    def __init__(self):
        self.llm = LLMFactory.get_code_analyzer_llm()
        self.prompt = ChatPromptTemplate.from_template(CODE_ANALYZER_PROMPT)

    def run(self,problem_name,code):
        chain=(self.prompt | self.llm.with_structured_output(CodeAnalyzerOutput))

        return chain.invoke({
            "problem_name": problem_name,
            "code": code
        })