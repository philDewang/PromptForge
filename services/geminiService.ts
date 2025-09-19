

import { GoogleGenAI } from "@google/genai";
import { Collection } from "../types/index";

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const checkApiKey = () => {
    if (!ai) {
        throw new Error("API_KEY environment variable not set. Please set it in your environment to use the Gemini API.");
    }
};

export const callGemini = async (userQuery: string, systemPrompt: string): Promise<string> => {
    checkApiKey();
    const model = 'gemini-2.5-flash'; // Hardcoded as per user request
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userQuery,
            config: { systemInstruction: systemPrompt }
        });
        
        const text = response.text;
        if (text) {
            return text;
        } else {
            const finishReason = response.candidates?.[0]?.finishReason;
            if (finishReason && finishReason !== 'STOP') {
                 throw new Error(`Generation stopped for reason: ${finishReason}.`);
            }
            return "The model returned an empty response. This may be due to the prompt or safety filters.";
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error(`Failed to get a response from the AI. Details: ${error instanceof Error ? error.message : String(error)}`);
    }
};


export const generateTemplateFromDescription = async (description: string, collection: Collection, collectionSystemPrompt: string): Promise<string> => {
    const systemPrompt = `You are an expert in creating AI prompt templates. Your task is to generate a complete Markdown file content based on a user's description. The output must be a single block of text containing valid YAML frontmatter and Markdown body.

The user is working in a collection named "${collection.name}". This collection has a specific context and purpose, defined by the following system prompt:
---
${collectionSystemPrompt}
---
Use the context from this system prompt to inform the generated content. The new template should be thematically consistent with the collection.

The frontmatter should define an interactive form. It must include:
- type: 'InteractivePrompt'
- title: A suitable title for the template.
- description: A brief, user-friendly description of what the template does.
- fields: An array of input fields. Each field needs an id, label, type ('input' or 'textarea'), and a placeholder.
- buttonText: Action-oriented text for the button, like "Generate Prompt" or "Create Snippet".
- onSubmit: 'genericPromptGenerator' (You must always use this value).

The body of the Markdown should provide simple instructions or context for the user.

Example Output Structure:
---
interactive:
    type: 'InteractivePrompt'
    title: 'Example Title'
    description: 'This is an example description.'
    fields:
        - id: 'example_id'
          label: 'Example Label'
          type: 'input'
          placeholder: 'e.g., Enter some text'
    buttonText: 'Generate Example'
    onSubmit: 'genericPromptGenerator'
---

This is the markdown body with instructions for the user.

---
Now, generate the complete markdown file content for the following user request. Return ONLY the markdown content, with no other explanation.`;

    return callGemini(description, systemPrompt);
};
