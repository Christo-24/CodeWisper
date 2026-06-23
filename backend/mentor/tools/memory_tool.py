from mentor.models import Conversation

from langchain.tools import tool


@tool
def get_recent_conversation(limit:int=5)->str:
        """
        Get the recent conversation history between user and codewishper.
        """
        conversations = Conversation.objects.order_by('-created_at')[:limit]
        if not conversations:
            return "No recent conversations found."
        history = []
        for conversation in conversations:
            history.append(f"""
        Question: {conversation.question}
        Answer: {conversation.answer}
            """)
        return "\n".join(history)
    
        