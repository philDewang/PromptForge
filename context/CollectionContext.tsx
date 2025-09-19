

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { RootState, Collection, Template, AppSettings } from '../types/index';
import useLocalStorage from '../hooks/useLocalStorage';
import matter from 'gray-matter';

// --- Helper Functions for Reducer Logic ---

const addCollection = (state: RootState, newCollection: Collection): RootState => {
    return {
        ...state,
        collectionsState: {
            ...state.collectionsState,
            collections: [...state.collectionsState.collections, newCollection],
            activeCollectionId: newCollection.id,
            activeTemplateId: newCollection.templates[0]?.id || null,
        },
        editorIsDirty: false,
    };
};

const removeCollection = (state: RootState, collectionIdToRemove: string): RootState => {
    const { collectionsState } = state;
    const remainingCollections = collectionsState.collections.filter(c => c.id !== collectionIdToRemove);
    let newActiveCollectionId = collectionsState.activeCollectionId;
    if (collectionsState.activeCollectionId === collectionIdToRemove) {
        newActiveCollectionId = remainingCollections[0]?.id || null;
    }
    const newActiveTemplateId = remainingCollections.find(c => c.id === newActiveCollectionId)?.templates[0]?.id || null;
    return {
        ...state,
        collectionsState: {
            collections: remainingCollections,
            activeCollectionId: newActiveCollectionId,
            activeTemplateId: newActiveTemplateId,
        },
        editorIsDirty: false,
    };
};

const createTemplate = (state: RootState, { name, content }: { name: string, content?: string }): RootState => {
    const { collectionsState } = state;
    const activeCollection = collectionsState.collections.find(c => c.id === collectionsState.activeCollectionId);
    if (!activeCollection) return state;

    const maxOrder = Math.max(0, ...activeCollection.templates.map(t => t.order).filter(o => o !== Infinity));
    const newOrder = maxOrder + 1;
    const templateId = `${String(newOrder).padStart(2, '0')}-${name.replace(/\s+/g, '-')}.md`;
    const finalContent = content || matter.stringify(`Your new template content goes here.`, { title: name });

    const newTemplate: Template = {
        id: templateId,
        title: name,
        order: newOrder,
        content: finalContent,
    };

    const updatedCollections = collectionsState.collections.map(c => 
        c.id === activeCollection.id 
        ? { ...c, templates: [...c.templates, newTemplate].sort((a,b) => a.order - b.order) } 
        : c
    );

    return {
        ...state,
        collectionsState: {
            ...collectionsState,
            collections: updatedCollections,
            activeTemplateId: newTemplate.id,
        },
        editorIsDirty: false,
    };
};

const updateTemplate = (state: RootState, updatedTemplate: Template): RootState => {
    const { collectionsState } = state;
    const activeCollection = collectionsState.collections.find(c => c.id === collectionsState.activeCollectionId);
    if (!activeCollection) return state;

    const updatedCollections = collectionsState.collections.map(c => 
        c.id === activeCollection.id 
        ? { ...c, templates: c.templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t).sort((a,b) => a.order - b.order) } 
        : c
    );

    return { ...state, collectionsState: { ...collectionsState, collections: updatedCollections }, editorIsDirty: false };
};

const deleteTemplate = (state: RootState, templateIdToDelete: string): RootState => {
    const { collectionsState } = state;
    const activeCollection = collectionsState.collections.find(c => c.id === collectionsState.activeCollectionId);
    if (!activeCollection) return state;
    
    const originalTemplates = activeCollection.templates.sort((a,b)=> a.order - b.order);
    const updatedTemplates = originalTemplates.filter(t => t.id !== templateIdToDelete);
    let newActiveTemplateId = collectionsState.activeTemplateId;
    if (collectionsState.activeTemplateId === templateIdToDelete) {
        const deletedTemplateIndex = originalTemplates.findIndex(t => t.id === templateIdToDelete);
        newActiveTemplateId = updatedTemplates[Math.max(0, deletedTemplateIndex - 1)]?.id || updatedTemplates[0]?.id || null;
    }

    const updatedCollections = collectionsState.collections.map(c => 
        c.id === activeCollection.id 
        ? { ...c, templates: updatedTemplates } 
        : c
    );
    
    return {
        ...state,
        collectionsState: {
            ...collectionsState,
            collections: updatedCollections,
            activeTemplateId: newActiveTemplateId,
        },
        editorIsDirty: false,
    };
};


// --- Reducer and Context Setup ---

type Action =
    | { type: 'SET_ENTIRE_STATE'; payload: RootState }
    | { type: 'ADD_COLLECTION'; payload: Collection }
    | { type: 'REMOVE_COLLECTION'; payload: string }
    | { type: 'RENAME_COLLECTION', payload: { id: string, name: string }}
    | { type: 'SELECT_COLLECTION'; payload: string }
    | { type: 'SELECT_TEMPLATE'; payload: string | null }
    | { type: 'CREATE_TEMPLATE'; payload: { name: string, content?: string } }
    | { type: 'UPDATE_TEMPLATE'; payload: Template }
    | { type: 'DELETE_TEMPLATE'; payload: string }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
    | { type: 'SET_EDITOR_DIRTY'; payload: boolean };

const CollectionStateContext = createContext<RootState | undefined>(undefined);
const CollectionDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

const rootReducer = (state: RootState, action: Action): RootState => {
    const { collectionsState } = state;
    
    switch (action.type) {
        case 'SET_ENTIRE_STATE':
            return action.payload;
        case 'ADD_COLLECTION':
            return addCollection(state, action.payload);
        case 'REMOVE_COLLECTION':
            return removeCollection(state, action.payload);
        case 'CREATE_TEMPLATE':
            return createTemplate(state, action.payload);
        case 'UPDATE_TEMPLATE':
            return updateTemplate(state, action.payload);
        case 'DELETE_TEMPLATE':
            return deleteTemplate(state, action.payload);

        case 'RENAME_COLLECTION': {
            const { id, name } = action.payload;
            return {
                ...state,
                collectionsState: {
                    ...collectionsState,
                    collections: collectionsState.collections.map(c => c.id === id ? { ...c, name } : c),
                }
            }
        }
        case 'SELECT_COLLECTION': {
            const selectedCollection = collectionsState.collections.find(c => c.id === action.payload);
            return {
                ...state,
                collectionsState: {
                    ...collectionsState,
                    activeCollectionId: action.payload,
                    activeTemplateId: selectedCollection?.templates.sort((a,b) => a.order - b.order)[0]?.id || null,
                },
                editorIsDirty: false,
            };
        }
        case 'SELECT_TEMPLATE': {
            return {
                ...state,
                collectionsState: { ...collectionsState, activeTemplateId: action.payload },
                editorIsDirty: false,
            };
        }
        case 'UPDATE_SETTINGS': {
            return {
                ...state,
                settings: { ...state.settings, ...action.payload }
            };
        }
        case 'SET_EDITOR_DIRTY': {
            return { ...state, editorIsDirty: action.payload };
        }
        default: {
            throw new Error(`Unhandled action type`);
        }
    }
};

const getInitialState = (): RootState => ({
    collectionsState: {
        collections: [],
        activeCollectionId: null,
        activeTemplateId: null,
    },
    settings: {
        theme: 'slate',
    },
    editorIsDirty: false,
});

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [storedState, setStoredState] = useLocalStorage<RootState>('promptforge-state', getInitialState());
    
    const reducerWithPersistence = (state: RootState, action: Action) => {
        const newState = rootReducer(state, action);
        setStoredState(newState);
        return newState;
    };
    
    const [state, dispatch] = useReducer(reducerWithPersistence, storedState);

    return (
        <CollectionStateContext.Provider value={state}>
            <CollectionDispatchContext.Provider value={dispatch}>
                {children}
            </CollectionDispatchContext.Provider>
        </CollectionStateContext.Provider>
    );
};

export const useCollectionState = (): RootState => {
    const context = useContext(CollectionStateContext);
    if (context === undefined) {
        throw new Error('useCollectionState must be used within a CollectionProvider');
    }
    return context;
};

export const useCollectionDispatch = () => {
    const context = useContext(CollectionDispatchContext);
    if (context === undefined) {
        throw new Error('useCollectionDispatch must be used within a CollectionProvider');
    }
    return context;
};