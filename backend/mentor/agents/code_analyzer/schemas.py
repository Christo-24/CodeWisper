from pydantic import BaseModel
from typing import List

class CodeAnalyzerOutput(BaseModel):
    language: str
    approach: str
    time_complexity: str
    space_complexity: str
    mistakes: List[str]
    strengths: List[str]
    summary: str