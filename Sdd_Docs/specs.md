
## **Specification: PromptForge AI**

### **1. High-Level Goal**

To create a powerful, self-contained, and intuitive desktop-class application that runs entirely in the browser, enabling technical professionals to develop, manage, and share complex AI prompts. The application, "PromptForge AI," serves as a dedicated Integrated Development Environment (IDE) for prompt engineering.

### **2. Target User Persona**

*   **Name:** Alex, a Solutions Architect / Systems Engineer.
*   **Background:** Alex is a domain expert in a complex field (like systems engineering, finance, or scientific research) but is not a professional software developer. They are technically proficient and understand logic, but their primary focus is on solving domain problems, not writing code.
*   **Needs:** Alex needs a tool that allows them to leverage the power of Large Language Models (LLMs) without the overhead of setting up a complex development environment. They need to create reusable, structured prompts ("templates"), collaborate with other domain experts, and maintain a personal library of their work that is both secure and portable.

### **3. The Problem Solved**

Prompt engineering is often an ad-hoc process managed in plain text files, wikis, or spreadsheets. This is inefficient, error-prone, and difficult to scale or share. PromptForge AI solves this by providing:

*   **Structure:** A dedicated workspace for organizing prompts into logical collections.
*   **Reusability:** The ability to create templates that can be easily duplicated and modified.
*   **Interactivity:** A way to build simple UIs (forms with inputs, dropdowns, file uploads) on top of prompts, allowing users to generate complex, high-quality prompts with minimal effort.
*   **Portability:** Simple, powerful import/export features that allow users to back up their work and share entire collections with colleagues, free of any platform lock-in.
*   **Sharing:** A modern "Share" feature allows users to quickly send individual templates to colleagues via their native OS sharing dialog.
*   **Persistence:** A seamless experience where the user's work is always saved and available upon returning to the application, without requiring a backend server or user accounts.
*   **Data Safety**: Robust protection against accidental data loss through "type-to-confirm" deletions and warnings for unsaved changes.

### **4. Core User Journeys & Experiences**

**Journey 1: First-Time Onboarding**

1.  **User Action:** Alex opens the PromptForge AI application for the first time.
2.  **System Response:** The application displays a clean, welcoming screen. It presents two clear choices: "Load Starter Collections" or "Import Collection."
3.  **User Action:** Alex clicks "Load Starter Collections."
4.  **System Response:** The application instantly populates the workspace with pre-built sets for Software Engineering, MBSE, and more. The UI transitions to the main two-panel layout (Sidebar and Template Viewer). The first template is displayed, ready for use.
5.  **User Experience:** The onboarding is frictionless and immediate. Within two clicks, Alex has a fully functional and populated workspace, allowing them to see the application's value and understand its core concepts.

**Journey 2: Daily Prompt Generation**

1.  **User Action:** Alex opens the app, and their workspace is exactly as they left it. They select the "Software Engineering" collection, which has dozens of templates. Instead of scrolling, they type "Refactor" into the new search bar, instantly filtering the list. They click the "Code Refactor Assistant" template.
2.  **System Response:** An interactive form is displayed in the viewer, with fields for "Programming Language," "Refactoring Goal," and the code snippet.
3.  **User Action:** Alex fills out the form and clicks "Generate Prompt."
4.  **System Response:** The application instantly generates a complete, high-quality prompt in a text box below the form. The generated text includes the collection's "System Prompt" for context. A "Copy" button appears next to it.
5.  **User Action:** Alex clicks "Copy" and pastes the perfected prompt into their external AI chat tool of choice.
6.  **User Experience:** The workflow is a tight, efficient loop. The application acts as a powerful "prompt builder," not a chat client, giving Alex full control over where and how they use their prompts.

**Journey 3: Creating a New Interactive Template**

1.  **User Action:** Alex needs a new template for analyzing UI screenshots. They click "New Template..." in the sidebar.
2.  **System Response:** A modal appears with three options: "Blank Template," "AI Assistant," and "Guided Builder." Alex chooses "Guided Builder."
3.  **System Response:** A step-by-step wizard opens. In Step 1, Alex uses the "Form Editor" to add and configure fields, including a "File Upload" field for the screenshot and a "Select" field for the analysis goal.
4.  **User Action:** In Step 2, Alex writes instructions in the template body. In Step 3, they preview the live form. Satisfied, they click "Finish & Create Template."
5.  **System Response:** The new, fully interactive template is saved to their collection and is ready to use immediately.
6.  **User Experience:** Creating powerful, form-based tools is simple and requires no manual coding of YAML. The wizard provides a safe and intuitive path to building complex templates.

**Journey 4: Editing and Data Safety**

1.  **User Action:** Alex opens a template and clicks "Edit." They make several changes in the editor. The "Save" button begins to glow, indicating unsaved work.
2.  **User Action:** Alex gets distracted and clicks on a different template in the sidebar.
3.  **System Response:** A modal appears, warning, "You have unsaved changes. Are you sure you want to discard them?" Alex clicks "Cancel."
4.  **User Action:** Alex clicks "Save," and their work is instantly persisted. Later, they decide to delete an entire collection.
5.  **System Response:** A confirmation modal appears, requiring Alex to type the full name of the collection before the "Delete" button is enabled.
6.  **User Experience:** The application actively prevents data loss. Visual cues and confirmation dialogs provide a safety net, making Alex feel confident that their work is secure.

**Journey 5: Sharing a Template**

1.  **User Action:** Alex has perfected a template and clicks the "Share" button in the Template Viewer.
2.  **System Response:** The application attempts to use the Web Share API to open the operating system's native sharing dialog.
3.  **User Action:** Alex chooses to share the template file via their email client to a colleague.
4.  **System Response:** The colleague receives the `.md` file, which they can then use. If the share dialog cannot be opened, the application falls back to a direct file download.
5.  **User Experience:** Sharing is seamless and integrated with Alex's existing workflow, making collaboration simple and effective.

### **5. Success Criteria**

*   **Clarity:** A new user must be able to understand the core functionality and successfully generate and copy a prompt within 60 seconds of first launch.
*   **Efficiency:** The process of selecting, editing, and saving a template must feel instantaneous.
*   **Portability:** The exported collection file from one user's browser must be successfully imported into another user's browser without any data loss or errors.
*   **Reliability:** The application state must be perfectly preserved between browser sessions, and users must be protected from accidental data loss.