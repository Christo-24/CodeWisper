import tempfile

from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..services.whisper_service import transcribe_audio

from ..services.ocr_service import (extract_text_from_base_64)
from ..services.ollama_service import ask_mistral


@api_view(['POST'])
def upload_frame(request):
    image=request.data.get('image')
    extracted_text = extract_text_from_base_64(image)
    problem=extracted_text['problem']
    code=extracted_text['code']
    hint=ask_mistral(problem, code)
    return Response({'problem': problem, 'code': code,
        'hint': hint})

@api_view(['POST'])
def transcribe(request):
    audio_file=request.FILES["audio"]
    with tempfile.NamedTemporaryFile(delete=False,suffix=".webm") as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name
    text=transcribe_audio(temp_path)
    return Response({'text': text})