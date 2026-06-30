const defaultSpeechConfig = {
	rate: 1,
	pitch: 1,
	volume: 1,
	preferredVoice: "",
};

class BrowserSpeechService {
	constructor(config = {}) {
		this.config = {
			...defaultSpeechConfig,
			...config,
		};
		this.currentUtterance = null;
		this.currentResolve = null;
	}

	getSynthesis() {
		if (typeof window === "undefined") {
			return null;
		}

		return window.speechSynthesis || null;
	}

	getUtteranceConstructor() {
		if (typeof window === "undefined") {
			return null;
		}

		return window.SpeechSynthesisUtterance || null;
	}

	getVoice() {
		const synthesis = this.getSynthesis();

		if (!synthesis) {
			return null;
		}

		const voices = synthesis.getVoices();

		if (!voices.length) {
			return null;
		}

		if (this.config.preferredVoice) {
			const preferredVoice = voices.find((voice) =>
				voice.name
					.toLowerCase()
					.includes(this.config.preferredVoice.toLowerCase()),
			);

			if (preferredVoice) {
				return preferredVoice;
			}
		}

		return (
			voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
			voices[0]
		);
	}

	speak(text) {
		const synthesis = this.getSynthesis();
		const SpeechSynthesisUtterance = this.getUtteranceConstructor();
		const spokenText = String(text || "").trim();

		this.stop();

		if (!synthesis || !SpeechSynthesisUtterance || !spokenText) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			const utterance = new SpeechSynthesisUtterance(spokenText);
			const voice = this.getVoice();

			utterance.rate = this.config.rate;
			utterance.pitch = this.config.pitch;
			utterance.volume = this.config.volume;

			if (voice) {
				utterance.voice = voice;
			}

			const finish = () => {
				if (this.currentUtterance === utterance) {
					this.currentUtterance = null;
					this.currentResolve = null;
				}

				resolve();
			};

			utterance.onend = finish;
			utterance.onerror = finish;
			this.currentUtterance = utterance;
			this.currentResolve = finish;
			synthesis.speak(utterance);
		});
	}

	stop() {
		const finishCurrent = this.currentResolve;
		const synthesis = this.getSynthesis();

		if (synthesis) {
			synthesis.cancel();
		}

		this.currentUtterance = null;
		this.currentResolve = null;

		if (finishCurrent) {
			finishCurrent();
		}
	}

	pause() {
		this.getSynthesis()?.pause();
	}

	resume() {
		this.getSynthesis()?.resume();
	}

	isSpeaking() {
		return Boolean(this.getSynthesis()?.speaking);
	}
}

export const speechService = new BrowserSpeechService();
export { BrowserSpeechService, defaultSpeechConfig };
