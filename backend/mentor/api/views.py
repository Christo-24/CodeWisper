import tempfile

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import LatestCapture
from ..services.whisper_service import transcribe_audio

from ..services.ocr_service import (extract_text_from_base_64)


from mentor.graph.main_graph import workflow


@api_view(['POST'])
def upload_frame(request):
    image=request.data.get('image')
    if not image:
        return Response({'error': 'image is required'}, status=status.HTTP_400_BAD_REQUEST)

    extracted_text = extract_text_from_base_64(image)
    problem=extracted_text.get('problem', '')
    code=extracted_text.get('code', '')
    
    LatestCapture.objects.create(problem=problem, code=code)

    return Response({'problem': problem, 'code': code})
        


@api_view(['POST'])
def transcribe(request):
    audio_file=request.FILES["audio"]
    with tempfile.NamedTemporaryFile(delete=False,suffix=".webm") as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name
    text=transcribe_audio(temp_path)
    return Response({'text': text})


@api_view(['POST'])
def mentor(request):
    question=request.data.get('question')
    if not question:
        return Response({'error': 'question is required'}, status=status.HTTP_400_BAD_REQUEST)

    latest_capture = LatestCapture.objects.first()
    if latest_capture is None:
        return Response(
            {'error': 'No OCR capture found. Capture a frame first.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    result=workflow.invoke(
        {
            "ocr_text": latest_capture.problem,
            "code": latest_capture.code,
            "question": question,
        }
    )
    if result.get("lessons") is not None:
        return Response({
            "type": "lessons",
            "data": result["lessons"].model_dump()
        })
    return Response({
        "type": "answer",
        "data": result['answer']
    })