from .groq_llm import get_groq_llm
from .ollama_llm import get_ollama_llm


class LLMFactory:
    @staticmethod
    def get_problem_extractor_llm():
        return get_ollama_llm()
    
    
    @staticmethod
    def get_mentor_llm():
        return get_groq_llm()
    
    @staticmethod
    def get_code_analyzer_llm():
        return get_groq_llm()