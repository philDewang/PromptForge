import React, { useState } from 'react';
import Modal from '../ui/Modal';

interface AIAssistedTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
}

const AIAssistedTemplateModal: React.FC<AIAssistedTemplateModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim()) {
            onSubmit(description.trim());
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Template with AI">
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                        Describe the template you want to create.
                    </label>
                    <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
                        For example: "Create a template to help me write a bug report. It should have fields for the bug summary, steps to reproduce, and expected vs. actual results."
                    </p>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                        placeholder="Describe your template here..."
                        autoFocus
                    />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-[rgb(var(--color-border))] text-sm font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!description.trim()}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] disabled:opacity-50"
                    >
                        Generate Template
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AIAssistedTemplateModal;