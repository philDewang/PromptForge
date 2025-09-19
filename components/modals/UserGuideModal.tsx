import React from 'react';
import Modal from '../ui/Modal';
import ReactMarkdown from 'react-markdown';
import { userGuideContent } from '../../data/userGuideData';

interface UserGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="PromptForge AI User Guide">
            <div className="prose prose-invert max-w-none user-guide-content max-h-[70vh] overflow-y-auto p-4 bg-[rgb(var(--color-bg-primary))] rounded-b-lg">
                <ReactMarkdown>{userGuideContent}</ReactMarkdown>
            </div>
        </Modal>
    );
};

export default UserGuideModal;
