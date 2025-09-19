
import React, { useState } from 'react';
import Modal from '../ui/Modal';

interface NewTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitBlank: (name: string) => void;
    onSelectAI: () => void;
    onSelectWizard: () => void;
}

type CreationType = 'blank' | 'guided' | 'ai';

const NewTemplateModal: React.FC<NewTemplateModalProps> = ({ isOpen, onClose, onSubmitBlank, onSelectAI, onSelectWizard }) => {
    const [templateName, setTemplateName] = useState('');
    const [creationType, setCreationType] = useState<CreationType>('blank');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (creationType === 'blank') {
            if (!templateName.trim()) return;
            onSubmitBlank(templateName.trim());
        } else if (creationType === 'ai') {
            onSelectAI();
        } else if (creationType === 'guided') {
            onSelectWizard();
        }
    };

    const renderDescription = () => {
        switch (creationType) {
            case 'blank':
                return 'Start with an empty Markdown file. You can add your own content and YAML frontmatter.';
            case 'guided':
                return 'Use a step-by-step wizard to build an interactive prompt with forms and fields.';
            case 'ai':
                return 'Describe the template you want, and let the AI assistant generate it for you.';
            default:
                return '';
        }
    };
    
    React.useEffect(() => {
        if(isOpen) {
            setTemplateName('');
            setCreationType('blank');
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Template">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">How would you like to start?</label>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button type="button" onClick={() => setCreationType('blank')} className={`p-3 border rounded-md text-left ${creationType === 'blank' ? 'bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-transparent border-[rgb(var(--color-border))]'}`}>
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Blank Template</h4>
                                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Free-form editor.</p>
                            </button>
                             <button type="button" onClick={() => setCreationType('ai')} className={`p-3 border rounded-md text-left ${creationType === 'ai' ? 'bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-transparent border-[rgb(var(--color-border))]'}`}>
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">AI Assistant</h4>
                                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">AI-powered creation.</p>
                            </button>
                            <button type="button" onClick={() => setCreationType('guided')} className={`p-3 border rounded-md text-left ${creationType === 'guided' ? 'bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500' : 'bg-transparent border-[rgb(var(--color-border))]'}`}>
                                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Guided Builder</h4>
                                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Interactive wizard.</p>
                            </button>
                        </div>
                         <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">{renderDescription()}</p>
                    </div>

                    {creationType === 'blank' && (
                        <div>
                            <label htmlFor="template-name" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">Template Name</label>
                            <input
                                type="text"
                                id="template-name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                                placeholder="e.g., Project Summary Generator"
                            />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={creationType === 'blank' && !templateName.trim()}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] disabled:opacity-50"
                    >
                        {creationType === 'blank' ? 'Create Template' : 'Next →'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewTemplateModal;