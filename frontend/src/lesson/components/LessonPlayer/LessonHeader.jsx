export default function LessonHeader({ concept, currentStepNumber, totalSteps }) {
	const progress = totalSteps ? (currentStepNumber / totalSteps) * 100 : 0;

	return (
		<header className="lesson-header">
			<div>
				<p className="lesson-label">Lesson</p>
				<h2>{concept || "Teaching Lesson"}</h2>
			</div>
			<div className="lesson-step">
				<span>
					Step {currentStepNumber} of {totalSteps}
				</span>
				<div className="lesson-progress">
					<div style={{ width: `${progress}%` }} />
				</div>
			</div>
		</header>
	);
}
