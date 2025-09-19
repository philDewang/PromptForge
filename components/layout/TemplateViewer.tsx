import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import InteractivePrompt from '../ui/InteractivePrompt';
import FormEditor from '../ui/FormEditor';
import SimpleEditor from '../ui/SimpleEditor';
import { exportTemplateAsMarkdown } from '../../services/dataService';
import { useCollectionState, useCollectionDispatch } from '../../context/CollectionContext';
import { Template } from '../../types/index';
import ConfirmationModal from '../modals/ConfirmationModal';

type EditMode = 'simple' | 'form' | 'raw' | 'json' | 'html';

const TemplateViewer: React.FC = () => {
    const state = useCollectionState();
    if (!state) return null;
    const { collections, activeCollectionId, activeTemplateId } = state.collectionsState;
    const editorIsDirty = state.editorIsDirty;
    const dispatch = useCollectionDispatch();

    const activeCollection = collections.find(c => c.id === activeCollectionId);
    const template = activeCollection?.templates.find(t => t.id === activeTemplateId);
    const systemPrompt = activeCollection?.templates.find(t => t.order === 1)?.content || 'You are a helpful assistant.';

    const [isEditing, setIsEditing] = useState(false);
    const [editMode, setEditMode] = useState<EditMode>('simple');
    
    // State for edited content in different modes
    const [editedRawContent, setEditedRawContent] = useState(template?.content || '');
    const [editedJson, setEditedJson] = useState('');
    const [editedHtml, setEditedHtml] = useState('');

    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // This effect ensures that when a new template is selected, the local state resets.
    useEffect(() => {
        if (template) {
            const { data, content } = matter(template.content);
            // Set content for all editor modes
            setEditedRawContent(template.content);
            setEditedJson(JSON.stringify(data, null, 2));
            setEditedHtml(content);
            
            setIsEditing(false);
            setJsonError(null);
            
            // Default to form editor for interactive, simple editor otherwise
            setEditMode(data.interactive ? 'form' : 'simple');
        }
    }, [template]);

    if (!template) {
        return null;
    }
    
    const { data: currentData } = matter(template.content);
    const interactiveConfig = currentData.interactive;
    const isLocked = currentData.locked === true;

    const handleContentUpdate = (newContent: string) => {
        setEditedRawContent(newContent);
        if (!editorIsDirty) {
            dispatch({ type: 'SET_EDITOR_DIRTY', payload: true });
        }
    };
    
    const handleJsonUpdate = (newJson: string) => {
        setEditedJson(newJson);
         if (!editorIsDirty) {
            dispatch({ type: 'SET_EDITOR_DIRTY', payload: true });
        }
    };

    const handleHtmlUpdate = (newHtml: string) => {
        setEditedHtml(newHtml);
         if (!editorIsDirty) {
            dispatch({ type: 'SET_EDITOR_DIRTY', payload: true });
        }
    }

    const handleSave = () => {
        setJsonError(null);
        let finalContent = editedRawContent; // Start with raw content as the base

        if (editMode === 'json') {
            try {
                const newFm = JSON.parse(editedJson);
                const { content: body } = matter(editedRawContent); // Keep original body
                finalContent = matter.stringify(body, newFm);
            } catch (e) {
                setJsonError(e instanceof Error ? e.message : 'Invalid JSON content');
                return;
            }
        } else if (editMode === 'html') {
             const { data: fm } = matter(editedRawContent); // Keep original frontmatter
             finalContent = matter.stringify(editedHtml, fm);
        }
        
        const { data: finalData } = matter(finalContent);
        const updatedTemplate: Template = { 
            ...template, 
            title: finalData.title || finalData.interactive?.title || template.title,
            content: finalContent
        };

        dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });

        setIsEditing(false);
        setEditMode(finalData.interactive ? 'form' : 'simple');
    };
    
    const confirmDelete = () => {
        dispatch({ type: 'DELETE_TEMPLATE', payload: template.id });
        setIsDeleteModalOpen(false);
    };

    const handleShare = async () => {
        const fileToShare = new File([template.content], `${template.title.replace(/\s+/g, '_')}.md`, {
            type: 'text/markdown;charset=utf-8',
        });

        const shareData = {
            title: template.title,
            text: `A PromptForge AI template: "${template.title}"`,
            files: [fileToShare],
        };

        // Check for Web Share API support
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                // Successfully shared
            } catch (error) {
                // AbortError is common if the user closes the share dialog, so we don't need to log it or fall back.
                if (error.name !== 'AbortError') {
                    console.error("Couldn't share using Web Share API, falling back to download.", error);
                    exportTemplateAsMarkdown(template);
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            console.log("Web Share API not supported, falling back to download.");
            exportTemplateAsMarkdown(template);
        }
    };

    const handleCancelEdit = () => {
        setEditedRawContent(template.content);
        setIsEditing(false);
        setJsonError(null);
        setEditMode(interactiveConfig ? 'form' : 'simple');
        dispatch({ type: 'SET_EDITOR_DIRTY', payload: false });
    };

    const { content: markdownContent } = matter(template.content);
    const proseClasses = `prose lg:prose-xl max-w-none prose-h1:text-[rgb(var(--color-text-primary))] prose-h2:text-[rgb(var(--color-text-primary))] prose-h3:text-[rgb(var(--color-text-secondary))] prose-p:text-[rgb(var(--color-text-secondary))] prose-strong:text-[rgb(var(--color-text-primary))] prose-ul:text-[rgb(var(--color-text-secondary))] prose-ol:text-[rgb(var(--color-text-secondary))] prose-li:text-[rgb(var(--color-text-secondary))] prose-code:text-pink-400 prose-blockquote:text-slate-400 prose-blockquote:border-slate-600`;

    const renderEditor = () => {
        const commonTextAreaClasses = "w-full h-full p-3 font-mono text-sm border border-[rgb(var(--color-border))] rounded-md shadow-sm focus:ring-[rgb(var(--color-accent))] focus:border-[rgb(var(--color-accent))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] resize-none";
        
        switch (editMode) {
            case 'form':
                return interactiveConfig ? (
                    <FormEditor 
                        frontmatter={interactiveConfig} 
                        onUpdate={(updatedFm) => {
                            const { content: body, data } = matter(editedRawContent);
                            const newFrontmatter = { ...data, interactive: updatedFm };
                            handleContentUpdate(matter.stringify(body, newFrontmatter));
                        }}
                    />
                ) : <p>This template is not interactive. Switch to Simple or Raw editor.</p>;
            
            case 'simple':
                 return (
                    <SimpleEditor 
                        content={editedRawContent}
                        onUpdate={handleContentUpdate}
                    />
                 );
            
            case 'json':
                return (
                     <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-tertiary))] mb-1">Editing Frontmatter (JSON)</label>
                        <textarea
                            value={editedJson}
                            onChange={(e) => handleJsonUpdate(e.target.value)}
                            className={commonTextAreaClasses}
                            style={{minHeight: '50vh'}}
                        />
                         {jsonError && <p className="text-sm text-red-400 mt-2">{jsonError}</p>}
                    </div>
                );

            case 'html':
                 return (
                     <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-tertiary))] mb-1">Editing Body Content (HTML/Markdown)</label>
                        <textarea
                            value={editedHtml}
                            onChange={(e) => handleHtmlUpdate(e.target.value)}
                            className={commonTextAreaClasses}
                            style={{minHeight: '50vh'}}
                        />
                    </div>
                );

            case 'raw':
            default:
                return (
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-tertiary))] mb-1">Editing Raw Markdown File</label>
                        <textarea
                            value={editedRawContent}
                            onChange={(e) => handleContentUpdate(e.target.value)}
                            className={commonTextAreaClasses}
                            style={{minHeight: '50vh'}}
                        />
                    </div>
                );
        }
    }
    
    const allModes: { key: EditMode; label: string; condition: boolean }[] = [
        { key: 'form', label: 'Form', condition: !!interactiveConfig },
        { key: 'simple', label: 'Simple', condition: !interactiveConfig },
        { key: 'raw', label: 'Raw Markdown', condition: true },
        { key: 'json', label: 'JSON (Header)', condition: true },
        { key: 'html', label: 'HTML (Body)', condition: true },
    ];
    const editorModes = allModes.filter(mode => mode.condition);
    
    return (
        <>
        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title={`Delete Template: ${template.title}`}
            message={`This action cannot be undone. Please type the template name to confirm deletion.`}
            confirmText="Delete"
            itemName={template.title}
        />
        <div className="p-6 sm:p-8 h-full flex flex-col bg-[rgb(var(--color-bg-secondary))]">
            <header className="pb-4 border-b border-[rgb(var(--color-border))] mb-6">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text-primary))]">{template.title}</h2>
                    <div className="flex items-center space-x-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className={`relative px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))]`}
                                >
                                    Save
                                    {editorIsDirty && <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                {!isLocked && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-500"
                                    >
                                        Edit
                                    </button>
                                )}
                                {!isLocked && (
                                     <button
                                        onClick={handleShare}
                                        className="px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]"
                                    >
                                        Share
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-200 bg-red-900/50 hover:bg-red-900/80"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <div className="mt-4">
                        <span className="text-sm text-[rgb(var(--color-text-tertiary))] mr-2">Editor Mode:</span>
                        <div className="inline-flex rounded-md shadow-sm">
                            {editorModes.map((mode, index) => (
                                <button 
                                    key={mode.key} 
                                    onClick={() => setEditMode(mode.key)} 
                                    className={`px-3 py-1 text-sm font-medium border
                                        ${index > 0 ? 'border-l-0' : ''} 
                                        ${index === 0 ? 'rounded-l-md' : ''} 
                                        ${index === editorModes.length - 1 ? 'rounded-r-md' : ''} 
                                        ${editMode === mode.key ? 'bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-text))] border-[rgb(var(--color-accent))]' : 'bg-transparent text-[rgb(var(--color-text-primary))] border-[rgb(var(--color-border))]'}`}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>
            
            <div className="flex-1 overflow-y-auto">
                {isEditing ? (
                    renderEditor()
                ) : (
                    <article className={proseClasses}>
                        <ReactMarkdown>{markdownContent}</ReactMarkdown>
                    </article>
                )}

                {!isEditing && interactiveConfig && (
                    <InteractivePrompt
                        config={interactiveConfig}
                        systemPrompt={systemPrompt}
                    />
                )}
            </div>
        </div>
        </>
    );
};

export default TemplateViewer;