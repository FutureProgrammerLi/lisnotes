---
description: Summarize a YouTube video with concise English bullet points, translate to Chinese, and save to a user-specified .md file.
---

When exactly triggered by the user (or provided with YouTube URLs under this workflow), follow these steps in order:

1. **Extract and Summarize (English)**
   - Obtain the transcript or content from the provided YouTube URL(s).
   - Generate an English summary using **structured bullet points**. Instead of just a few words, provide detailed, paragraph-length explanations for each key concept, with sub-bullets for specific nuances if necessary.
   - Extract the core ideas, frameworks, and actionable points in a comprehensive manner.

2. **Translate to Chinese**
   - Translate the detailed English bullet points into highly fluent, natural-sounding, and colloquial Chinese ("说人话"). 
   - Avoid stiff, machine-like translations. Ensure the tone is engaging and fits a professional, high-quality blog post or reading note.
   - For key technical or conceptual terms, provide the Chinese translation followed by the original English term in parentheses (e.g., "驾驶舱法则 (The Cockpit Rule)").

3. **Prompt for File Location**
   - For each video/URL, pause and ask the user: "Where would you like to save the markdown file for this video? (Please provide the exact directory or file path)."
   - Wait for the user to provide the destination path.

4. **Create the Markdown File**
   - Use the `write_to_file` tool to create the `.md` file at the location the user specified.
   - **Format the file exactly as follows:**
     ```markdown
     # [Video Title]

     ## Video Summary (English)
     * [Key Concept 1]: [Detailed explanation...]
       * [Sub-point]
     * [Key Concept 2]: [Detailed explanation...]

     ## 视频总结 (Chinese)
     * [核心概念 1] (English Term): [通顺流畅的详细中文解释...]
       * [子要点]
     * [核心概念 2] (English Term): [通顺流畅的详细中文解释...]

     ---
     **Source**: [[视频频道/作者名称]]([YouTube源链接])
     ```

5. **Repeat**
   - If there are more URLs provided, repeat steps 1-4 for each. Let the user know when all are completed.