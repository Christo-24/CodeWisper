export default function VoiceButton({ isRecording = false, isWakeListening = false }) {
  const currentState = isRecording ? 'listening' : 'idle';

  const getStatusText = () => {
    switch (currentState) {
      case 'listening':
        return "Listening to your question...";
      case 'idle':
      default:
        return isWakeListening ? "Say whisper to begin" : "Wake listener starting...";
    }
  };

  return (
    <div className="voice-button-wrapper">
      <style>{`
        .voice-button-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 40px;
          z-index: 5;
          position: relative;
        }

        /* Status instruction text above the button */
        .voice-status-text {
          font-size: 13.5px;
          color: rgba(56, 189, 248, 0.7);
          letter-spacing: 1px;
          margin-bottom: 25px;
          text-align: center;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
          transition: all 0.3s ease;
        }

        .voice-status-text.listening {
          color: #38bdf8;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
        }

        .voice-status-text.thinking {
          color: #00ffff;
          text-shadow: 0 0 12px rgba(0, 255, 255, 0.6);
        }

        .voice-status-text.speaking {
          color: #00ffaa;
          text-shadow: 0 0 12px rgba(0, 255, 170, 0.6);
        }

        /* Tiny mini-waves on either side of the status text */
        .status-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 12px;
        }

        .status-wave-bar {
          width: 2px;
          height: 3px;
          background-color: currentColor;
          border-radius: 1px;
        }

        .active-anim .status-wave-bar {
          animation: status-bar-bounce 1s ease-in-out infinite alternate;
        }

        .active-anim .status-wave-bar:nth-child(1) { height: 4px; animation-delay: 0.1s; }
        .active-anim .status-wave-bar:nth-child(2) { height: 10px; animation-delay: 0.3s; }
        .active-anim .status-wave-bar:nth-child(3) { height: 6px; animation-delay: 0.2s; }

        @keyframes status-bar-bounce {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.4); }
        }
      `}</style>

      {/* Dynamic Status Text */}
      <div className={`voice-status-text ${currentState} ${currentState !== 'idle' ? 'active-anim' : ''}`}>
        <div className="status-wave">
          <div className="status-wave-bar" />
          <div className="status-wave-bar" />
          <div className="status-wave-bar" />
        </div>
        <span>{getStatusText()}</span>
        <div className="status-wave">
          <div className="status-wave-bar" />
          <div className="status-wave-bar" />
          <div className="status-wave-bar" />
        </div>
      </div>
    </div>
  );
}
