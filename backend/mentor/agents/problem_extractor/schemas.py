from pydantic import BaseModel


class ProblemExtractorOutput(BaseModel):
    problem_name: str