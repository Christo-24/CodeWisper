import requests
OLLAMA_API_URL = "http://localhost:11434/api/generate"

def ask_mistral(problem,code):
    promt=f"""
You are a senior software enigneer mentoring a junior developer.
problem:{problem}
current code:{code}

Rules:
-never give complete solution
-never provide final code
-give short hints
-maximum 2 sentences
-be conversational.
"""
    response=requests.post(OLLAMA_API_URL,json={"model":"mistral","prompt":promt,"stream":False})
    data=response.json()
    return data["response"]