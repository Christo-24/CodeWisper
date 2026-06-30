export default function LessonControls({
	onPrevious,
	onNext,
	onReplay,
	isFirstStep,
	isLastStep,
	canReplay = false,
}) {
	return (
		<div className="lesson-controls">
			<button type="button" onClick={onPrevious} disabled={isFirstStep}>
				Previous
			</button>
			<button type="button" onClick={onReplay} disabled={!canReplay}>
				Replay
			</button>
			<button type="button" onClick={onNext} disabled={isLastStep}>
				Next
			</button>
		</div>
	);
}
