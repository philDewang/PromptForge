
export interface Field {
    id: string;
    label: string;
    type: 'input' | 'textarea' | 'select' | 'checkbox' | 'file';
    placeholder?: string;
    rows?: number;
    options?: { value: string; label: string }[];
    accept?: string; // e.g., 'image/*', '.txt', 'application/json'
}

export interface InteractiveFrontmatter {
    type: string;
    title: string;
    description: string;
    fields: Field[];
    buttonText: string;
    onSubmit: string; // The name of the function in promptService
    isDiagram?: boolean;
}

export interface Template {
    id: string; // Unique ID (often the filename for starter sets)
    title: string;
    order: number;
    content: string; // The full raw markdown content
    interactiveConfig?: InteractiveFrontmatter;
}

export interface Collection {
    id:string; // Unique ID for the collection
    name: string;
    templates: Template[];
}

export interface AppState {
    collections: Collection[];
    activeCollectionId: string | null;
    activeTemplateId: string | null;
}

export interface AppSettings {
    theme: 'slate' | 'sky' | 'rose';
}

// This is the full shape of the state saved to localStorage
export interface RootState {
    collectionsState: AppState;
    settings: AppSettings;
    editorIsDirty: boolean;
}