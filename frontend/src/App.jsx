import { useRef, useState } from "react";
import VoiceRecoder from "./components/voiceRecoder";

import SmokeBackground from "./components/ai/SmokeBackground";
import ParticleField from "./components/ai/ParticleField";
import Orb from "./components/ai/Orb";
import VoiceButton from "./components/ai/VoiceButton";
import TopControls from "./components/ai/TopControls";
import LessonPopup from "./components/lessons/LessonPopup";
import ScreenShareButton from "./components/screenshare/ScreenShareButton";

function App() {
  const voiceRecorderRef = useRef(null);
  const [lessonData, setLessonData] = useState(null);
  const [showLesson, setShowLesson] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mentorAnswer, setMentorAnswer] = useState("");

  const handleToggleRecording = () => {
    voiceRecorderRef.current?.toggleRecording();
  };

  const handleLessonReceived = (lesson) => {
    setLessonData(lesson);
    setShowLesson(true);
    setMentorAnswer("");
  };

  return (
    <div className="App">
      {/* Dynamic atmospheric backgrounds */}
      <SmokeBackground />
      <ParticleField />

      {/* Top right control buttons */}
      <TopControls />
      <ScreenShareButton />

      {/* Main Jarvis HUD layer */}
      <div className="jarvis-hud-container">
        <style>{`
          .jarvis-hud-container {
            position: relative;
            z-index: 5;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          /* Wrapper to position the orb and voice buttons relative to each other */
          .hud-core-layout {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transform: translateY(-20px); /* slightly raise for visual balance */
          }

          /* Glowing notification when popup is closed */
          .reopen-hint-toast {
            position: absolute;
            bottom: 30px;
            left: 30px;
            background: rgba(5, 20, 50, 0.6);
            border: 1px solid rgba(0, 170, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 11.5px;
            color: rgba(56, 189, 248, 0.85);
            letter-spacing: 0.5px;
            backdrop-filter: blur(8px);
            pointer-events: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: slow-pulse 3s infinite ease-in-out;
          }

          .mentor-response-panel {
            position: absolute;
            right: 30px;
            bottom: 30px;
            width: min(420px, calc(100vw - 60px));
            max-height: 220px;
            overflow: auto;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid rgba(56, 189, 248, 0.22);
            background: rgba(4, 12, 32, 0.62);
            color: rgba(255, 255, 255, 0.86);
            backdrop-filter: blur(12px);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          }

          .mentor-response-label {
            margin-bottom: 8px;
            color: rgba(56, 189, 248, 0.78);
            font-size: 12px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
          }

          .mentor-response-text,
          .transcript-text {
            font-size: 14px;
            line-height: 1.5;
          }

          .transcript-text {
            margin-top: 10px;
            color: rgba(255, 255, 255, 0.58);
          }
        `}</style>

        <div className="hud-core-layout">
          {/* Main AI Orb triggers the same recording implementation as the microphone. */}
          <div
            onClick={handleToggleRecording}
            style={{ cursor: 'pointer' }}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <Orb />
          </div>

          {/* Glowing Voice status & input button */}
          <VoiceButton
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
          />
        </div>

        {/* Floating Lesson Popup */}
        {showLesson && lessonData && (
          <LessonPopup 
            title={lessonData?.concept || "Teaching Lesson"}
            lesson={lessonData}
            onClose={() => setShowLesson(false)}
          />
        )}

        {(mentorAnswer || transcript) && !showLesson && (
          <div className="mentor-response-panel">
            {mentorAnswer && (
              <>
                <div className="mentor-response-label">Mentor</div>
                <p className="mentor-response-text">{mentorAnswer}</p>
              </>
            )}
            {transcript && <p className="transcript-text">You said: {transcript}</p>}
          </div>
        )}
      </div>

      {/* Mount existing recording logic in the background and control it from the new UI. */}
      <div style={{ display: 'none' }}>
        <VoiceRecoder
          ref={voiceRecorderRef}
          onLessonReceived={handleLessonReceived}
          onAnswerReceived={setMentorAnswer}
          onTranscriptReceived={setTranscript}
          onRecordingChange={setIsRecording}
        />
      </div>
    </div>
  );
}

export default App;


