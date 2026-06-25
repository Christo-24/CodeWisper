from mentor.agents.code_analyzer.schemas import CodeAnalyzerOutput
from typing import TypedDict

class CodeWispherState(TypedDict):
    ocr_text: str
    problem_name: str
    code: str
    analyze: CodeAnalyzerOutput
    question: str
    answer: str
