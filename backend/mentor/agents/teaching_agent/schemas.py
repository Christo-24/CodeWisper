from typing import Any

from pydantic import BaseModel

from mentor.agents.teaching_agent.enums import LessonStepType, VisualizerAction, VisualizerType

class LessonStep(BaseModel):
    type: LessonStepType
    speech: str | None = None
    visualizer_type: VisualizerType | None = None
    action: VisualizerAction | None = None
    payload: dict[str, Any] | None = None

class TeachingOutput(BaseModel):
    lessons: list[LessonStep]


