
### **Technical Plan: PromptForge AI**

#### **1. Overview & Architecture**

The application is a client-side only Single-Page Application (SPA) built with React and TypeScript. The core architectural principles are:

*   **Zero Backend:** The application is self-contained and runs entirely in the user's browser, requiring no server-side processing or database.
*   **Local-First Persistence:** All user data (collections, templates, settings) is persisted exclusively in the browser's `localStorage`. This ensures data privacy, offline availability, and instantaneous load times.
*   **Component-Based UI:** The user interface is constructed from modular React components, primarily organized into a two-panel layout for intuitive navigation and content interaction.
*   **Centralized State Management:** A global state is managed via React's Context API, coupled with a `useReducer` hook for predictable state transitions. A custom `useLocalStorage` hook bridges the state with the browser's persistence layer.
*   **Service Layer Abstraction:** Logic is separated into distinct services. The `dataService` handles import/export and starter data, the `promptService` handles offline prompt string generation, and the `geminiService` handles AI-powered template creation.

#### **2. Final Folder Structure**

```
/
├── Sdd_Docs/
│   ├── specs.md
│   ├── plan.md
│   └── architecture.md
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TemplateViewer.tsx
│   │   └── WelcomeScreen.tsx
│   ├── modals/
│   │   ├── AddCollectionModal.tsx
│   │   ├── ConfirmationModal.tsx
│   │   └── ... (Other modals)
│   └── ui/
│       ├── InteractivePrompt.tsx
│       ├── FormEditor.tsx
│       └── ... (Other UI elements)
├── context/
│   └── CollectionContext.tsx
├── data/
│   ├── mbseCollectionData.ts
│   └── ... (Other starter collection data)
├── hooks/
│   └── useLocalStorage.ts
├── services/
│   ├── dataService.ts
│   ├── geminiService.ts
│   └── promptService.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.html
└── index.tsx
```

#### **3. Core Components & Responsibilities**

*   **`App.tsx`**: The root component. It wraps the application in the `CollectionProvider` and renders the main layout. It handles the initial logic of showing the `WelcomeScreen` if the state is empty.
*   **`Sidebar.tsx`**: Renders the left navigation panel. It displays collections and templates, provides UI controls that dispatch actions to the central context (e.g., `SELECT_COLLECTION`, `CREATE_TEMPLATE`), and includes a search bar to filter templates within the active collection.
*   **`TemplateViewer.tsx`**: The main content area. It displays the selected template and manages the multi-mode editing experience (**Simple**, **Form**, **Raw Markdown**, **JSON**, **HTML**). It tracks the `editorIsDirty` state and handles save/delete actions by dispatching to the context. It also handles sharing templates by attempting to use the modern Web Share API and gracefully falling back to a direct file download if the API is unavailable.
*   **`InteractivePrompt.tsx`**: A purely presentational component. It renders an interactive form based on a template's configuration. On submission, it calls the `promptService` to generate a prompt string and displays the result for the user to copy. **It does not call the AI directly.**
*   **`FormEditor.tsx`**: A UI component that provides a user-friendly way to edit the YAML frontmatter of an interactive template without writing raw code.

#### **4. State Management Strategy (`CollectionContext.tsx`)**

State management is centralized to ensure a single source of truth and predictable data flow.

1.  **Persistence (`useLocalStorage`)**: The top-level `CollectionProvider` uses a custom `useLocalStorage` hook. This hook synchronizes the entire application state with a single key in the browser's `localStorage`.
2.  **State Transitions (`useReducer`)**: A single `rootReducer` function manages all state changes. Components do not modify state directly; instead, they `dispatch` actions (e.g., `{ type: 'UPDATE_TEMPLATE', payload: ... }`). This ensures all mutations are explicit and traceable.
3.  **Global Access (`useContext`)**: The `CollectionProvider` exposes the `state` and `dispatch` function via React Context. Custom hooks (`useCollectionState`, `useCollectionDispatch`) provide type-safe access for consumer components, eliminating prop-drilling.
4.  **State Shape (`types/index.ts`)**: The `RootState` interface defines the entire application state, including `collectionsState`, `settings`, and the `editorIsDirty` flag for unsaved change warnings.

#### **5. Data Flow**

*   **Initial Load:**
    1.  `App.tsx` mounts `CollectionProvider`.
    2.  `useLocalStorage` hook reads from `localStorage`. If empty, it uses the `getInitialState()` function.
    3.  The state is passed to the `useReducer` hook.
    4.  `AppContent` receives the state. If `collections.length` is 0, it renders `WelcomeScreen`. Otherwise, it renders the main UI.
*   **Editing a Template:**
    1.  User clicks "Edit" in `TemplateViewer`.
    2.  User modifies content in an editor (e.g., `FormEditor`).
    3.  The editor's `onUpdate` callback is triggered, which dispatches `{ type: 'SET_EDITOR_DIRTY', payload: true }`.
    4.  User clicks "Save."
    5.  `TemplateViewer` dispatches `{ type: 'UPDATE_TEMPLATE', payload: updatedTemplate }`.
    6.  The `rootReducer` handles this action, producing a new state object.
    7.  The `useReducer` passes this new state to the `useLocalStorage` hook's setter function, which writes the entire updated state to `localStorage`.
    8.  React re-renders all components subscribed to the context.

#### **6. AI Integration & Service Layer**

The application makes a critical distinction between generating prompts and using AI to create templates.

*   **`promptService.ts` (Offline Prompt Generation):**
    *   This service contains a map of generator functions (e.g., `genericPromptGenerator`).
    *   It is called **by the UI** (`InteractivePrompt.tsx`) when the user clicks "Generate Prompt."
    *   Its sole purpose is to take the form data and the collection's system prompt and format them into a high-quality text string.
    *   **It makes no external API calls.** This is the core of the "offline-first" prompt building experience.

*   **`geminiService.ts` (Online Template Creation):**
    *   This service is the only module that communicates with the external Gemini API.
    *   It exposes one primary function: `generateTemplateFromDescription`.
    *   It is called **only** when the user goes through the "New Template" -> "AI Assistant" flow.
    *   It constructs a meta-prompt, instructing the AI to act as a template creator and return valid Markdown with YAML frontmatter.
    *   The API key is securely handled by the execution environment (`process.env.API_KEY`) and is never stored or exposed in the client.