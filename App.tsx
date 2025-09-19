

import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TemplateViewer from './components/layout/TemplateViewer';
import Loader from './components/ui/Loader';
import WelcomeScreen from './components/layout/WelcomeScreen';
import { CollectionProvider, useCollectionState } from './context/CollectionContext';

const AppContent: React.FC = () => {
    const state = useCollectionState();

    useEffect(() => {
        // Set the theme class on the body element
        document.body.className = `theme-${state?.settings?.theme || 'slate'}`;
    }, [state?.settings?.theme]);

    const { collectionsState } = state;
    const { collections, activeCollectionId, activeTemplateId } = collectionsState;
    const activeCollection = collections.find(c => c.id === activeCollectionId);
    const activeTemplate = activeCollection?.templates.find(t => t.id === activeTemplateId);

    // If no collections are loaded, show the welcome screen
    if (collections.length === 0) {
        return <WelcomeScreen />;
    }

    return (
        <div className="flex h-screen bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                {activeTemplate ? (
                    <TemplateViewer key={activeTemplate.id} />
                ) : (
                     <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                        <div className="max-w-md">
                             <h2 className="text-2xl font-bold mb-2 text-[rgb(var(--color-text-primary))]">{activeCollection?.name || "Empty Collection"}</h2>
                             <p className="text-[rgb(var(--color-text-secondary))]">This collection has no templates. Select a different collection or create a new template to get started!</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <CollectionProvider>
            <AppContent />
        </CollectionProvider>
    );
};

export default App;