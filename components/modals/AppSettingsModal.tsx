
import React from 'react';
import Modal from '../ui/Modal';
import { AppSettings } from '../../types/index';
import { useCollectionDispatch } from '../../context/CollectionContext';

interface AppSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: AppSettings;
}

const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ isOpen, onClose, currentSettings }) => {
    const dispatch = useCollectionDispatch();

    const handleThemeChange = (theme: AppSettings['theme']) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: { theme } });
    };

    const themes: { name: AppSettings['theme'], color: string }[] = [
        { name: 'slate', color: 'bg-slate-500' },
        { name: 'sky', color: 'bg-sky-500' },
        { name: 'rose', color: 'bg-rose-500' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Application Settings">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">Color Theme</h3>
                    <p className="text-xs text-[rgb(var(--color-text-tertiary))] mb-2">Choose a color palette for the application interface.</p>
                    <div className="flex space-x-2">
                        {themes.map(theme => (
                            <button
                                key={theme.name}
                                onClick={() => handleThemeChange(theme.name)}
                                className={`flex-1 p-2 rounded-md border-2 capitalize text-sm font-semibold text-[rgb(var(--color-text-primary))] ${
                                    currentSettings.theme === theme.name 
                                        ? 'border-[rgb(var(--color-accent))] ring-2 ring-[rgb(var(--color-accent))]' 
                                        : 'border-transparent'
                                }`}
                            >
                                <div className={`w-full h-8 rounded ${theme.color} mb-1`}></div>
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AppSettingsModal;