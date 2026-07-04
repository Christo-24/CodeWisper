export default function VoiceButton({ isRecording = false, onToggleRecording }) {
  const currentState = isRecording ? 'listening' : 'idle';

  const getStatusText = () => {
    switch (currentState) {
      case 'listening':
        return "Listening... tap again to send";
      case 'idle':
      default:
        return "Tap the mic or orb to begin";
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

        /* Container of the mic button and its ripples */
        .mic-container {
          position: relative;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Base Mic Button */
        .mic-btn {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle, #05143a 0%, #02071a 100%);
          border: 1px solid rgba(56, 189, 248, 0.3);
          box-shadow: 
            0 0 20px rgba(0, 0, 0, 0.5),
            inset 0 0 15px rgba(0, 170, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mic-btn:hover {
          border-color: rgba(56, 189, 248, 0.7);
          box-shadow: 
            0 0 30px rgba(0, 170, 255, 0.3),
            inset 0 0 20px rgba(0, 170, 255, 0.4);
          transform: scale(1.05);
        }

        .mic-icon {
          width: 26px;
          height: 26px;
          fill: rgba(56, 189, 248, 0.85);
          filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.3));
          transition: all 0.3s ease;
        }

        /* ---------------- STATES ANIMATIONS ---------------- */

        /* 1. IDLE STATE: Slow pulse */
        .state-idle .mic-btn {
          animation: mic-idle-pulse 3s infinite ease-in-out;
        }
        
        @keyframes mic-idle-pulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(0, 170, 255, 0.2), inset 0 0 10px rgba(0, 170, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 170, 255, 0.4), inset 0 0 15px rgba(0, 170, 255, 0.3);
          }
        }

        /* 2. LISTENING STATE: Expand & active ripples */
        .state-listening .mic-btn {
          transform: scale(1.15);
          border-color: #38bdf8;
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.6);
        }

        .state-listening .mic-icon {
          fill: #ffffff;
          filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.8));
          transform: scale(1.08);
        }

        /* Listening Ripples */
        .listening-ripple {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          animation: wave-grow 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .listening-ripple-2 {
          animation-delay: 0.7s;
        }

        .listening-ripple-3 {
          animation-delay: 1.4s;
        }

        /* 3. THINKING STATE: Glowing rotating loader */
        .state-thinking .mic-btn {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 25px rgba(0, 255, 255, 0.3);
        }

        .state-thinking .mic-icon {
          fill: #00ffff;
          filter: drop-shadow(0 0 6px rgba(0, 255, 255, 0.6));
        }

        /* Rotating glowing border overlay */
        .thinking-ring {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #00ffff;
          border-right-color: #00aaff;
          animation: spin-clockwise 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
          z-index: 4;
          pointer-events: none;
        }

        /* 4. SPEAKING STATE: Wave visualizer */
        .state-speaking .mic-btn {
          border-color: #00ffaa;
          box-shadow: 0 0 30px rgba(0, 255, 170, 0.5);
        }

        .state-speaking .mic-icon {
          fill: #00ffaa;
          filter: drop-shadow(0 0 8px rgba(0, 255, 170, 0.7));
        }

        /* Speaking Waves on Left & Right */
        .speaking-waves-container {
          position: absolute;
          width: 260px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
          z-index: 1;
        }

        .speaking-wave-side {
          display: flex;
          align-items: center;
          gap: 4px;
          width: 70px;
          height: 100%;
        }

        .wave-side-left {
          justify-content: flex-end;
        }

        .wave-side-right {
          justify-content: flex-start;
        }

        .speaking-wave-bar {
          width: 3px;
          height: 4px;
          background-color: rgba(0, 255, 170, 0.65);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(0, 255, 170, 0.3);
        }

        .state-speaking .speaking-wave-bar {
          animation: speaking-bounce 0.8s ease-in-out infinite alternate;
        }

        /* Random delays and heights for a natural audio wave look */
        .speaking-wave-bar:nth-child(1) { height: 6px; animation-delay: 0.1s; }
        .speaking-wave-bar:nth-child(2) { height: 18px; animation-delay: 0.4s; }
        .speaking-wave-bar:nth-child(3) { height: 28px; animation-delay: 0.2s; }
        .speaking-wave-bar:nth-child(4) { height: 12px; animation-delay: 0.5s; }
        .speaking-wave-bar:nth-child(5) { height: 22px; animation-delay: 0.3s; }

        @keyframes speaking-bounce {
          0% {
            transform: scaleY(0.3);
            background-color: rgba(0, 200, 255, 0.6);
          }
          100% {
            transform: scaleY(1.4);
            background-color: rgba(0, 255, 170, 0.95);
            box-shadow: 0 0 10px rgba(0, 255, 170, 0.6);
          }
        }

        /* Cycle Hint Overlay */
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

      {/* Button & Animation Shell */}
      <div className={`mic-container state-${currentState}`}>
        {/* Speaking visual wave bars on both sides */}
        {currentState === 'speaking' && (
          <div className="speaking-waves-container">
            <div className="speaking-wave-side wave-side-left">
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
            </div>
            <div className="speaking-wave-side wave-side-right">
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
              <div className="speaking-wave-bar" />
            </div>
          </div>
        )}

        {/* Listening expanding rings */}
        {currentState === 'listening' && (
          <>
            <div className="listening-ripple listening-ripple-1" />
            <div className="listening-ripple listening-ripple-2" />
            <div className="listening-ripple listening-ripple-3" />
          </>
        )}

        {/* Thinking rotating line */}
        {currentState === 'thinking' && <div className="thinking-ring" />}

        {/* Central clickable Microphone */}
        <button
          className="mic-btn"
          onClick={onToggleRecording}
          title={isRecording ? "Stop recording" : "Start recording"}
          type="button"
        >
          <svg className="mic-icon" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
