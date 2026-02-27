---
description: Create a .md file from a provided transcript and translated summary, asking for location and naming.
---

When triggered by the user with a transcript and a translated version summary, follow these steps in order:

1. **Acknowledge and Prompt for Details**
   - You will receive a transcript and a translated version summary from the user.
   - Look for the title of the video within the provided transcript.
   - If a title is found, use it as the name of the markdown file. Ask the user: "Where would you like to save the markdown file `[Extracted Title].md`? (Please provide the exact directory/location)."
   - If no title is found, ask the user: "What would you like to name the markdown file, and where would you like to save it? (Please provide the exact directory/location and the desired filename)."
   - Wait for the user to provide the destination path (and name if applicable).

2. **Create the Markdown File**
   - Use the `write_to_file` tool to create the `.md` file at the specified location using the determined filename.
   - Populate the file with the transcript and translated summary provided by the user, formatting it cleanly using markdown. Start with a title heading corresponding to the video title.

3. **Confirmation**
   - Notify the user once the file has been successfully created.