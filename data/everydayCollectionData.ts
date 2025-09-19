

export const EVERYDAY_TEMPLATES_CONTENT: Record<string, string> = {
    "01-system-prompt.md": `---
title: 'System Prompt'
---
### System Prompt for Everyday AI Assistant

# ROLE AND GOAL
You are a helpful, creative, and efficient general-purpose AI assistant. Your goal is to help users with a wide variety of tasks, from drafting professional communications to brainstorming creative ideas. You should be friendly, encouraging, and provide clear, well-structured responses.

# CORE INSTRUCTIONS
1.  **Clarity is Key:** Provide responses that are easy to understand and to the point.
2.  **Adaptability:** Adapt your tone and style based on the user's request. Be professional for business tasks and creative for brainstorming tasks.
3.  **Action-Oriented:** When asked for a plan or a list, use formatting like bullet points or numbered lists to make the information actionable.
4.  **Completeness:** Unless the user specifies a very short response, aim to provide a thorough and complete answer.
`,
    "02-email-writer.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Quick Email Writer'
    description: 'Draft a professional email in seconds. Just provide the recipient, the key points, and your desired tone.'
    fields:
        - id: 'recipient'
          label: 'Recipient:'
          type: 'input'
          placeholder: 'e.g., Project Team, Dr. Evans'
        - id: 'key_points'
          label: 'Key Points to Include:'
          type: 'textarea'
          placeholder: 'e.g., - Thank them for the report\n- Ask for clarification on the Q3 budget numbers\n- Confirm meeting for Friday at 10 AM'
          rows: 4
        - id: 'tone'
          label: 'Tone:'
          type: 'select'
          placeholder: 'Select a tone'
          options:
            - value: 'Formal'
              label: 'Formal'
            - value: 'Casual'
              label: 'Casual'
            - value: 'Encouraging'
              label: 'Encouraging'
            - value: 'Direct'
              label: 'Direct'
            - value: 'Persuasive'
              label: 'Persuasive'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Use this tool to quickly generate a prompt for a well-written email. Provide the core information above, and a prompt will be generated for you to use with an AI.
`,
    "03-meeting-summarizer.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Meeting Summarizer'
    description: 'Paste in your meeting transcript or rough notes to generate a clean, structured summary with key takeaways and action items.'
    fields:
        - id: 'transcript'
          label: 'Meeting Transcript or Notes:'
          type: 'textarea'
          placeholder: 'Paste your full text here...'
          rows: 8
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
This tool helps you save time by generating a prompt to automatically identify the most important points from a discussion.
`,
    "04-code-explainer.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Code Explainer'
    description: "Paste a snippet of code in any language, and the AI will explain what it does in plain English."
    fields:
        - id: 'code_snippet'
          label: 'Code Snippet:'
          type: 'textarea'
          placeholder: 'def hello_world():\n    print("Hello, World!")'
          rows: 8
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
A great way to generate a prompt for understanding unfamiliar code or to get a high-level overview of a function or class.
`,
    "05-recipe-generator.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Recipe Generator'
    description: 'List the ingredients you have on hand, and the AI will suggest a recipe you can make.'
    fields:
        - id: 'ingredients'
          label: 'Available Ingredients:'
          type: 'input'
          placeholder: 'e.g., chicken breast, rice, broccoli, soy sauce'
        - id: 'meal_type'
          label: 'Meal Type:'
          type: 'input'
          placeholder: 'e.g., Quick dinner, Healthy lunch'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Never wonder what to cook again. Generate a prompt to ask an AI for a recipe based on what you have.
`,
    "06-trip-planner.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Trip Itinerary Planner'
    description: 'Get a sample itinerary for your next trip. Specify the destination and duration, and get ideas for activities.'
    fields:
        - id: 'destination'
          label: 'Destination:'
          type: 'input'
          placeholder: 'e.g., Paris, France'
        - id: 'duration_in_days'
          label: 'Trip Duration (in days):'
          type: 'input'
          placeholder: 'e.g., 5'
        - id: 'interests'
          label: 'Interests:'
          type: 'input'
          placeholder: 'e.g., Museums, food, hiking'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Kickstart your vacation planning by generating a prompt for a customized itinerary based on your interests.
`,
    "07-pro-con-list.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Pro/Con List Generator'
    description: 'Explore the arguments for and against any decision or topic to help you make an informed choice.'
    fields:
        - id: 'topic_or_decision'
          label: 'Topic or Decision:'
          type: 'input'
          placeholder: 'e.g., Adopting a new software for the team'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Get an unbiased view of any situation by generating a prompt for a balanced list of pros and cons.
`,
    "08-social-media-post.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Social Media Post Crafter'
    description: 'Generate engaging posts for your social media channels. Just provide the topic and the platform.'
    fields:
        - id: 'post_topic'
          label: 'Post Topic:'
          type: 'textarea'
          placeholder: 'e.g., Announcing a new product launch, sharing an interesting article.'
          rows: 3
        - id: 'platform'
          label: 'Platform:'
          type: 'input'
          placeholder: 'e.g., Twitter, LinkedIn, Instagram'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Overcome writer's block by generating a prompt for compelling social media content in an instant.
`,
    "09-resume-improver.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Resume Bullet Point Improver'
    description: 'Turn a simple description of a task into a powerful, action-oriented bullet point for your resume.'
    fields:
        - id: 'task_performed'
          label: 'Task I Performed:'
          type: 'textarea'
          placeholder: 'e.g., I was responsible for managing the project budget and I created weekly reports.'
          rows: 3
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Use action verbs and quantify your achievements by generating a prompt to make your resume stand out.
`,
    "10-brainstorming-partner.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Brainstorming Partner'
    description: 'Feeling stuck? Enter a topic or a problem, and the AI will generate a list of creative ideas and angles to explore.'
    fields:
        - id: 'topic_or_problem'
          label: 'Topic or Problem:'
          type: 'textarea'
          placeholder: 'e.g., Marketing ideas for a new coffee shop, names for a new app.'
          rows: 2
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Generate a prompt to use an AI as a creative partner to generate a wide range of ideas and break through creative blocks.
`
};