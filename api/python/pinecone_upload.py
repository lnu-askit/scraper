import os

import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL = "text-embedding-ada-002"

res = openai.Embedding.create(
    input=["This is a test", "This is another test"], engine=MODEL
)

print(res)

# THIS PAGE IS WORK IN PROGRESS
