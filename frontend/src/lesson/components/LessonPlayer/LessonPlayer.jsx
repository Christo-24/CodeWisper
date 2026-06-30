import { useEffect, useMemo, useState } from "react";
import { useLessonPlayer } from "../../hooks/useLessonPlayer";
import { speechService } from "../../services/speechService";
import { getVisualizer } from "../../utils/visualizerFactory";
import LessonControls from "./LessonControls";
import LessonHeader from "./LessonHeader";
import "./LessonPlayer.css";

const TEACHING_ANIMATION_DURATION_MS = 650;

export default function LessonPlayer({ lesson }) {
	const lessonSteps = useMemo(() => lesson?.lessons || [], [lesson]);
	const {
		currentStep,
		currentStepNumber,
		totalSteps,
		currentItem: currentStepData,
		isFirstStep,
		isLastStep,
		next,
		previous,
	} = useLessonPlayer(lessonSteps);
	const [completedMoment, setCompletedMoment] = useState(null);
	const isMomentComplete = completedMoment === currentStepData;

	useEffect(() => {
		let isCurrentMoment = true;
		const narration = currentStepData?.speech;

		if (!narration) {
			speechService.stop();

			return () => {};
		}

		setCompletedMoment(null);

		const speechDone = speechService.speak(narration);
		let animationTimeout;
		const animationDone = new Promise((resolve) => {
			animationTimeout = window.setTimeout(
				resolve,
				TEACHING_ANIMATION_DURATION_MS,
			);
		});

		Promise.all([speechDone, animationDone]).then(() => {
			if (isCurrentMoment) {
				setCompletedMoment(currentStepData);
			}
		});

		return () => {
			isCurrentMoment = false;
			window.clearTimeout(animationTimeout);
			speechService.stop();
		};
	}, [currentStepData, currentStep]);

	useEffect(() => {
		return () => {
			speechService.stop();
		};
	}, []);

	const handleNext = () => {
		if (!isMomentComplete) {
			return;
		}

		speechService.stop();
		next();
	};

	const handlePrevious = () => {
		speechService.stop();
		previous();
	};

	const handleReplay = () => {
		if (currentStepData?.speech) {
			setCompletedMoment(null);
			const speechDone = speechService.speak(currentStepData.speech);
			const animationDone = new Promise((resolve) => {
				window.setTimeout(resolve, TEACHING_ANIMATION_DURATION_MS);
			});

			Promise.all([speechDone, animationDone]).then(() => {
				setCompletedMoment(currentStepData);
			});
		}
	};

	const renderVisualStep = (stepData, stepIndex) => {
		const Visualizer = getVisualizer(stepData.visualizer_type);
		const visualSteps = lessonSteps
			.slice(0, stepIndex + 1)
			.filter(
				(item) => item.visualizer_type === stepData.visualizer_type,
			);

		return (
			<Visualizer
				visualizer={stepData.visualizer_type}
				action={stepData.action}
				payload={stepData.payload}
				steps={visualSteps}
			/>
		);
	};

	const renderStep = () => {
		if (!currentStepData) {
			return (
				<div className="lesson-empty">
					<p>No lesson loaded yet.</p>
				</div>
			);
		}

		return renderVisualStep(currentStepData, currentStep);
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
				onPrevious={handlePrevious}
				onNext={handleNext}
				onReplay={handleReplay}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep || !isMomentComplete}
				canReplay={Boolean(currentStepData?.speech)}
			/>
		</section>
	);
}
