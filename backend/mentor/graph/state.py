from typing import TypedDict

class CodeWispherState(TypedDict):
    ocr_text: str
    problem_name: str
    code: str
    question: str
    answer: str
