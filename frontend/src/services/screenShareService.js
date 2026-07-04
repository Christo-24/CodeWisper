class ScreenShareService {
	constructor() {
		this.stream = null;
	}

	async start() {
		if (!navigator.mediaDevices?.getDisplayMedia) {
			throw new Error("Screen sharing is not supported in this browser.");
		}

		this.stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: false,
		});

		return this.stream;
	}

	stop() {
		if (!this.stream) {
			return;
		}

		this.stream.getTracks().forEach((track) => track.stop());
		this.stream = null;
	}

	getStream() {
		return this.stream;
	}

	async captureFrame() {
		if (!this.stream) {
			return null;
		}

		const video = document.createElement("video");
		video.muted = true;
		video.playsInline = true;

		await new Promise((resolve) => {
			video.onloadedmetadata = resolve;
			video.srcObject = this.stream;
		});

		await video.play();

		if (!video.videoWidth || !video.videoHeight) {
			video.srcObject = null;
			return null;
		}

		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext("2d");
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		video.srcObject = null;

		return canvas.toDataURL("image/png");
	}
}

export const screenShareService = new ScreenShareService();
export { ScreenShareService };
