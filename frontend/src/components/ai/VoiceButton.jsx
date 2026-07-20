export default function VoiceButton({
  isRecording = false,
  isWakeListening = false,
  onTalk,
}) {
  const currentState = isRecording ? 'listening' : 'idle';
  const canTalk = typeof onTalk === "function" && !isRecording;

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

        .talk-button {
          min-width: 112px;
          height: 42px;
          padding: 0 18px;
          border-radius: 8px;
          border: 1px solid rgba(56, 189, 248, 0.36);
          background: rgba(4, 20, 44, 0.62);
          color: rgba(238, 251, 255, 0.92);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.16);
        }

        .talk-button:hover:not(:disabled) {
          border-color: rgba(56, 189, 248, 0.7);
          box-shadow: 0 0 26px rgba(56, 189, 248, 0.3);
          transform: translateY(-1px);
        }

        .talk-button:disabled {
          cursor: default;
          opacity: 0.56;
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

      <button
        type="button"
        className="talk-button"
        onClick={onTalk}
        disabled={!canTalk}
        title="Start talking"
      >
        {isRecording ? "Listening" : "Talk"}
      </button>
    </div>
  );
}
