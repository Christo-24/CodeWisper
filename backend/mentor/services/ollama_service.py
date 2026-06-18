import requests
OLLAMA_API_URL = "http://localhost:11434/api/generate"

def ask_mistral(problem,code,question):
    promt=f"""
You are Jarvis, a leetcode mentor.

problem:{problem}
current code:{code}
user question:{question}

Rules:
-answer the users question 
-keep answers consise
-never give complete solution
-if they ask for hint give hint
-maximum 2 sentences
-be conversational.
"""
    response=requests.post(OLLAMA_API_URL,json={"model":"mistral","prompt":promt,"stream":False})
    data=response.json()
    return data["response"]