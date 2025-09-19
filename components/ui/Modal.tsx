
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const modalContent = (
        // Using fixed position and z-index to overlay the content. A portal would be an alternative.
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-80 z-50 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-[rgb(var(--color-bg-secondary))] rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={e => e.stopPropagation()} // Prevent click inside modal from closing it
            >
                <div className="flex justify-between items-center p-4 border-b border-[rgb(var(--color-border))]">
                    <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))]"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="bg-[rgb(var(--color-bg-primary))] p-4 rounded-b-lg">
                    {children}
                </div>
            </div>
        </div>
    );
    
    // In a larger app, we might create a dedicated #modal-root div in index.html
    // and use a portal, but for simplicity, we append to body.
    return document.body ? ReactDOM.createPortal(modalContent, document.body) : null;
};

export default Modal;