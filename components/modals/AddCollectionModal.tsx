

import React from 'react';
import Modal from '../ui/Modal';
import { useCollectionDispatch } from '../../context/CollectionContext';
import { createBlankCollection } from '../../services/dataService';
import InputModal from './InputModal';

interface AddCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: () => void;
}

const AddCollectionModal: React.FC<AddCollectionModalProps> = ({ isOpen, onClose, onImport }) => {
    const dispatch = useCollectionDispatch();
    const [isNameModalOpen, setIsNameModalOpen] = React.useState(false);

    const handleAddBlank = (name: string) => {
        const newCollection = createBlankCollection(name);
        dispatch({ type: 'ADD_COLLECTION', payload: newCollection });
        onClose();
    };
    
    const handleImport = () => {
        onImport();
        onClose();
    };

    return (
        <>
            <InputModal 
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSubmit={handleAddBlank}
                title="Create Blank Collection"
                label="Collection Name:"
                submitText="Create"
            />
            <Modal isOpen={isOpen} onClose={onClose} title="Add a Collection">
                <div className="space-y-4">
                    <button
                        onClick={() => setIsNameModalOpen(true)}
                        className="w-full p-3 text-left border rounded-md bg-transparent border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                    >
                        <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Create Blank Collection</h4>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Start a new collection from scratch.</p>
                    </button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-[rgb(var(--color-border))]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[rgb(var(--color-bg-primary))] px-2 text-sm text-[rgb(var(--color-text-tertiary))]">Or</span>
                        </div>
                    </div>

                     <button
                        onClick={handleImport}
                        className="w-full p-3 text-left border rounded-md bg-transparent border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                    >
                        <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Import from File</h4>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Import a collection from a previously exported `.json` file.</p>
                    </button>

                </div>
            </Modal>
        </>
    );
};

export default AddCollectionModal;