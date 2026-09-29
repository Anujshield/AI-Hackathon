import os
import json

from dotenv import load_dotenv
from openai import OpenAI

from prompts import SYSTEM_PROMPT


load_dotenv()


client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


def analyze_requirement(requirement: str):

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        response_format={
            "type": "json_object"
        },
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
Analyze the following software requirement:

{requirement}
"""
            }
        ]
    )

    content = response.choices[0].message.content

    return json.loads(content)