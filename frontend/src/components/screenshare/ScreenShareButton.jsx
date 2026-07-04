import { useEffect, useState } from "react";
import { screenShareService } from "../../services/screenShareService";

export default function ScreenShareButton() {
	const [stream, setStream] = useState(() => screenShareService.getStream());
	const isSharing = Boolean(stream);

	const handleShareScreen = async () => {
		try {
			const mediaStream = await screenShareService.start();
			setStream(mediaStream);
		} catch (error) {
			console.error("Screen sharing failed:", error);
		}
	};

	useEffect(() => {
		if (!stream) {
			return undefined;
		}

		const handleEnded = () => {
			screenShareService.stop();
			setStream(null);
		};

		stream.getVideoTracks().forEach((track) => {
			track.addEventListener("ended", handleEnded);
		});

		return () => {
			stream.getVideoTracks().forEach((track) => {
				track.removeEventListener("ended", handleEnded);
			});
		};
	}, [stream]);

	return (
		<div className="screen-share-control">
			<style>{`
				.screen-share-control {
					position: absolute;
					left: 30px;
					top: 30px;
					z-index: 10;
					display: flex;
					align-items: center;
					gap: 12px;
				}

				.screen-share-btn {
					height: 38px;
					padding: 0 16px;
					border-radius: 8px;
					border: 1px solid rgba(56, 189, 248, 0.3);
					background: rgba(5, 20, 50, 0.6);
					color: rgba(255, 255, 255, 0.88);
					font-size: 13px;
					font-weight: 500;
					backdrop-filter: blur(10px);
					box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
				}

				.screen-share-btn:hover {
					border-color: rgba(56, 189, 248, 0.75);
					color: #ffffff;
					box-shadow: 0 0 18px rgba(56, 189, 248, 0.18);
				}

				.screen-share-status {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					color: rgba(255, 255, 255, 0.74);
					font-size: 12px;
					letter-spacing: 0.4px;
				}

				.screen-share-dot {
					color: ${isSharing ? "#00ffaa" : "rgba(255, 255, 255, 0.42)"};
					text-shadow: ${isSharing ? "0 0 8px rgba(0, 255, 170, 0.8)" : "none"};
				}
			`}</style>

			<button className="screen-share-btn" type="button" onClick={handleShareScreen}>
				Share Screen
			</button>
			<span className="screen-share-status">
				<span className="screen-share-dot">●</span>
				{isSharing ? "Screen Sharing" : "Not Sharing"}
			</span>
		</div>
	);
}
