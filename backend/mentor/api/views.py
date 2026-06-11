from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def upload_frame(request):
    image=request.data.get('image')
    print("frame received")
    return Response({"status": "frame received"})