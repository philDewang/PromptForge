

export const SOFTWARE_ENGINEERING_TEMPLATES_CONTENT: Record<string, string> = {
    "01-system-prompt.md": `---
title: 'System Prompt'
---
### System Prompt for Software Engineering

# ROLE AND GOAL
You are a world-class Principal Software Engineer. You serve as an expert technical assistant to a fellow software developer. You have deep, polyglot expertise across multiple programming languages (including Python, JavaScript/TypeScript, Java, Go, and C#), software architectures (Monolithic, Microservices, Serverless), design patterns, and modern development practices. Your goal is to provide code, explanations, and guidance that is clean, efficient, production-ready, and follows industry best practices (SOLID, DRY, YAGNI).

# CORE INSTRUCTIONS
1.  **Code First, Explain Second:** When asked to generate code, provide the complete, clean code block first. Follow it with a concise explanation of the key decisions, patterns, and trade-offs.
2.  **Idiomatic and Modern:** The code you write must be idiomatic for the specified language and use modern syntax and features (e.g., Python 3.10+, ES6+ for JavaScript).
3.  **Assume Technical Competence:** The user is a developer. You do not need to explain fundamental programming concepts. Focus on the specifics of the solution.
4.  **Production-Ready and Secure:** Your solutions should be robust. Consider edge cases, performance implications, and security vulnerabilities (e.g., SQL injection, XSS). When suggesting solutions, briefly mention these considerations.
5.  **Be Explicit with Dependencies:** If your code requires external libraries or packages, explicitly state them (e.g., \`npm install axios\`, \`pip install requests\`).

# SCOPE OF KNOWLEDGE
- **Languages:** Python, JavaScript, TypeScript, Java, Go, C#, SQL
- **Frameworks:** React, Node.js, Django, Flask, Spring Boot
- **Infrastructure & DevOps:** Docker, docker-compose, CI/CD (GitHub Actions, GitLab CI), Regex
- **Databases:** PostgreSQL, MySQL, MongoDB, Redis
- **Architecture:** REST APIs, gRPC, Message Queues, Design Patterns
- **Testing:** Unit Testing (Jest, PyTest, JUnit), Integration Testing concepts
`,
    "02-code-refactor.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Code Refactor Assistant'
    description: 'Paste a piece of legacy or messy code. The AI will refactor it to improve readability, efficiency, and maintainability, then explain the changes.'
    fields:
        - id: 'language'
          label: 'Programming Language'
          type: 'input'
          placeholder: 'e.g., Python, JavaScript'
        - id: 'refactoring_goal'
          label: 'Primary Goal'
          type: 'select'
          placeholder: 'Select a goal'
          options:
            - value: 'Improve readability and clarity'
              label: 'Improve Readability'
            - value: 'Increase performance and efficiency'
              label: 'Increase Performance'
            - value: 'Add comments and documentation'
              label: 'Add Documentation'
            - value: 'Convert to a more modern style'
              label: 'Modernize Syntax'
        - id: 'code_snippet'
          label: 'Code to Refactor'
          type: 'textarea'
          placeholder: 'Paste your code snippet here...'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Provide a code snippet and its language. A prompt will be generated to ask an AI to apply best practices like SOLID principles and design patterns to improve it.
`,
    "03-unit-test-generator.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Unit Test Generator'
    description: 'Provide a function or class, and the AI will generate a suite of unit tests to cover its behavior, including edge cases.'
    fields:
        - id: 'language_and_framework'
          label: 'Language & Testing Framework'
          type: 'input'
          placeholder: 'e.g., JavaScript with Jest, Python with PyTest'
        - id: 'include_edge_cases'
          label: 'Include tests for edge cases (e.g., null inputs, empty arrays)'
          type: 'checkbox'
          placeholder: ''
        - id: 'code_to_test'
          label: 'Function or Class to Test'
          type: 'textarea'
          placeholder: 'Paste your function or class here...'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Specify the testing framework you are using to generate a prompt for idiomatic and effective unit tests for your code.
`,
    "04-api-endpoint-design.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'REST API Endpoint Design'
    description: 'Describe a data resource, and the AI will design a set of RESTful API endpoints for CRUD operations, including request/response examples.'
    fields:
        - id: 'resource_name'
          label: 'Resource Name'
          type: 'input'
          placeholder: 'e.g., User, Product, Order'
        - id: 'resource_attributes'
          label: 'Resource Attributes (comma-separated)'
          type: 'textarea'
          placeholder: 'e.g., id (int), username (string), email (string), created_at (datetime)'
          rows: 4
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
This tool helps you quickly generate a prompt to scaffold a well-structured REST API based on standard conventions.
`,
    "05-algorithm-explainer.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Algorithm & Big O Explainer'
    description: "Paste a complex algorithm or function. The AI will explain its purpose in plain English and provide its Big O time and space complexity."
    fields:
        - id: 'algorithm_code'
          label: 'Algorithm Code'
          type: 'textarea'
          placeholder: 'Paste your sorting algorithm, search function, etc., here.'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Use this to generate a prompt for understanding the performance characteristics of your code or to study common algorithms.
`,
    "06-regex-generator.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Regex Generator'
    description: 'Describe the text pattern you want to match, and the AI will generate the corresponding regular expression.'
    fields:
        - id: 'pattern_description'
          label: 'Describe the pattern to match'
          type: 'textarea'
          placeholder: 'e.g., Match an email address. Match a date in YYYY-MM-DD format.'
          rows: 3
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Avoid the headache of writing complex regex. Just describe what you need to generate a prompt for the AI.
`,
    "07-cicd-pipeline-setup.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'CI/CD Pipeline Starter'
    description: 'Describe your tech stack and deployment target. The AI will generate a starter CI/CD pipeline configuration file.'
    fields:
        - id: 'ci_cd_platform'
          label: 'CI/CD Platform'
          type: 'select'
          placeholder: 'Select a platform'
          options:
              - value: 'GitHub Actions'
                label: 'GitHub Actions'
              - value: 'GitLab CI'
                label: 'GitLab CI'
              - value: 'Jenkinsfile'
                label: 'Jenkins'
              - value: 'Azure Pipelines'
                label: 'Azure Pipelines'
        - id: 'tech_stack'
          label: 'Application Tech Stack'
          type: 'input'
          placeholder: 'e.g., Node.js with React, Python Django with PostgreSQL'
        - id: 'deployment_target'
          label: 'Deployment Target'
          type: 'input'
          placeholder: 'e.g., AWS S3, Docker Hub, Heroku'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Generate a prompt to get a solid starting point for your automated build, test, and deployment pipeline.
`,
    "08-dockerization-setup.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Dockerization Setup'
    description: "Describe your application's language, framework, and dependencies. The AI will generate a multi-stage Dockerfile and a docker-compose.yml."
    fields:
        - id: 'application_details'
          label: 'Application Details'
          type: 'textarea'
          placeholder: 'e.g., A Python Flask app that connects to a Redis cache. It uses requirements.txt for dependencies.'
          rows: 4
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Quickly generate a prompt to containerize your applications for consistent development and deployment environments.
`,
    "09-code-review-assistant.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Code Review Assistant'
    description: 'Paste a code snippet for review. The AI will act as a peer reviewer, checking for bugs, style issues, and performance improvements.'
    fields:
        - id: 'language'
          label: 'Programming Language'
          type: 'input'
          placeholder: 'e.g., TypeScript, Go'
        - id: 'code_for_review'
          label: 'Code to Review'
          type: 'textarea'
          placeholder: 'Paste a function, class, or pull request diff here.'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Generate a prompt to get a second pair of eyes on your code before committing or asking a teammate.
`,
    "10-database-schema-design.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Database Schema Design'
    description: 'Describe your data entities and their relationships in plain English. The AI will generate the SQL DDL for creating the tables.'
    fields:
        - id: 'database_type'
          label: 'Database Type'
          type: 'input'
          placeholder: 'e.g., PostgreSQL, MySQL'
        - id: 'schema_description'
          label: 'Schema Description'
          type: 'textarea'
          placeholder: 'e.g., I need a "users" table and a "posts" table. Each post must belong to a user. Users have an email and password hash.'
          rows: 6
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Translate your application's data model into a formal database schema by generating a detailed prompt.
`,
    "11-tech-documentation-writer.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Technical Documentation Writer'
    description: 'Paste a function or class. The AI will generate clear, concise technical documentation for it, including parameters, return values, and examples.'
    fields:
        - id: 'documentation_format'
          label: 'Documentation Format'
          type: 'input'
          placeholder: 'e.g., Markdown, JSDoc, Python Docstrings'
        - id: 'code_to_document'
          label: 'Code to Document'
          type: 'textarea'
          placeholder: 'Paste a function or class here.'
          rows: 8
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Save time on documentation. Generate a prompt to get a high-quality first draft from an AI.
`,
    "12-architectural-pattern-selector.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Architectural Pattern Selector'
    description: 'Describe a technical problem or requirement. The AI will suggest suitable architectural patterns and explain the trade-offs.'
    fields:
        - id: 'problem_description'
          label: 'Problem or Requirement'
          type: 'textarea'
          placeholder: 'e.g., Our monolith is hard to scale and deploy. We need to process millions of events asynchronously. Our front-end needs real-time data updates from the server.'
          rows: 4
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Generate a prompt to leverage expert knowledge to choose the right architecture for your problem.
`,
    "13-bug-report-analysis.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Bug Report Analyzer'
    description: 'Paste a user-submitted bug report. The AI will analyze it, suggest potential root causes, and recommend initial debugging steps.'
    fields:
        - id: 'bug_report'
          label: 'Bug Report'
          type: 'textarea'
          placeholder: 'Paste the full bug report, including user description, error messages, and environment details.'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Generate a prompt to get a head start on debugging by identifying the most likely areas to investigate.
`,
    "14-user-story-to-tasks.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'User Story to Technical Tasks'
    description: 'Provide a user story, and the AI will break it down into a checklist of actionable technical tasks for developers.'
    fields:
        - id: 'user_story'
          label: 'User Story'
          type: 'textarea'
          placeholder: 'e.g., As a user, I want to be able to reset my password via email so that I can regain access to my account if I forget it.'
          rows: 4
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Bridge the gap between product requirements and engineering tasks by generating a detailed prompt.
`,
    "15-commit-message-generator.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Commit Message Generator'
    description: 'Briefly describe the changes you made. The AI will generate a well-formatted commit message following the Conventional Commits specification.'
    fields:
        - id: 'change_description'
          label: 'Description of Changes'
          type: 'textarea'
          placeholder: 'e.g., fixed the off-by-one error in the pagination logic. added a new button to the user profile page. updated the readme.'
          rows: 3
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Write clean, standardized commit messages by generating a prompt for an AI to follow.
`,
    "16-code-commenter.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Code Commenter'
    description: 'Paste a code snippet that is missing comments. The AI will add clear, idiomatic comments to explain the logic.'
    fields:
        - id: 'language'
          label: 'Programming Language'
          type: 'input'
          placeholder: 'e.g., Java, C#'
        - id: 'code_snippet'
          label: 'Code to Comment'
          type: 'textarea'
          placeholder: 'Paste your uncommented code here.'
          rows: 10
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Improve the maintainability of your code by generating a prompt for adding helpful comments.
`,
    "17-analyze-ui-screenshot.md": `---
interactive:
    type: 'InteractivePrompt'
    title: 'Analyze UI Screenshot'
    description: 'Upload a screenshot of a user interface. The AI will analyze it and provide feedback or generate code for it.'
    fields:
        - id: 'ui_screenshot'
          label: 'UI Screenshot'
          type: 'file'
          placeholder: 'Upload an image'
          accept: 'image/*'
        - id: 'analysis_goal'
          label: 'Analysis Goal'
          type: 'select'
          placeholder: 'What do you want to do?'
          options:
            - value: 'Provide usability feedback and suggest improvements'
              label: 'Get Usability Feedback'
            - value: 'Generate HTML and CSS code for this layout'
              label: 'Generate HTML/CSS'
            - value: 'Generate a React component for this UI'
              label: 'Generate React Component'
    buttonText: 'Generate Prompt'
    onSubmit: 'genericPromptGenerator'
---
Use this template to get AI-powered feedback on UI/UX designs or to quickly scaffold front-end code from a visual mock-up.
`,
};