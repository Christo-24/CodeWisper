from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os
load_dotenv()

def get_groq_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable not set.")
    
    return ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key)
    
def get_supervisor_groq_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable not set.")
    
    return ChatGroq(model="llama-3.1-8b-instant", api_key=api_key)
    