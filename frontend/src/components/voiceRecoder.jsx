import { useCallback, useEffect, useRef } from "react";
import { uploadFrame } from "../services/api";
import { screenShareService } from "../services/screenShareService";

const API_URL = "http://localhost:8000/api/transcribe/";
const WAKE_WORDS = ["wispher", "whisper"];
const SILENCE_TIMEOUT_MS = 3000;
const SILENCE_VOLUME_THRESHOLD = 0.012;

function VoiceRecoder({
	onLessonReceived,
	onAnswerReceived,
	onTranscriptReceived,
	onRecordingChange,
	onWakeListeningChange,
	onTalkReady,
}) {
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const streamRef = useRef(null);
	const recognitionRef = useRef(null);
	const audioContextRef = useRef(null);
	const silenceFrameRef = useRef(null);
	const lastVoiceAtRef = useRef(0);
	const wakeRestartTimerRef = useRef(null);
	const isRecordingRef = useRef(false);
	const isWakeListeningRef = useRef(false);
	const shouldListenForWakeRef = useRef(true);

	const stopSilenceDetection = useCallback(() => {
		if (silenceFrameRef.current) {
			window.cancelAnimationFrame(silenceFrameRef.current);
			silenceFrameRef.current = null;
		}

		if (audioContextRef.current) {
			audioContextRef.current.close().catch(() => {});
			audioContextRef.current = null;
		}
	}, []);

	const startWakeListening = useCallback(() => {
		const recognition = recognitionRef.current;
		if (
			!recognition ||
			!shouldListenForWakeRef.current ||
			isRecordingRef.current ||
			isWakeListeningRef.current
		) {
			return;
		}

		window.clearTimeout(wakeRestartTimerRef.current);
		try {
			recognition.start();
		} catch (error) {
			if (error.name === "InvalidStateError") {
				isWakeListeningRef.current = true;
			} else {
				console.error("Unable to start wake word listener:", error);
				isWakeListeningRef.current = false;
				onWakeListeningChange?.(false);
			}
		}
	}, [onWakeListeningChange]);

	const stopRecording = useCallback(() => {
		const mediaRecorder = mediaRecorderRef.current;

		if (!mediaRecorder || mediaRecorder.state === "inactive") {
			return;
		}

		stopSilenceDetection();
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
	}, [
		onLessonReceived,
		onAnswerReceived,
		onTranscriptReceived,
		onRecordingChange,
		startWakeListening,
		stopSilenceDetection,
	]);

	const startSilenceDetection = useCallback((stream) => {
		stopSilenceDetection();

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) {
			return;
		}

		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		const source = audioContext.createMediaStreamSource(stream);
		const samples = new Uint8Array(analyser.fftSize);

		analyser.fftSize = 2048;
		source.connect(analyser);
		audioContextRef.current = audioContext;
		lastVoiceAtRef.current = Date.now();

		const checkForSilence = () => {
			if (!isRecordingRef.current) {
				return;
			}

			analyser.getByteTimeDomainData(samples);
			let sum = 0;
			for (let index = 0; index < samples.length; index += 1) {
				const level = (samples[index] - 128) / 128;
				sum += level * level;
			}

			const volume = Math.sqrt(sum / samples.length);
			if (volume > SILENCE_VOLUME_THRESHOLD) {
				lastVoiceAtRef.current = Date.now();
			}

			if (Date.now() - lastVoiceAtRef.current >= SILENCE_TIMEOUT_MS) {
				stopRecording();
				return;
			}

			silenceFrameRef.current = window.requestAnimationFrame(checkForSilence);
		};

		silenceFrameRef.current = window.requestAnimationFrame(checkForSilence);
	}, [stopRecording, stopSilenceDetection]);

	const startRecording = useCallback(async () => {
		if (isRecordingRef.current) {
			return;
		}

		try {
			isRecordingRef.current = true;
			window.clearTimeout(wakeRestartTimerRef.current);
			try {
				recognitionRef.current?.abort();
			} catch (error) {
				if (error.name !== "InvalidStateError") {
					console.error("Unable to pause wake word listener:", error);
				}
			}
			isWakeListeningRef.current = false;
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
			startSilenceDetection(stream);
		} catch (error) {
			console.error("Unable to start recording:", error);
			stopSilenceDetection();
			isRecordingRef.current = false;
			onRecordingChange?.(false);
			startWakeListening();
		}
	}, [
		onRecordingChange,
		onWakeListeningChange,
		startSilenceDetection,
		startWakeListening,
		stopSilenceDetection,
	]);

	useEffect(() => {
		onTalkReady?.(startRecording);
		return () => onTalkReady?.(null);
	}, [onTalkReady, startRecording]);

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

		recognition.onstart = () => {
			isWakeListeningRef.current = true;
			onWakeListeningChange?.(true);
		};

		recognition.onresult = (event) => {
			const latestResult = event.results[event.results.length - 1];
			const spokenText = latestResult?.[0]?.transcript?.toLowerCase() || "";
			if (WAKE_WORDS.some((word) => spokenText.includes(word))) {
				startRecording();
			}
		};

		recognition.onend = () => {
			isWakeListeningRef.current = false;
			onWakeListeningChange?.(false);
			if (shouldListenForWakeRef.current && !isRecordingRef.current) {
				wakeRestartTimerRef.current = window.setTimeout(startWakeListening, 300);
			}
		};

		recognition.onerror = (event) => {
			if (event.error === "not-allowed" || event.error === "service-not-allowed") {
				shouldListenForWakeRef.current = false;
				isWakeListeningRef.current = false;
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
			stopSilenceDetection();
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
