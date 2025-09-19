import React, { useState } from 'react';
import Modal from '../ui/Modal';
import FormEditor from '../ui/FormEditor';
import ReactMarkdown from 'react-markdown';
import InteractivePrompt from '../ui/InteractivePrompt';
// FIX: Corrected import path to point to the file with type definitions.
import { InteractiveFrontmatter, Field } from '../../types/index';
import matter from 'gray-matter';
import { useCollectionState } from '../../context/CollectionContext';

interface TemplateWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, content: string) => void;
}

const initialFrontmatter: InteractiveFrontmatter = {
    type: 'InteractivePrompt',
    title: 'New Interactive Template',
    description: 'A brief description of what this template does.',
    fields: [{ id: 'example_field', label: 'Example Field', type: 'input', placeholder: 'e.g., Enter some text' }],
    buttonText: 'Generate',
    onSubmit: 'genericPromptHandler',
};

const TemplateWizardModal: React.FC<TemplateWizardModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [frontmatterState, setFrontmatterState] = useState<InteractiveFrontmatter>(initialFrontmatter);
    const [markdownBody, setMarkdownBody] = useState('This is the body of your template. Provide instructions or context for the user here.');

    const state = useCollectionState();
    const activeCollection = state?.collectionsState.collections.find(c => c.id === state.collectionsState.activeCollectionId);
    const systemPrompt = activeCollection?.templates.find(t => t.order === 1)?.content || 'You are a helpful AI assistant.';

    const resetState = () => {
        setStep(1);
        setFrontmatterState(initialFrontmatter);
        setMarkdownBody('This is the body of your template. Provide instructions or context for the user here.');
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSubmit = () => {
        const finalContent = matter.stringify(markdownBody, { interactive: frontmatterState });
        onSubmit(frontmatterState.title, finalContent);
        handleClose();
    };
    
    // Reset state when modal is opened
    React.useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen]);

    const renderStep = () => {
        switch(step) {
            case 1: // Configure Form
                return <FormEditor frontmatter={frontmatterState} onUpdate={setFrontmatterState} />;
            case 2: // Edit Body
                return (
                    <div>
                        <label htmlFor="markdown-body" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                            Template Body (Instructions)
                        </label>
                        <textarea
                            id="markdown-body"
                            value={markdownBody}
                            onChange={(e) => setMarkdownBody(e.target.value)}
                            rows={10}
                            className="w-full p-2 font-mono text-sm border border-[rgb(var(--color-border))] rounded-md shadow-sm focus:ring-[rgb(var(--color-accent))] focus:border-[rgb(var(--color-accent))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                        />
                    </div>
                );
            case 3: // Preview
                 const proseClasses = `prose max-w-none mb-6 prose-h2:text-[rgb(var(--color-text-primary))] prose-p:text-[rgb(var(--color-text-secondary))]`;
                return (
                    <div className="bg-[rgb(var(--color-bg-primary))] p-4 border border-[rgb(var(--color-border))] rounded-lg max-h-96 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--color-text-primary))]">{frontmatterState.title}</h2>
                        <article className={proseClasses}>
                            <ReactMarkdown>{markdownBody}</ReactMarkdown>
                        </article>
                        {/* FIX: Added required 'systemPrompt' prop for preview. */}
                        <InteractivePrompt config={frontmatterState} systemPrompt={systemPrompt} />
                    </div>
                );
            default:
                return null;
        }
    };

    const titles = ["Configure Interactive Form", "Edit Template Body", "Preview and Finish"];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Template Wizard - Step ${step}: ${titles[step - 1]}`}>
             <div className="p-4 min-h-[400px]">
                {renderStep()}
            </div>
            <div className="p-4 border-t border-[rgb(var(--color-border))] flex justify-between">
                <div>
                    {step > 1 && (
                        <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]">
                            Back
                        </button>
                    )}
                </div>
                 <div>
                    {step < 3 ? (
                         <button onClick={() => setStep(s => s + 1)} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))]">
                            Next
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))]">
                            Finish & Create Template
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default TemplateWizardModal;