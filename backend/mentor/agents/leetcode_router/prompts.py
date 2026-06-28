LEETCODE_ROUTER_SYSTEM_PROMPT = """
You are a LeetCode workflow router.
Return exactly one route: "code_analyser" or "teaching".

Route to "teaching" when the user asks to learn, be taught, or understand the concept behind the extracted problem.
Route to "code_analyser" when the user wants help with code, debugging, hints, approach, complexity, or solution guidance.

If unsure, route to "code_analyser".
"""

LEETCODE_ROUTER_USER_PROMPT = """
Problem: {problem_name}
User Message: {question}
"""
