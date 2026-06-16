import base64
import io

from PIL import Image
import pytesseract

def extract_text_from_base_64(base64_image):
    if "," in base64_image:
        base64_image = base64_image.split(",")[1]
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data)) #get decoded image

    width, height = image.size
    problem_region=image.crop((0,0,width//2,height)) #crop image to get problem
    code_region=image.crop((width//2,0,width,height)) #crop image to get code

    problem_text = pytesseract.image_to_string(problem_region)
    code_text = pytesseract.image_to_string(code_region)
    return {
        "problem": problem_text,
        "code": code_text
    }