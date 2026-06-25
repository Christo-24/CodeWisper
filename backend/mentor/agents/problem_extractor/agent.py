from ...llms.factory import LLMFactory

from .prompts import EXTRACT_PROBLEM_PROMPT
from .schemas import ProblemExtractorOutput

from langchain_core.prompts import ChatPromptTemplate



class ProblemExtractorAgent:
    def __init__(self):
        self.llm = LLMFactory.get_problem_extractor_llm()
        self.prompt = ChatPromptTemplate.from_template(EXTRACT_PROBLEM_PROMPT)

    def run(self, ocr_text):
        chain=self.prompt|self.llm.with_structured_output(ProblemExtractorOutput)
        return chain.invoke({"ocr_text":ocr_text})
