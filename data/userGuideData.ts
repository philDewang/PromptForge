
export const userGuideContent = `
# Welcome to PromptForge AI

PromptForge AI is a powerful, local-first Integrated Development Environment (IDE) for prompt engineering. It runs entirely in your browser, allowing you to craft, manage, and share complex AI prompts securely and efficiently.

---

## Core Concepts

Understanding these concepts is key to mastering PromptForge AI.

### 1. Collections
A **Collection** is a workspace or a project that groups related prompt templates. Think of it as a folder for a specific purpose, like "Software Engineering" or "Creative Writing." Each collection has its own unique context.

### 2. Templates
A **Template** is the fundamental building block of the application. It's a single, reusable prompt stored as a Markdown (\`.md\`) file. Templates can be simple text documents or powerful, interactive forms.

### 3. System Prompt
The **System Prompt** is the most important template in any collection. It is always the first template in the list (e.g., "Foundational Setup," "System Prompt"). Its content is automatically used to provide grounding context for all AI-powered actions within that collection, ensuring the AI's responses are consistent and domain-aware.

---

## Getting Started: Your First Session

When you first launch PromptForge AI, you'll see a welcome screen.

- **Load Starter Collections**: The easiest way to begin is to click this button. It will instantly load your workspace with pre-built, expert-level collections for Software Engineering, MBSE Modeling, and more.
- **Import Collection**: If a colleague has sent you a \`.json\` file, you can use this option to load their entire collection into your workspace.

---

## The Workspace

The application is divided into two main panels: the **Sidebar** on the left and the **Template Viewer** on the right.

### The Sidebar
This is your main navigation hub.

- **Collection Selector**: A dropdown menu at the top lets you switch between your different collections.
- **Collection Management**: Buttons below the selector allow you to **Add** a new collection, **Rename** the current one, or **Delete** it (with a confirmation step).
- **Template Search**: Just above the template list, you'll find a search bar. Start typing, and the list will instantly filter to show only the templates that match your query, making it easy to navigate large collections. The search is cleared automatically when you switch collections.
- **Template List**: The main area of the sidebar lists all templates within the active collection. Clicking a template will open it in the viewer.
- **Core Actions**: At the bottom, you'll find buttons to create a **New Template** or **Export** the entire current collection to a \`.json\` file for backup or sharing.

### The Template Viewer
This is where you'll view, interact with, and edit your templates.

- **Header**: Displays the template's title and action buttons like **Edit**, **Share**, and **Delete**.
- **Content Area**: Shows the rendered content of your template. If it's an interactive template, the form will appear here.

---

## Creating & Editing Templates

Click the **"Edit"** button to enter editing mode. You have several editor modes to choose from:

- **Simple**: For non-interactive templates, this provides a user-friendly view with separate fields for the title and the body content, hiding the Markdown syntax.
- **Form**: For interactive templates, this mode allows you to configure the template's title, description, and form fields using a guided graphical interface.
- **Raw Markdown**: The full-power mode. This shows the complete source of the template, including the YAML frontmatter and the Markdown body, for total control.
- **JSON (Header)**: A dedicated editor for modifying only the YAML frontmatter of your template. It's great for advanced configuration and includes validation to prevent errors.
- **HTML (Body)**: A dedicated editor for the body of your template, perfect for when you're crafting prompts that need to generate or include HTML.

> **Safety First!** The application will warn you if you try to navigate away from a template with unsaved changes, preventing you from losing work.

---

## Building Interactive Forms

You can turn any template into an interactive form using the **Form Editor** or by editing the YAML frontmatter in the **Raw Markdown** view.

The following field types are supported:
- **Input**: A single-line text field.
- **Textarea**: A multi-line text area.
- **Select**: A dropdown menu of predefined options.
- **Checkbox**: A simple true/false checkbox.
- **File**: A file upload button, perfect for prompts that need to analyze images or documents.

---

## AI-Powered Features

PromptForge AI uses AI to help you build better templates.

### Create Template with AI
1. Click **"New Template..."** in the sidebar.
2. Select the **"AI Assistant"** option.
3. Describe the template you want (e.g., "A template to generate a commit message from a list of changes").
4. The AI will use the **System Prompt** of your current collection for context and generate a complete, interactive template for you.

---

## Managing Your Work

### Sharing & Exporting
- **Export Collection**: From the sidebar, you can export the entire active collection as a single \`.json\` file. This is the best way to back up your work or share a full project with a colleague.
- **Share Template**: From the template viewer, click the "Share" button to download the current template as a self-contained \`.md\` file.

### Importing
- Use the **"Import from File"** option in the "Add Collection" modal to load a \`.json\` file that you or someone else has previously exported.

---

## Settings & Customization

Click the **Settings** icon (sliders) in the sidebar header to open the Application Settings. Here, you can change the color theme of the entire application to suit your preference.
`