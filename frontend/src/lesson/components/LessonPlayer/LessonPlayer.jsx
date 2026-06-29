import { useLessonPlayer } from "../../hooks/useLessonPlayer";
import { getVisualizer } from "../../utils/visualizerFactory";
import SpeechBubble from "../Speech/SpeechBubble";
import LessonControls from "./LessonControls";
import LessonHeader from "./LessonHeader";
import "./LessonPlayer.css";

export default function LessonPlayer({ lesson }) {
	const lessonItems = lesson?.lessons || [];
	const {
		currentStep,
		currentStepNumber,
		totalSteps,
		currentItem,
		isFirstStep,
		isLastStep,
		next,
		previous,
	} = useLessonPlayer(lessonItems);

	const renderStep = () => {
		if (!currentItem) {
			return (
				<div className="lesson-empty">
					<p>No lesson loaded yet.</p>
				</div>
			);
		}

		if (currentItem.type === "speech") {
			return <SpeechBubble>{currentItem.speech}</SpeechBubble>;
		}

		if (currentItem.type === "visual") {
			const Visualizer = getVisualizer(currentItem.visualizer_type);
			const visualSteps = lessonItems
				.slice(0, currentStep + 1)
				.filter(
					(item) =>
						item.type === "visual" &&
						item.visualizer_type === currentItem.visualizer_type,
				);
			return (
				<Visualizer
					visualizer={currentItem.visualizer_type}
					action={currentItem.action}
					payload={currentItem.payload}
					steps={visualSteps}
				/>
			);
		}

		if (currentItem.type === "question") {
			return (
				<div className="question-card">
					<p className="lesson-label">Question</p>
					<h3>{currentItem.speech}</h3>
				</div>
			);
		}

		if (currentItem.type === "wait") {
			return <div className="wait-card">Waiting for learner...</div>;
		}

		return <div className="wait-card">Unsupported lesson step.</div>;
	};

	return (
		<section className="lesson-player">
			<LessonHeader
				concept={lesson?.concept}
				currentStepNumber={currentStepNumber}
				totalSteps={totalSteps}
			/>
			<div className="lesson-stage">{renderStep()}</div>
			<LessonControls
				onPrevious={previous}
				onNext={next}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
			/>
		</section>
	);
}
