from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..services.ocr_service import (extract_text_from_base_64)


@api_view(['POST'])
def upload_frame(request):
    image=request.data.get('image')
    extracted_text = extract_text_from_base_64(image)
    print("problem: ",extracted_text['problem'])
    print("code: ",extracted_text['code'])
    return Response(extracted_text)