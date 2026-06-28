from mentor.agents.teaching_agent.schemas import TeachingOutput
from mentor.agents.code_analyzer.schemas import CodeAnalyzerOutput
from typing import TypedDict

class CodeWispherState(TypedDict):
    question: str
    route: str
    ocr_text: str
    problem_name: str
    code: str
    analyze: CodeAnalyzerOutput 
    answer: str
    lessons: TeachingOutput
