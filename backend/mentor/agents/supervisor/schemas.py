from pydantic import BaseModel

from typing import Literal

class SupervisorOutput(BaseModel):
    route: Literal["leetcode", "general_chat"]
