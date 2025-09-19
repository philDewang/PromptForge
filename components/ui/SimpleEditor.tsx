
import React, { useState, useEffect } from 'react';
import matter from 'gray-matter';

interface SimpleEditorProps {
    content: string;
    onUpdate: (newContent: string) => void;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({ content, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        try {
            const { data, content: bodyContent } = matter(content);
            setTitle(data.title || '');
            setBody(bodyContent);
        } catch (e) {
            // If frontmatter is invalid, just show the whole content in the body
            setTitle('');
            setBody(content);
        }
    }, [content]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        const newContent = matter.stringify(body, { title: newTitle });
        onUpdate(newContent);
    };

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newBody = e.target.value;
        setBody(newBody);
        const newContent = matter.stringify(newBody, { title });
        onUpdate(newContent);
    };

    return (
        <div className="space-y-4 p-4 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border))] rounded-lg">
            <div>
                <label htmlFor="simple-editor-title" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                    Template Title
                </label>
                <input
                    type="text"
                    id="simple-editor-title"
                    value={title}
                    onChange={handleTitleChange}
                    className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                    placeholder="Enter template title..."
                />
            </div>
            <div>
                <label htmlFor="simple-editor-body" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                    Template Content
                </label>
                <textarea
                    id="simple-editor-body"
                    value={body}
                    onChange={handleBodyChange}
                    rows={15}
                    className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]"
                    placeholder="Enter template content here..."
                />
            </div>
        </div>
    );
};

export default SimpleEditor;
