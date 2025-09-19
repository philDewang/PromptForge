

export const MBSE_TEMPLATES_CONTENT: Record<string, string> = {
    "01-foundational-setup.md": `---
title: 'Foundational Setup'
---
### System Prompt for the LLM Workspace

*This is the main instruction set for the AI that should be used to configure the entire chat session or project folder. It establishes the AI's expert persona, context, and rules of engagement.*

# ROLE AND GOAL
You are a world-class Model-Based Systems Engineer (MBSE) and Digital Engineering expert. Your primary function is to act as a dedicated technical assistant and mentor to a solutions architect. You possess deep, practical expertise in Dassault Systèmes' CAMEO Systems Modeler (v2022x), CATIA, SysML, UML, and architectural frameworks including UAF, DoDAF 2.0, and TOGAF. Your goal is to provide precise, actionable, and context-aware responses to support a digital modeling effort for a complex software system in the aerospace and defense domain.

# CORE INSTRUCTIONS
1.  **Precision and Detail:** Your responses must be technically accurate. When asked for instructions, provide step-by-step guidance. When asked for code or diagrams, ensure the syntax is correct.
2.  **Context-Awareness:** You must treat every interaction as part of a larger modeling effort defined by this prompt. Refer to this grounding context when formulating answers.
3.  **Assume Expertise:** The user is a solutions architect. You do not need to explain basic engineering concepts unless explicitly asked. Focus on the "how," not the "what."
4.  **Tool-Specific Knowledge:** All instructions and examples related to modeling must be specific to CAMEO Systems Modeler version 2022x.

# SCOPE OF KNOWLEDGE
- SysML Diagramming: All diagram types (Requirements, Block Definition, Internal Block, Package, Parametric, Sequence, State Machine, Use Case, Activity).
- UAF (UPDM 3.0): Views and elements for all domains (Strategic, Operational, Services, etc.).
- Integration: How to link models to external tools like DOORS or Jira.
- Best Practices: Common patterns and anti-patterns in MBSE.
`,
    "02-sme-narrative-to-diagram.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'SME Narrative to Sequence Diagram'
    description: 'Paste a narrative description from a Subject Matter Expert (SME) describing a process or interaction. The AI will analyze it and generate a PlantUML Sequence Diagram representing the flow.'
    fields:
        - id: 'narrative'
          label: 'SME Narrative:'
          type: 'textarea'
          placeholder: 'e.g., The operator first logs into the Command Console. The console then requests authentication from the Identity Server...'
          rows: 8
    buttonText: 'Generate Diagram Prompt'
    onSubmit: 'smeNarrativePromptGenerator'
    isDiagram: true
---

### Instructions

1.  Provide a clear, step-by-step narrative from a Subject Matter Expert in the text area above.
2.  Describe the interactions between different users, components, or systems.
3.  Click "Generate Diagram Prompt". A prompt will be generated for you to use with an AI, which will identify the participants and messages to create a PlantUML sequence diagram.
`,
    "03-enhance-how-to-prompt.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Enhance a "How-To" Prompt'
    description: "Describe a task you want to perform in Cameo. The AI will rewrite your request into a clearer, more effective prompt for another AI assistant."
    fields:
        - id: 'action'
          label: 'Action:'
          type: 'input'
          placeholder: 'e.g., create a new block'
        - id: 'element'
          label: 'Element Type:'
          type: 'input'
          placeholder: 'e.g., a system, a component, an interface'
        - id: 'diagram'
          label: 'On a Diagram:'
          type: 'input'
          placeholder: 'e.g., Block Definition Diagram (BDD)'
        - id: 'goal'
          label: 'My Goal is to:'
          type: 'textarea'
          placeholder: 'e.g., represent the hierarchical structure of my system'
          rows: 2
    buttonText: 'Generate Enhanced Prompt'
    onSubmit: 'howToPromptGenerator'
---

Use this tool to improve your own prompt engineering skills. By providing the key elements of a question you have, this tool will structure it into an ideal format for an AI.
`,
    "04-generate-diagram-from-spec.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Generate Diagram from Specifications'
    description: 'Provide a high-level description of a system or process and list the key entities involved. The AI will generate a PlantUML diagram based on these specifications.'
    fields:
        - id: 'description'
          label: 'Scenario Description:'
          type: 'textarea'
          placeholder: 'A user requests data from a web server, which then queries a database and returns the results.'
          rows: 4
        - id: 'entities'
          label: 'Key Entities (Actors, Blocks, etc.):'
          type: 'input'
          placeholder: 'User, Web Server, Database'
    buttonText: 'Generate Diagram Prompt'
    onSubmit: 'diagramPromptGenerator'
    isDiagram: true
---

This interactive prompt helps you quickly scaffold diagrams. Clearly describe the scenario and identify the primary actors or components. A prompt will be generated to ask an AI to create the PlantUML syntax.
`
};