

export const MOCK_TEMPLATES_CONTENT: Record<string, string> = {
    "01-system-prompt.md": `---
title: "System Prompt"
---
# System Prompt for Mock Collection
You are a test assistant. Respond to all prompts with the phrase "Test successful." followed by a brief, generic answer related to the user's input.
`,
    "02-simple-markdown.md": `---
title: "Simple Markdown"
---

## Simple Markdown Test

This template is for testing basic Markdown rendering.

- It has a list.
- With a few items.

And some **bold** and *italic* text.
`,
    "03-interactive-test.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Interactive Form Test'
    description: 'A test for a basic interactive prompt with multiple field types.'
    fields:
        - id: 'text_input'
          label: 'Text Input:'
          type: 'input'
          placeholder: 'Enter any text here'
        - id: 'text_area'
          label: 'Text Area:'
          type: 'textarea'
          placeholder: 'Enter a longer piece of text...'
          rows: 3
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
This template is for testing the rendering and functionality of interactive prompts.
`,
    "04-diagram-test.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Diagram Generation Test'
    description: 'A test for the diagram generation functionality.'
    fields:
        - id: 'description'
          label: 'Scenario:'
          type: 'input'
          placeholder: 'A simple A to B interaction'
        - id: 'entities'
          label: 'Entities:'
          type: 'input'
          placeholder: 'A, B'
    buttonText: 'Generate Diagram Prompt'
    onSubmit: 'diagramPromptGenerator'
    isDiagram: true
---
This template tests the \`isDiagram\` flag and the \`diagramPromptGenerator\` submission handler.
`,
    "05-long-document.md": `---
title: "Scrolling Test"
---
## Long Document for Scrolling Test

This document contains a large amount of text to test the scrolling behavior of the template viewer pane.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam.

Fusce interdum. Nulla quis sem. Integer id magna. Cras commodo, magna nec suscipit egestas, erat quam dapibus lacus, eget dapibus justo justo et ante. Maecenas consequat, magna sed congue lacinia, lectus sem commodo ante, non rutrum odio augue at ante. Maecenas vitae tellus. Proin nisl. Nullam suscipit, nisi sed pellentesque mollis, mauris tortor viverra urna, eget feugiat turpis nisl eu enim. Donec pede. Proin nunc. Vestibulum et mi. Fusce tellus.

Donec vel neque. Nulla eros. Vivamus ut est. Vivamus et sapien. Proin sodales. Nam sit amet magna. Aliquam erat volutpat. In hac habitasse platea dictumst. Morbi sit amet quam. In hac habitasse platea dictumst. Nulla facilisi.

Aenean ac massa. In hac habitasse platea dictumst. Praesent eget quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nam eget sapien. Quisque vitae nisl. Vivamus vel magna. Nulla facilisi. Donec at pede. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis at mi.

Etiam bibendum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Curabitur vel quam. Vivamus accumsan, enim sed consectetuer tincidunt, ipsum enim vehicula erat, quis consectetuer neque justo et pede. Vestibulum et mi. In hac habitasse platea dictumst. Aliquam erat volutpat. Fusce quis turpis. Integer in sem.
`,
    "06-editable-prompt.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Editable Prompt Test'
    description: 'This prompt has pre-existing frontmatter to test the form editor.'
    fields:
        - id: 'first_name'
          label: 'First Name'
          type: 'input'
          placeholder: 'e.g., Jane'
        - id: 'last_name'
          label: 'Last Name'
          type: 'input'
          placeholder: 'e.g., Doe'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Use the "Edit" button to see how this prompt's configuration appears in the new Form Editor.
`
};