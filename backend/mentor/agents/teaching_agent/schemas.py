from typing import Any

from pydantic import BaseModel, Field

from mentor.agents.teaching_agent.enums import VisualizerAction, VisualizerType


class LessonStep(BaseModel):
    """One synchronized teaching moment: narration + visualization."""

    speech: str = Field(
        description="Short narration explaining WHY this visual action matters.",
        min_length=1,
    )
    visualizer_type: VisualizerType
    action: VisualizerAction
    payload: dict[str, Any] = Field(
        description="Valid JSON object payload for the visualizer action.",
    )


class TeachingOutput(BaseModel):
    concept: str = Field(
        description="Primary concept being taught, e.g. 'Hash Map' or 'Two Pointers'.",
        min_length=1,
    )
    lessons: list[LessonStep] = Field(
        description="Ordered synchronized teaching moments.",
        min_length=1,
    )
