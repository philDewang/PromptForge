

import React, { useState, useEffect } from 'react';
import { useCollectionState, useCollectionDispatch } from '../../context/CollectionContext';
import { importCollection, exportCollection } from '../../services/dataService';
import { generateTemplateFromDescription } from '../../services/geminiService';
import matter from 'gray-matter';

import AddCollectionModal from '../modals/AddCollectionModal';
import InputModal from '../modals/InputModal';
import NewTemplateModal from '../modals/NewTemplateModal';
import AIAssistedTemplateModal from '../modals/AIAssistedTemplateModal';
import TemplateWizardModal from '../modals/TemplateWizardModal';
import AppSettingsModal from '../modals/AppSettingsModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import Loader from '../ui/Loader';
import UserGuideModal from '../modals/UserGuideModal';


type ModalType = 'none' | 'addCollection' | 'renameCollection' | 'newTemplate' | 'aiTemplate' | 'wizardTemplate' | 'appSettings' | 'deleteCollectionConfirm' | 'unsavedChangesConfirm';

const Sidebar: React.FC = () => {
    const state = useCollectionState();
    if (!state) return null;
    const { collectionsState, settings, editorIsDirty } = state;
    const { collections, activeCollectionId, activeTemplateId } = collectionsState;
    const dispatch = useCollectionDispatch();

    const [activeModal, setActiveModal] = useState<ModalType>('none');
    const [isGenerating, setIsGenerating] = useState(false);
    const [nextAction, setNextAction] = useState<(() => void) | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const activeCollection = collections.find(c => c.id === activeCollectionId);
    const activeTemplate = activeCollection?.templates.find(t => t.id === activeTemplateId);
    const collectionSystemPrompt = activeCollection?.templates.find(t => t.order === 1)?.content || 'You are a helpful AI assistant.';

    // Clear search when collection changes for better UX
    useEffect(() => {
        setSearchQuery('');
    }, [activeCollectionId]);


    const handleNavigation = (action: () => void) => {
        if (editorIsDirty) {
            setNextAction(() => action);
            setActiveModal('unsavedChangesConfirm');
        } else {
            action();
        }
    };

    const handleSelectCollection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const collectionId = e.target.value;
        handleNavigation(() => dispatch({ type: 'SELECT_COLLECTION', payload: collectionId }));
    };

    const handleSelectTemplate = (templateId: string) => {
        handleNavigation(() => dispatch({ type: 'SELECT_TEMPLATE', payload: templateId }));
    };

    const handleNewTemplate = (name: string, content?: string) => {
        const action = () => {
            dispatch({ type: 'CREATE_TEMPLATE', payload: { name, content } });
            setActiveModal('none');
        };
        handleNavigation(action);
    };

    const handleCreateTemplateWithAI = async (description: string) => {
        if (!activeCollection) return;
        setIsGenerating(true);
        setActiveModal('none');
        try {
            const content = await generateTemplateFromDescription(description, activeCollection, collectionSystemPrompt);
            const { data } = matter(content);
            const name = data.interactive?.title || 'AI Generated Template';
            dispatch({ type: 'CREATE_TEMPLATE', payload: { name, content } });
        } catch (error) {
            alert(`Failed to generate template: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleImportCollection = async () => {
        try {
            const newCollection = await importCollection();
            dispatch({ type: 'ADD_COLLECTION', payload: newCollection });
        } catch (error) {
            alert(`Failed to import collection: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    
    const handleExportCollection = () => {
        if (activeCollection) {
            exportCollection(activeCollection);
        }
    };

    const handleDeleteCollection = () => {
        if (!activeCollection) return;
        setActiveModal('deleteCollectionConfirm');
    };

    const confirmDeleteCollection = () => {
        if (!activeCollection) return;
        dispatch({ type: 'REMOVE_COLLECTION', payload: activeCollection.id });
        setActiveModal('none');
    };

    const onUnsavedChangesConfirm = () => {
        if (nextAction) {
            dispatch({ type: 'SET_EDITOR_DIRTY', payload: false });
            nextAction();
        }
        setNextAction(null);
        setActiveModal('none');
    };

    const filteredTemplates = activeCollection?.templates.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <>
            <AddCollectionModal
                isOpen={activeModal === 'addCollection'}
                onClose={() => setActiveModal('none')}
                onImport={handleImportCollection}
            />
            <InputModal 
                isOpen={activeModal === 'renameCollection'}
                onClose={() => setActiveModal('none')}
                onSubmit={(name) => dispatch({ type: 'RENAME_COLLECTION', payload: { id: activeCollectionId!, name }})}
                title={'Rename Collection'}
                label={'New Collection Name:'}
                initialValue={activeCollection?.name}
                submitText={'Rename'}
            />
            <NewTemplateModal
                isOpen={activeModal === 'newTemplate'}
                onClose={() => setActiveModal('none')}
                onSubmitBlank={handleNewTemplate}
                onSelectAI={() => setActiveModal('aiTemplate')}
                onSelectWizard={() => setActiveModal('wizardTemplate')}
            />
            <AIAssistedTemplateModal
                isOpen={activeModal === 'aiTemplate'}
                onClose={() => setActiveModal('none')}
                onSubmit={handleCreateTemplateWithAI}
            />
            <TemplateWizardModal
                isOpen={activeModal === 'wizardTemplate'}
                onClose={() => setActiveModal('none')}
                onSubmit={handleNewTemplate}
            />
            <AppSettingsModal 
                isOpen={activeModal === 'appSettings'}
                onClose={() => setActiveModal('none')}
                currentSettings={settings}
            />
            <UserGuideModal 
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
            {activeCollection && (
                <ConfirmationModal
                    isOpen={activeModal === 'deleteCollectionConfirm'}
                    onClose={() => setActiveModal('none')}
                    onConfirm={confirmDeleteCollection}
                    title={`Delete Collection: ${activeCollection.name}`}
                    message={`This action cannot be undone. This will permanently delete the "${activeCollection.name}" collection and all its templates. Please type the collection name to confirm.`}
                    confirmText="Delete"
                    itemName={activeCollection.name}
                />
            )}
            <ConfirmationModal
                isOpen={activeModal === 'unsavedChangesConfirm'}
                onClose={() => setActiveModal('none')}
                onConfirm={onUnsavedChangesConfirm}
                title="Unsaved Changes"
                message="You have unsaved changes. Are you sure you want to discard them and continue?"
                confirmText="Discard Changes"
            />
            
            <aside className="w-72 bg-[rgb(var(--color-sidebar-bg))] text-[rgb(var(--color-sidebar-text))] flex flex-col shadow-lg flex-shrink-0">
                <div className="p-4 border-b border-[rgb(var(--color-border))]">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-[rgb(var(--color-sidebar-text-accent))]">PromptForge AI</h1>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setIsGuideOpen(true)} className="text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-sidebar-text-accent))]" aria-label="Open User Guide">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => setActiveModal('appSettings')} className="text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-sidebar-text-accent))]" aria-label="Application Settings">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    <label htmlFor="collection-select" className="text-xs text-[rgb(var(--color-text-tertiary))]">Current Collection:</label>
                    <select 
                        id="collection-select"
                        value={activeCollectionId || ''}
                        onChange={handleSelectCollection}
                        className="w-full mt-1 p-2 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-sidebar-text-accent))] text-sm focus:ring-[rgb(var(--color-accent))] focus:border-[rgb(var(--color-accent))]"
                        aria-label="Select a collection"
                    >
                        {collections.map(collection => (
                            <option key={collection.id} value={collection.id}>{collection.name}</option>
                        ))}
                    </select>

                    <div className="flex space-x-2 mt-2">
                        <button onClick={() => setActiveModal('addCollection')} className="flex-1 text-xs py-1 bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-border))] rounded">Add Collection...</button>
                        <button onClick={() => setActiveModal('renameCollection')} disabled={!activeCollection} className="flex-1 text-xs py-1 bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-border))] rounded disabled:opacity-50 disabled:cursor-not-allowed">Rename</button>
                        <button onClick={handleDeleteCollection} disabled={!activeCollection} className="flex-1 text-xs py-1 bg-red-800/50 hover:bg-red-800/80 rounded disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                    </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto">
                    <div className="px-4 pt-4 pb-2">
                         <div className="flex justify-between items-center mb-2">
                            <h2 className="text-sm font-semibold text-[rgb(var(--color-text-tertiary))] uppercase">Templates</h2>
                            {isGenerating && <Loader />}
                         </div>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                             <input
                                type="search"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-2 py-1.5 text-sm bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md text-[rgb(var(--color-sidebar-text-accent))] focus:ring-[rgb(var(--color-accent))] focus:border-[rgb(var(--color-accent))]"
                                aria-label="Search templates"
                            />
                        </div>
                    </div>
                    {filteredTemplates.length > 0 ? (
                        <ul>
                            {filteredTemplates.map(template => (
                                <li key={template.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSelectTemplate(template.id);
                                        }}
                                        className={`block px-4 py-2 text-sm truncate ${
                                            activeTemplate?.id === template.id
                                                ? 'bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-text))] font-semibold'
                                                : 'hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-[rgb(var(--color-sidebar-text-accent))]'
                                        }`}
                                        title={template.title}
                                    >
                                        {template.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="px-4 py-2 text-sm text-[rgb(var(--color-text-tertiary))] italic">
                            {activeCollection && activeCollection.templates.length > 0 ? 'No templates match your search.' : ''}
                        </p>
                    )}
                </nav>
                
                <div className="p-4 border-t border-[rgb(var(--color-border))] space-y-2">
                     <button
                        onClick={() => {
                             if (editorIsDirty) {
                                setNextAction(() => () => setActiveModal('newTemplate'));
                                setActiveModal('unsavedChangesConfirm');
                            } else {
                                setActiveModal('newTemplate');
                            }
                        }}
                        disabled={!activeCollection}
                        className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-accent))] focus:ring-offset-[rgb(var(--color-sidebar-bg))] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        New Template...
                    </button>
                     <button
                        onClick={handleExportCollection}
                        disabled={!activeCollection}
                        className="w-full text-center px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-sidebar-text))] hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-[rgb(var(--color-sidebar-text-accent))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-accent))] focus:ring-offset-[rgb(var(--color-sidebar-bg))] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Export Collection as JSON
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;