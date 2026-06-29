export default function LessonControls({
	onPrevious,
	onNext,
	isFirstStep,
	isLastStep,
}) {
	return (
		<div className="lesson-controls">
			<button type="button" onClick={onPrevious} disabled={isFirstStep}>
				Previous
			</button>
			<button type="button" onClick={onNext} disabled={isLastStep}>
				Next
			</button>
		</div>
	);
}
