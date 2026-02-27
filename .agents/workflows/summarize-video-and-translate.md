---
description: Summarize a YouTube video with concise English bullet points, translate to Chinese, and save to a user-specified .md file.
---

When exactly triggered by the user (or provided with YouTube URLs under this workflow), follow these steps in order:

1. **Extract and Summarize (English)**
   - Obtain the transcript or content from the provided YouTube URL(s).
   - Generate an English summary using **concise bullet points** (a few words per sentence is enough).
   - No specific focus is required; just provide a general summarization.

2. **Translate to Chinese**
   - Translate the concise English bullet points into Chinese.

3. **Prompt for File Location**
   - For each video/URL, pause and ask the user: "Where would you like to save the markdown file for this video? (Please provide the exact directory or file path)."
   - Wait for the user to provide the destination path.

4. **Create the Markdown File**
   - Use the `write_to_file` tool to create the `.md` file at the location the user specified.
   - Format the file simply: put the English summary first, followed by the Chinese translation.
   - No specific VitePress format or frontmatter is needed. Just a standard Markdown file.

5. **Repeat**
   - If there are more URLs provided, repeat steps 1-4 for each. Let the user know when all are completed.