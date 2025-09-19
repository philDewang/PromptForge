## **Software Architecture: PromptForge AI**

This document provides a detailed overview of the software architecture for PromptForge AI, a client-side, local-first application for prompt engineering.

### **1. Architecture Diagram**

The following diagram illustrates the major components of the application and their interactions.

```mermaid
graph TD
    subgraph Browser
        subgraph "React Application"
            subgraph "UI Components"
                A[App.tsx] --> B[Sidebar.tsx];
                A --> C[TemplateViewer.tsx];
                B --> M1[Modals];
                C --> M2[Modals];
                C --> IP[InteractivePrompt.tsx];
                C --> ED[Editors: Form, Simple, etc.];
            end

            subgraph "State Management (Context)"
                CTX[CollectionContext.tsx]
                DISPATCH{dispatch(action)}
                STATE[(RootState)]
                REDUCER[rootReducer]

                UI_COMPONENTS[UI Components] -.->|Dispatches Actions| DISPATCH;
                DISPATCH --> REDUCER;
                REDUCER -- Updates --> STATE;
                STATE -->|Provides State| UI_COMPONENTS;
            end

            subgraph "Service Layer"
                DS[dataService.ts]
                PS[promptService.ts]
                GS[geminiService.ts]
            end

            subgraph "Hooks"
                LS[useLocalStorage.ts]
            end
        end

        subgraph "Persistence"
            STORE[localStorage]
        end
    end

    subgraph "External Services"
        GEMINI[Google Gemini API]
    end

    %% Interactions
    UI_COMPONENTS -- Calls --> DS;
    IP -- Calls --> PS;
    M1 -- Calls --> GS;
    
    CTX -- Uses --> LS;
    LS -- Reads/Writes --> STORE;
    GS -- Interacts with --> GEMINI;

    style UI_COMPONENTS fill:#cde4ff,stroke:#0062ff
    style CTX fill:#d5e8d4,stroke:#82b366
    style DS fill:#ffe6cc,stroke:#d79b00
    style PS fill:#ffe6cc,stroke:#d79b00
    style GS fill:#ffe6cc,stroke:#d79b00
    style LS fill:#f8cecc,stroke:#b85450
    style STORE fill:#e1d5e7,stroke:#9673a6
    style GEMINI fill:#dae8fc,stroke:#6c8ebf
```

### **2. Architectural Pillars**

The architecture is built on three core pillars: a Component-Based UI, Centralized State Management, and a decoupled Service Layer.

#### **Pillar 1: Component-Based UI (React)**

*   **Description:** The user interface is a tree of declarative React components. Major layout components (`Sidebar`, `TemplateViewer`) define the structure, while smaller, reusable UI components (`Modal`, `FormEditor`) handle specific pieces of the interface.
*   **Interaction:** Components are responsible for rendering the UI based on the current state and capturing user input. They do not contain complex business logic. Instead, they trigger state changes by calling the `dispatch` function provided by the central context.

#### **Pillar 2: Centralized State Management (`CollectionContext.tsx`)**

*   **Description:** The entire application's state (`RootState`) is held in a single, managed store. This avoids state inconsistencies and makes the application's data flow predictable.
*   **Pattern:** It implements a Redux-like pattern using native React hooks:
    *   **`useReducer`:** A single `rootReducer` function is the only place where the state can be modified. It takes the current state and an `action` object and returns the new state.
    *   **`useContext`:** The `state` object and the `dispatch` function are provided to the entire component tree via React Context, eliminating the need for prop-drilling.
*   **Persistence Bridge (`useLocalStorage.ts`):** The context provider is wrapped by the `useLocalStorage` hook. After the reducer calculates the new state, this hook is responsible for serializing it and writing it to the browser's `localStorage`, creating a seamless persistence layer.

#### **Pillar 3: Decoupled Service Layer**

*   **Description:** Business logic, data transformations, and external API calls are abstracted into a service layer. This separates concerns, making the components simpler and the logic easier to test and maintain.
*   **Services:**
    *   **`dataService.ts`:** Handles logic related to data hydration and portability. It provides the initial "Starter Collections" and contains the functions for importing/exporting collections as `.json` files.
    *   **`promptService.ts`:** This is a critical offline service. It takes structured data from the `InteractivePrompt` forms and formats it into high-quality prompt strings. **It makes no API calls.** Its purpose is to build the final prompt text for the user to copy.
    *   **`geminiService.ts`:** This is the *only* service that interacts with an external API. Its scope is strictly limited to AI-powered *creation* of templates, not the execution of user prompts.

### **3. Key Data Flows**

#### **Flow 1: Application Initialization**

1.  `App.tsx` renders `CollectionProvider`.
2.  `useLocalStorage` hook attempts to read and parse the `promptforge-state` key from `localStorage`.
3.  If successful, the parsed state hydrates the `useReducer` hook.
4.  If it fails or is empty, an initial default state is used.
5.  The `AppContent` component consumes the state. If no collections exist, it renders `WelcomeScreen`; otherwise, it renders the main `Sidebar` and `TemplateViewer`.

#### **Flow 2: User Generates a Prompt (Offline)**

1.  User fills out the form in `InteractivePrompt.tsx`.
2.  User clicks the "Generate Prompt" button.
3.  `InteractivePrompt.tsx` calls the appropriate generator function from `promptService.ts`, passing the current form data and the collection's system prompt.
4.  `promptService.ts` formats the inputs into a structured string and prepends the system prompt.
5.  The final string is returned to `InteractivePrompt.tsx` and displayed in the output area.
6.  **Result:** A prompt is generated without any external network requests.

#### **Flow 3: User Creates a Template with AI (Online)**

1.  User clicks "New Template" -> "AI Assistant" in the `Sidebar`.
2.  The `AIAssistedTemplateModal` opens and captures a user's description of the desired template.
3.  On submission, the modal calls `generateTemplateFromDescription` in `geminiService.ts`.
4.  `geminiService.ts` constructs a meta-prompt (instructing the AI to return Markdown with YAML frontmatter) and makes a single API call to the Google Gemini API.
5.  The returned Markdown string is received by the `Sidebar`.
6.  The `Sidebar` dispatches a `CREATE_TEMPLATE` action with the AI-generated content as the payload.
7.  The reducer adds the new template to the state, and `useLocalStorage` persists the change.