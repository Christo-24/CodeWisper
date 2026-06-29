import { useMemo, useState } from "react";

export function useLessonPlayer(lessonItems = []) {
	const [currentStep, setCurrentStep] = useState(0);
	const totalSteps = lessonItems.length;
	const isFirstStep = currentStep === 0;
	const isLastStep = totalSteps === 0 || currentStep === totalSteps - 1;

	const currentItem = useMemo(() => {
		return lessonItems[currentStep] || null;
	}, [lessonItems, currentStep]);

	const next = () => {
		setCurrentStep((step) => Math.min(step + 1, Math.max(totalSteps - 1, 0)));
	};

	const previous = () => {
		setCurrentStep((step) => Math.max(step - 1, 0));
	};

	return {
		currentStep,
		currentStepNumber: totalSteps ? currentStep + 1 : 0,
		totalSteps,
		currentItem,
		isFirstStep,
		isLastStep,
		next,
		previous,
	};
}
