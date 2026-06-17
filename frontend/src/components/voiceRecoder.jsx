import { useRef, useState } from "react";

const API_URL = "http://localhost:8000/api/transcribe/";

export default function VoiceRecoder() {
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const streamRef = useRef(null);

	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState("");

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
		} catch (error) {
			console.error("Unable to start recording:", error);
		}
	};

	const stopRecording = () => {
		const mediaRecorder = mediaRecorderRef.current;

		if (!mediaRecorder || mediaRecorder.state === "inactive") {
			return;
		}

		mediaRecorder.onstop = async () => {
			const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			const formData = new FormData();
			formData.append("audio", audioBlob, "recording.webm");

			try {
				const response = await fetch(API_URL, {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				setTranscript(data.text || "");
			} catch (error) {
				console.error("Unable to transcribe audio:", error);
			}

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			audioChunksRef.current = [];
			setIsRecording(false);
		};

		mediaRecorder.stop();
	};

	return (
		<div>
			<button onClick={startRecording} disabled={isRecording}>
				Start Recording
			</button>
			<button onClick={stopRecording} disabled={!isRecording}>
				Stop Recording
			</button>
			{transcript ? <p>{transcript}</p> : null}
		</div>
	);
}
