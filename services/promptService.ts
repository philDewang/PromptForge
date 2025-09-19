
// --- Prompt Generators for Interactive Prompts ---
// These functions take form data and construct a string prompt for the user to copy.

const formatInputsForPrompt = (formData: Record<string, any>): string => {
    return Object.entries(formData)
        .map(([key, value]) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            // Skip empty/falsy values unless it's an explicit boolean `false`
            if (!value && typeof value !== 'boolean') {
                return null;
            }
            if (typeof value === 'object' && value !== null && value.data && value.name) {
                // Handle file object
                return `### ${formattedKey}\n- **File Name:** ${value.name}\n- **MIME Type:** ${value.mimeType}\n- **Content (Base64):**\n\`\`\`\n${value.data}\n\`\`\``;
            }
            if (typeof value === 'boolean') {
                return `### ${formattedKey}\n${value ? 'Enabled' : 'Disabled'}`;
            }
            return `### ${formattedKey}\n${String(value).trim()}`;
        })
        .filter(Boolean)
        .join('\n\n');
};

const createFullPrompt = (systemPrompt: string, userPrompt: string): string => {
    return `# [SYSTEM INSTRUCTIONS]\n\n${systemPrompt.trim()}\n\n---\n\n# [USER REQUEST]\n\n${userPrompt.trim()}`;
};

const howToPromptGenerator = (formData: Record<string, any>, systemPrompt: string): string => {
    const { action, element, diagram, goal } = formData;
    const userPrompt = `I need to perform the following action in Cameo 2022x:
### Action
${action}

### Element Type
${element}

### Target Diagram
${diagram}

### Ultimate Goal
${goal}

Please provide clear, step-by-step instructions.`;
    return createFullPrompt(systemPrompt, userPrompt);
};

const diagramPromptGenerator = (formData: Record<string, any>, systemPrompt: string): string => {
    const { description, entities } = formData;
    const userPrompt = `Generate a UML Sequence Diagram in PlantUML syntax based on the following specifications:
### Scenario Description
${description}

### Key Entities (Actors/Blocks)
${entities}`;
    return createFullPrompt(systemPrompt, userPrompt);
};

const smeNarrativePromptGenerator = (formData: Record<string, any>, systemPrompt: string): string => {
    const { narrative } = formData;
    const userPrompt = `Analyze the following SME narrative and translate it into a UML Sequence Diagram in PlantUML syntax. Identify the actors and systems from the narrative to use as participants.
### SME Narrative
> ${narrative.replace(/\n/g, '\n> ')}`;
    return createFullPrompt(systemPrompt, userPrompt);
};

const genericPromptGenerator = (formData: Record<string, any>, systemPrompt: string): string => {
    const formattedInputs = formatInputsForPrompt(formData);
    const userPrompt = `Based on the following inputs, generate the requested output.\n\n${formattedInputs}`;
    return createFullPrompt(systemPrompt, userPrompt);
};


// This map allows the markdown frontmatter to reference a generator function by name
export const promptGenerators: Record<string, (formData: Record<string, any>, systemPrompt: string) => string> = {
    howToPromptGenerator,
    diagramPromptGenerator,
    smeNarrativePromptGenerator,
    genericPromptGenerator,
};