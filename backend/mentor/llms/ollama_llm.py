from langchain_ollama import ChatOllama

def get_ollama_llm():
    return ChatOllama(model="mistral",temperature=0)