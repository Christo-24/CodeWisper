from faster_whisper import WhisperModel

model = WhisperModel(
    "base",device="cpu",compute_type="int8"
)

def transcribe_audio(audio_path):
    segments,_= model.transcribe(audio_path)
    test=""
    for segment in segments:
        test+=segment.text+" "
    return test.strip()