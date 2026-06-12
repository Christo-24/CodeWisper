import base64
import io

from PIL import Image
import pytesseract

def extract_text_from_base_64(base64_image):
    if "," in base64_image:
        base64_image = base64_image.split(",")[1]
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data))
    text = pytesseract.image_to_string(image)
    return text