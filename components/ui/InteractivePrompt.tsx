

import React, { useState, useCallback } from 'react';
import { InteractiveFrontmatter } from '../../types/index';
import { promptGenerators } from '../../services/promptService';

interface InteractivePromptProps {
    config: InteractiveFrontmatter;
    systemPrompt: string;
}

interface FileData {
    name: string;
    mimeType: string;
    data: string; // base64 encoded
}

type FormDataValue = string | boolean | FileData | undefined;

const InteractivePrompt: React.FC<InteractivePromptProps> = ({ config, systemPrompt }) => {
    const { title, description, fields, buttonText, onSubmit } = config;

    const [formData, setFormData] = useState<Record<string, FormDataValue>>(
        fields.reduce((acc, field) => ({ ...acc, [field.id]: field.type === 'checkbox' ? false : '' }), {})
    );
    const [output, setOutput] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;

        if (type === 'checkbox' && 'checked' in e.target) {
            setFormData({ ...formData, [name]: e.target.checked });
        } else if (type === 'file' && 'files' in e.target && e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const base64 = (loadEvent.target?.result as string).split(',')[1];
                    setFormData({
                        ...formData,
                        [name]: {
                            name: file.name,
                            mimeType: file.type,
                            data: base64
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: e.target.value });
        }
    };


    const handleGenerate = useCallback(() => {
        const hasMissingFields = fields.some(field => {
            const value = formData[field.id];
            // Checkboxes are optional by default, other fields are required
            return field.type !== 'checkbox' && !value;
        });

        if (hasMissingFields) {
            setError('Please fill in all required fields.');
            setOutput(null);
            return;
        }

        const generator = promptGenerators[onSubmit];
        if (!generator) {
            setError(`Prompt generator "${onSubmit}" not found.`);
            setOutput(null);
            return;
        }
        
        setError(null);
        setCopied(false);
        const result = generator(formData, systemPrompt);
        setOutput(result);
    }, [formData, fields, onSubmit, systemPrompt]);
    
    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderField = (field: typeof fields[0]) => {
         const commonClasses = "mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))] disabled:opacity-50";

        switch(field.type) {
            case 'textarea':
                 return (
                    <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] as string}
                        onChange={handleChange}
                        rows={field.rows || 3}
                        className={commonClasses}
                        placeholder={field.placeholder}
                    />
                );
            case 'select':
                return (
                    <select
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] as string}
                        onChange={handleChange}
                        className={commonClasses}
                    >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center mt-1">
                        <input
                            id={field.id}
                            name={field.id}
                            type="checkbox"
                            checked={formData[field.id] as boolean}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
                        />
                         <label htmlFor={field.id} className="ml-2 text-sm text-[rgb(var(--color-text-secondary))]">{field.label}</label>
                    </div>
                );
            case 'file':
                const fileValue = formData[field.id] as FileData;
                return (
                     <div>
                        <input
                            type="file"
                            id={field.id}
                            name={field.id}
                            onChange={handleChange}
                            accept={field.accept}
                            className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[rgb(var(--color-bg-tertiary))] file:text-[rgb(var(--color-text-secondary))] hover:file:bg-[rgb(var(--color-border))]"
                        />
                         {fileValue && <p className="text-xs text-slate-400 mt-1">Selected: {fileValue.name}</p>}
                    </div>
                );
            case 'input':
            default:
                return (
                    <input
                        type="text"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] as string}
                        onChange={handleChange}
                        className={commonClasses}
                        placeholder={field.placeholder}
                    />
                );
        }
    }

    return (
        <div className="bg-[rgb(var(--color-bg-primary))] p-4 rounded-lg border border-[rgb(var(--color-border))] mt-6">
            <h3 className="font-bold text-lg text-[rgb(var(--color-text-primary))] mb-2">{title}</h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">{description}</p>
            <div className="space-y-3">
                {fields.map(field => (
                    <div key={field.id}>
                        {field.type !== 'checkbox' && <label htmlFor={field.id} className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">{field.label}</label>}
                        {renderField(field)}
                    </div>
                ))}
            </div>
            <button
                onClick={handleGenerate}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-accent))]"
            >
                {buttonText}
            </button>
            <div className="mt-4">
                {error && <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 rounded" role="alert"><p>{error}</p></div>}
                {output && (
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-[rgb(var(--color-text-secondary))]">Generated Prompt:</h4>
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 text-xs font-medium rounded-md text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-border))]"
                            >
                               {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-md p-4 text-sm text-[rgb(var(--color-text-primary))] whitespace-pre-wrap word-wrap break-word font-mono"><code>{output}</code></pre>
                     </div>
                )}
            </div>
        </div>
    );
};

export default InteractivePrompt;