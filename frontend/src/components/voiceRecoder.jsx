import { useCallback, useEffect, useRef } from "react";
import { uploadFrame } from "../services/api";
import { screenShareService } from "../services/screenShareService";

const API_URL = "http://localhost:8000/api/transcribe/";
const WAKE_WORDS = ["wispher", "whisper"];
const RECORDING_DURATION_MS = 7000;

function VoiceRecoder({
	onLessonReceived,
	onAnswerReceived,
	onTranscriptReceived,
	onRecordingChange,
	onWakeListeningChange,
}) {
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const streamRef = useRef(null);
	const recognitionRef = useRef(null);
	const recordingTimerRef = useRef(null);
	const wakeRestartTimerRef = useRef(null);
	const isRecordingRef = useRef(false);
	const shouldListenForWakeRef = useRef(true);

	const startWakeListening = useCallback(() => {
		const recognition = recognitionRef.current;
		if (!recognition || !shouldListenForWakeRef.current || isRecordingRef.current) {
			return;
		}

		try {
			recognition.start();
			onWakeListeningChange?.(true);
		} catch (error) {
			if (error.name === "InvalidStateError") {
				onWakeListeningChange?.(true);
			} else {
				console.error("Unable to start wake word listener:", error);
				onWakeListeningChange?.(false);
			}
		}
	}, [onWakeListeningChange]);

	const stopRecording = useCallback(() => {
		const mediaRecorder = mediaRecorderRef.current;

		if (!mediaRecorder || mediaRecorder.state === "inactive") {
			return;
		}

		window.clearTimeout(recordingTimerRef.current);
		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			const formData = new FormData();
			formData.append("audio", audioBlob, "recording.webm");
			let questionText = "";

			try {
				const response = await fetch(API_URL, {
					method: "POST",
					body: formData,
				});
				if (!response.ok) {
					throw new Error("Transcription request failed");
				}
				const data = await response.json();
				questionText = data.text || "";
				onTranscriptReceived?.(questionText);
			} catch (error) {
				console.error("Unable to transcribe audio:", error);
			}

			{/* mentor response*/}
			if (questionText) {
				try {
					try {
						const screenFrame = await screenShareService.captureFrame();
						if (screenFrame) {
							await uploadFrame(screenFrame);
						}
					} catch (error) {
						console.error("Unable to update screen capture before mentor request:", error);
					}

					const mentorResponse = await fetch("http://localhost:8000/api/mentor/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							question: questionText,
						}),
					});

					if (!mentorResponse.ok) {
						throw new Error("Mentor request failed");
					}

					const mentorData = await mentorResponse.json();
					if (mentorData.type === "lessons" || mentorData.type === "lesson") {
						onLessonReceived?.(mentorData.data);
					}
					const answerText = mentorData.type === "answer" ? mentorData.data || "" : "";
					onAnswerReceived?.(answerText);
					if (answerText) {
						const utterance = new SpeechSynthesisUtterance(answerText);
						utterance.lang = "en-US";
						utterance.rate = 1;
						utterance.pitch = 1;
						utterance.volume = 1;
						window.speechSynthesis.speak(utterance);
					}
				} catch (error) {
					console.error("Unable to get mentor answer:", error);
				}
			}


			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			audioChunksRef.current = [];
			isRecordingRef.current = false;
			onRecordingChange?.(false);
			startWakeListening();
		};

		mediaRecorder.stop();
	}, [onLessonReceived, onAnswerReceived, onTranscriptReceived, onRecordingChange, startWakeListening]);

	const startRecording = useCallback(async () => {
		if (isRecordingRef.current) {
			return;
		}

		try {
			isRecordingRef.current = true;
			recognitionRef.current?.stop();
			onWakeListeningChange?.(false);

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			audioChunksRef.current = [];

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.start();
			onRecordingChange?.(true);
			recordingTimerRef.current = window.setTimeout(stopRecording, RECORDING_DURATION_MS);
		} catch (error) {
			console.error("Unable to start recording:", error);
			isRecordingRef.current = false;
			onRecordingChange?.(false);
			startWakeListening();
		}
	}, [onRecordingChange, onWakeListeningChange, startWakeListening, stopRecording]);

	useEffect(() => {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) {
			console.error("Wake word activation is not supported in this browser.");
			onWakeListeningChange?.(false);
			return undefined;
		}

		shouldListenForWakeRef.current = true;
		const recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onresult = (event) => {
			const latestResult = event.results[event.results.length - 1];
			const spokenText = latestResult?.[0]?.transcript?.toLowerCase() || "";
			if (WAKE_WORDS.some((word) => spokenText.includes(word))) {
				startRecording();
			}
		};

		recognition.onend = () => {
			onWakeListeningChange?.(false);
			if (shouldListenForWakeRef.current && !isRecordingRef.current) {
				wakeRestartTimerRef.current = window.setTimeout(startWakeListening, 300);
			}
		};

		recognition.onerror = (event) => {
			if (event.error === "not-allowed" || event.error === "service-not-allowed") {
				shouldListenForWakeRef.current = false;
				onWakeListeningChange?.(false);
				return;
			}

			if (event.error !== "no-speech") {
				console.error("Wake word listener error:", event.error);
			}
		};

		recognitionRef.current = recognition;
		startWakeListening();

		return () => {
			shouldListenForWakeRef.current = false;
			window.clearTimeout(recordingTimerRef.current);
			window.clearTimeout(wakeRestartTimerRef.current);
			try {
				recognition.stop();
			} catch (error) {
				if (error.name !== "InvalidStateError") {
					console.error("Unable to stop wake word listener:", error);
				}
			}
			if (mediaRecorderRef.current?.state === "recording") {
				mediaRecorderRef.current.stop();
			}
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, [onWakeListeningChange, startRecording, startWakeListening]);

	return null;
}

export default VoiceRecoder;
