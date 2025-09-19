
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    itemName?: string; // If provided, enables "type-to-confirm"
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, itemName }) => {
    const [confirmInput, setConfirmInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setConfirmInput('');
        }
    }, [isOpen]);

    const isConfirmationDisabled = itemName ? confirmInput !== itemName : false;

    const handleConfirm = () => {
        if (!isConfirmationDisabled) {
            onConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-sm text-[rgb(var(--color-text-secondary))] whitespace-pre-wrap">{message}</p>
                {itemName && (
                    <div>
                        <label htmlFor="confirm-input" className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">
                            Type <strong className="text-[rgb(var(--color-text-primary))]">{itemName}</strong> to confirm:
                        </label>
                        <input
                            type="text"
                            id="confirm-input"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                            autoFocus
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
                    type="button"
                    onClick={handleConfirm}
                    disabled={isConfirmationDisabled}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-red-400 disabled:cursor-not-allowed"
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;