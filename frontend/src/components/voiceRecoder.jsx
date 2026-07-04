import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { uploadFrame } from "../services/api";
import { screenShareService } from "../services/screenShareService";

const API_URL = "http://localhost:8000/api/transcribe/";

const VoiceRecoder = forwardRef(function VoiceRecoder(
	{ onLessonReceived, onAnswerReceived, onTranscriptReceived, onRecordingChange },
	ref,
) {
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const streamRef = useRef(null);

	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState("");
	const[answer,setAnswer] = useState("");

	const startRecording = async () => {
		try {
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
			setIsRecording(true);
			onRecordingChange?.(true);
		} catch (error) {
			console.error("Unable to start recording:", error);
		}
	};
	{/* stop capturing and transcribing audio */}
	const stopRecording = () => {
		const mediaRecorder = mediaRecorderRef.current;

		if (!mediaRecorder || mediaRecorder.state === "inactive") {
			return;
		}

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
				setTranscript(questionText);
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
						onLessonReceived(mentorData.data);
					}
					const answerText = mentorData.type === "answer" ? mentorData.data || "" : "";
					setAnswer(answerText);
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
			setIsRecording(false);
			onRecordingChange?.(false);
		};

		mediaRecorder.stop();
	};

	useImperativeHandle(ref, () => ({
		startRecording,
		stopRecording,
		toggleRecording: () => {
			if (isRecording) {
				stopRecording();
			} else {
				startRecording();
			}
		},
		isRecording,
	}));

	return (
		<div>
			<button onClick={startRecording} disabled={isRecording}>
				Start Recording
			</button>
			<button onClick={stopRecording} disabled={!isRecording}>
				Stop Recording
			</button>
			{transcript ? <p>{transcript}</p> : null}
			<h3>Mentor's Answer:</h3>
			<p>{answer}</p>
		</div>
	);
});

export default VoiceRecoder;
