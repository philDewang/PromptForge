
# PromptForge AI

A dynamic, local-first Integrated Development Environment (IDE) for prompt engineering that runs entirely in your browser. Craft, manage, and share powerful, interactive AI prompts without needing a backend or user accounts.

![PromptForge AI Screenshot](https://storage.googleapis.com/aistudio-o-prd-public-buckets/downloads/promptforge-ai-screenshot.png)

---

## ✨ Why PromptForge AI?

Prompt engineering is often an ad-hoc process managed in scattered text files or wikis. PromptForge AI transforms this into a structured, efficient, and powerful workflow, giving you a dedicated environment to treat your prompts like the valuable assets they are.

### Core Features

*   **🧠 Local-First & Private**: Everything you create is saved directly and securely in your browser's local storage. No servers, no accounts, no data collection. Your work is yours alone.
*   **🧩 Interactive Templates**: Go beyond simple text. Build powerful forms with text inputs, dropdowns, checkboxes, and even file uploads to generate complex, high-quality prompts with zero effort.
*   **📚 Collection Management**: Organize your prompts into logical collections (e.g., "Software Engineering," "MBSE Modeling"). Each collection has its own "System Prompt" to provide consistent context to the AI.
*   **🔍 Instant Search**: Quickly filter templates within the active collection to find what you need in seconds.
*   **🤖 AI-Powered Creation**: Don't know where to start? Describe the template you need, and let the AI Assistant build it for you, complete with an interactive form.
*   **✍️ Versatile Editor**: Whether you prefer a simple Word-like editor, a guided form builder, or raw Markdown, JSON, and HTML, the editor adapts to your workflow.
*   **🚀 Starter Packs Included**: Hit the ground running with pre-packaged collections for **Software Engineering** and **MBSE Modeling**, filled with expert-level prompt templates.
*   **↔️ Robust Import/Export**: Share your collections with colleagues or back up your entire workspace with a single click. Export collections to `.json` or individual templates to `.md`.
*   **🎨 Customizable Themes**: Choose from multiple color themes to create a workspace that's easy on your eyes.
*   **🛡️ Data Protection**: Never lose your work. The app features "type-to-confirm" deletions and warns you about unsaved changes before you navigate away.

## 🚀 Quickstart

1.  **Launch**: Open the application.
2.  **Initialize Workspace**: On the Welcome Screen, click **"Load Starter Collections"** to populate your workspace with the pre-built template sets.
3.  **Select a Template**: Use the sidebar to navigate to the "Software Engineering" collection and select the "Code Refactor Assistant" template.
4.  **Generate a Prompt**: Fill out the interactive form with the requested details and click **"Generate Prompt"**.
5.  **Copy & Use**: A high-quality, context-aware prompt will be generated below. Click the **"Copy"** button and paste it into your favorite LLM interface.
6.  **Create Your Own**: Click **"New Template..."** in the sidebar and use the Blank Editor, AI Assistant, or Guided Builder to start forging your own prompts!

## 💡 Key Concepts

*   **Template**: The fundamental building block of PromptForge AI. A template is a single Markdown (`.md`) file that can be either a simple document or an interactive form defined by its YAML frontmatter.
*   **Collection**: A group of related templates. Each collection acts as a project or workspace and is defined by its foundational "System Prompt" (the first template in the list), which provides guiding context for all AI-assisted actions within that collection.

## 🛠️ Tech Stack

*   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration**: [Google Gemini API](https://ai.google.dev/)
*   **Persistence**: Browser `localStorage`
*   **Parsing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) for Markdown frontmatter

## 🔒 Privacy and Security

PromptForge AI is designed with privacy as a top priority.

*   **No Data Transmission**: Your templates and collections are never sent to a server. All data remains within your browser.
*   **API Key Security**: The application uses `process.env.API_KEY`, which is securely injected by the execution environment. Your API key is **never** stored in `localStorage` or exposed in client-side code.
*   **AI Calls**: The only data that leaves your browser is the content sent to the Gemini API during an explicit AI-powered action (like generating a template).

## 📄 License

This project is licensed under the MIT License.