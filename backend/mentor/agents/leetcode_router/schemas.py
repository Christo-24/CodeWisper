from typing import Literal

from pydantic import BaseModel


class LeetcodeRouterOutput(BaseModel):
    route: Literal["code_analyser", "teaching"]
