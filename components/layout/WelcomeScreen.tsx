
import React from 'react';
import { useCollectionDispatch } from '../../context/CollectionContext';
import { loadStarterCollections, importCollection } from '../../services/dataService';

const WelcomeScreen: React.FC = () => {
    const dispatch = useCollectionDispatch();

    const handleLoadDefaults = () => {
        const starterCollections = loadStarterCollections();
        starterCollections.forEach(collection => {
            dispatch({ type: 'ADD_COLLECTION', payload: collection });
        });
    };

    const handleImport = async () => {
        try {
            const imported = await importCollection();
            dispatch({ type: 'ADD_COLLECTION', payload: imported });
        } catch (err) {
            alert(`Error importing collection: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]">
            <div className="text-center p-8 max-w-lg mx-auto bg-[rgb(var(--color-bg-secondary))] rounded-lg shadow-2xl border border-[rgb(var(--color-border))]">
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-2">Welcome to PromptForge AI</h1>
                <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                    Your local-first IDE for prompt engineering. Get started by loading the default collections or importing your own.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={handleLoadDefaults}
                        className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-accent))] focus:ring-offset-[rgb(var(--color-bg-secondary))]"
                    >
                        Load Starter Collections
                    </button>
                    <button
                        onClick={handleImport}
                        className="w-full px-6 py-3 border border-[rgb(var(--color-border))] text-base font-medium rounded-md text-[rgb(var(--color-text-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-tertiary))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-accent))] focus:ring-offset-[rgb(var(--color-bg-secondary))]"
                    >
                        Import Collection (.json)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
