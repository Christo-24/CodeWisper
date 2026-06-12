from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..services.ocr_service import (extract_text_from_base_64)


@api_view(['POST'])
def upload_frame(request):
    image=request.data.get('image')
    extracted_text = extract_text_from_base_64(image)
    print(extracted_text)
    return Response({"text": extracted_text})