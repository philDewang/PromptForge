
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
    title: string;
    label: string;
    initialValue?: string;
    submitText?: string;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSubmit, title, label, initialValue = '', submitText = 'Submit' }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="input-field" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">{label}</label>
                    <input
                        type="text"
                        id="input-field"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
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
                        disabled={!value.trim()}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] disabled:opacity-50"
                    >
                        {submitText}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default InputModal;