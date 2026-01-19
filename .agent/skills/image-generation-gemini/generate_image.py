# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import mimetypes
import os
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"File saved to: {file_name}")


def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-3-pro-image-preview"

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text="""INSERT_INPUT_HERE"""
                ),
            ],
        ),
    ]

    tools = [
        types.Tool(
            googleSearch=types.GoogleSearch()
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        image_config=types.ImageConfig(
            image_size="1K",
        ),
        tools=tools,
    )

    file_index = 0

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            not chunk.candidates
            or not chunk.candidates[0].content
            or not chunk.candidates[0].content.parts
        ):
            continue

        part = chunk.candidates[0].content.parts[0]

        if part.inline_data and part.inline_data.data:
            file_name = f"generated_image_{file_index}"
            file_index += 1

            inline_data = part.inline_data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)

            save_binary_file(
                f"{file_name}{file_extension}",
                inline_data.data
            )
        else:
            print(chunk.text)


if __name__ == "__main__":
    generate()
