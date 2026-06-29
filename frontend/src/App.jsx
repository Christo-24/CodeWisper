import { useState } from "react";
import ScreenCapture from "./components/ScreenCapture";
import VoiceRecoder from "./components/voiceRecoder";


function App() {
  const [lessonData, setLessonData] = useState(null);

  return (
    <div className="App">
      <ScreenCapture lesson={lessonData} />
      <VoiceRecoder onLessonReceived={setLessonData} />
    </div>
  );
}
export default App;
