
import { Collection, Template } from '../types/index';
import matter from 'gray-matter';
import { MBSE_TEMPLATES_CONTENT } from '../data/mbseCollectionData';
import { EVERYDAY_TEMPLATES_CONTENT } from '../data/everydayCollectionData';
import { MOCK_TEMPLATES_CONTENT } from '../data/mockCollectionData';
import { SOFTWARE_ENGINEERING_TEMPLATES_CONTENT } from '../data/softwareEngineeringCollectionData';

// Helper to parse content into templates
const parseTemplates = (contentMap: Record<string, string>): Template[] => {
    return Object.entries(contentMap).map(([id, content]) => {
        const match = id.match(/^(\d+)[-_ ]?(.*)\.md$/i);
        const order = match ? parseInt(match[1], 10) : Infinity;
        const titleFromFilename = match ? match[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : id.replace('.md', '');

        try {
            const parsed = matter(content);
            const title = parsed.data.title || parsed.data.interactive?.title || titleFromFilename;
            return {
                id,
                title,
                order,
                content,
                interactiveConfig: parsed.data.interactive,
            };
        } catch (e) {
            console.error(`Frontmatter parsing error in ${id}:`, e);
            return { id, title: titleFromFilename, order, content };
        }
    }).sort((a, b) => a.order - b.order);
};


// --- Starter Collections ---
export const loadStarterCollections = (): Collection[] => {
    return [
        {
            id: `starter-${Date.now()}-mbse`,
            name: 'MBSE Modeling',
            templates: parseTemplates(MBSE_TEMPLATES_CONTENT),
        },
        {
            id: `starter-${Date.now()}-swe`,
            name: 'Software Engineering',
            templates: parseTemplates(SOFTWARE_ENGINEERING_TEMPLATES_CONTENT),
        },
         {
            id: `starter-${Date.now()}-everyday`,
            name: 'Everyday Prompts',
            templates: parseTemplates(EVERYDAY_TEMPLATES_CONTENT),
        },
        {
            id: `starter-${Date.now()}-mock`,
            name: 'Mock Test Collection',
            templates: parseTemplates(MOCK_TEMPLATES_CONTENT),
        }
    ];
};

export const createBlankCollection = (name: string): Collection => {
    return {
        id: `collection-${Date.now()}`,
        name,
        templates: [],
    };
};


// --- Import/Export Logic (for sharing via JSON) ---

export const exportCollection = (collection: Collection) => {
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${collection.name.replace(/\s+/g, '_')}_collection.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportTemplateAsMarkdown = (template: Template) => {
    const blob = new Blob([template.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${template.title.replace(/\s+/g, '_')}.md`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importCollection = (): Promise<Collection> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const result = e.target?.result;
                        if (typeof result === 'string') {
                            const parsed = JSON.parse(result);
                            if (parsed.name && Array.isArray(parsed.templates)) {
                                // Re-sort templates just in case
                                parsed.templates.sort((a: Template, b: Template) => a.order - b.order);
                                resolve({
                                    ...parsed,
                                    id: parsed.id || `${Date.now()}-imported`,
                                } as Collection);
                            } else {
                                reject(new Error("Invalid collection file format. Expected a single collection object."));
                            }
                        } else {
                            reject(new Error("Failed to read file content."));
                        }
                    } catch (err) {
                        reject(new Error(`Error parsing JSON file: ${err instanceof Error ? err.message : 'Unknown error'}`));
                    }
                };
                reader.onerror = () => reject(new Error("Error reading file."));
                reader.readAsText(file);
            } else {
                reject(new Error("No file selected."));
            }
        };
        input.click();
    });
};