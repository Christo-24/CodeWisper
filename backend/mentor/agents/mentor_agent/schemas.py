from pydantic import BaseModel


class MentorOutput(BaseModel):
    answer: str