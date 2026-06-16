from rest_framework.decorators import api_view
from rest_framework.response import Response

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