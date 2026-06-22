from .prompts import EXTRACT_PROBLEM_PROMPT
from .schemas import ProblemExtractorOutput

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama


class ProblemExtractorAgent:
    def __init__(self):
        self.llm = ChatOllama(model="mistral")
        self.prompt = ChatPromptTemplate.from_template(EXTRACT_PROBLEM_PROMPT)

    def run(self, ocr_text):
        chain=self.prompt|self.llm.with_structured_output(ProblemExtractorOutput)
        return chain.invoke({"ocr_text":ocr_text})
