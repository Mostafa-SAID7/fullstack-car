---
name: image-generation-gemini
description: Generates high-quality images using Gemini (Nanobana-compatible). Use when visual assets are required for product features, documentation, or UI/UX workflows.
---

# Image Generation Skill (Gemini)

## Purpose & Scope

This skill enables the agent to generate images on demand using Google Gemini’s image generation model.  
It is designed for **production use**, supporting UI mockups, marketing assets, documentation visuals, and concept illustrations.

The skill is **stateless**, deterministic in execution, and outputs binary image files to disk.

---

## When to Use This Skill

Use this skill when:

- An image is required as part of a feature, design artifact, or deliverable
- Visual output must be generated programmatically
- The project requires AI-generated images rather than stock assets
- The agent is asked to “create”, “generate”, or “design” an image

This skill is especially helpful for:

- Frontend/UI mockups
- Product concept visualization
- Documentation diagrams
- Marketing or presentation assets

---

## How the Agent Should Use This Skill

### Step-by-Step Execution Rules

1. **Receive Image Intent**
   - Extract a clear natural-language prompt describing the image
   - Ensure the prompt is concrete (style, subject, context, constraints)

2. **Insert Prompt**
   - Replace `INSERT_INPUT_HERE` with the finalized image prompt
   - Do not modify model, config, or tool definitions unless explicitly required

3. **Run Generation**
   - Execute the script once per image request
   - Stream output must be handled incrementally

4. **Persist Output**
   - Save each generated image to disk using the provided helper
   - Maintain deterministic file naming using incremental indices

5. **Return Result**
   - Confirm image generation success
   - Reference saved file paths in the response

---

## Conventions & Guardrails

- Always use environment variable `GEMINI_API_KEY`
- Never hardcode credentials
- Do not post-process image binary data
- Do not modify MIME type inference logic
- Output files must be saved locally before response
- Prefer descriptive prompts over short prompts

---

## Reference Implementation

```python
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
```
