import React from 'react';
import { InteractiveFrontmatter, Field } from '../../types/index';

interface FormEditorProps {
    frontmatter: InteractiveFrontmatter;
    onUpdate: (updatedFrontmatter: InteractiveFrontmatter) => void;
}

const FormEditor: React.FC<FormEditorProps> = ({ frontmatter, onUpdate }) => {
    
    const handleFieldChange = (index: number, fieldData: Partial<Field>) => {
        const updatedFields = [...frontmatter.fields];
        updatedFields[index] = { ...updatedFields[index], ...fieldData };
        onUpdate({ ...frontmatter, fields: updatedFields });
    };

    const handleOptionsChange = (index: number, optionsString: string) => {
        const options = optionsString.split('\n').map(line => {
            const [value, ...labelParts] = line.split(':');
            return { value: value.trim(), label: labelParts.join(':').trim() };
        }).filter(opt => opt.value && opt.label);
        handleFieldChange(index, { options });
    };

    const handleAddField = () => {
        const newField: Field = {
            id: `new_field_${Date.now()}`,
            label: 'New Field',
            type: 'input',
            placeholder: '',
        };
        onUpdate({ ...frontmatter, fields: [...frontmatter.fields, newField] });
    };

    const handleRemoveField = (index: number) => {
        const updatedFields = frontmatter.fields.filter((_, i) => i !== index);
        onUpdate({ ...frontmatter, fields: updatedFields });
    };

    const handleFmChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdate({ ...frontmatter, [e.target.name]: e.target.value });
    };
    
    const renderFieldSpecifics = (field: Field, index: number) => {
        const commonInputClass = "mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm sm:text-sm bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] read-only:bg-slate-700";
        switch (field.type) {
            case 'textarea':
                return (
                    <>
                        <div>
                            <label htmlFor={`field-placeholder-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Placeholder</label>
                            <input type="text" id={`field-placeholder-${index}`} value={field.placeholder || ''} onChange={(e) => handleFieldChange(index, { placeholder: e.target.value })} className={commonInputClass} />
                        </div>
                        <div>
                            <label htmlFor={`field-rows-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Rows</label>
                            <input type="number" id={`field-rows-${index}`} value={field.rows || 3} onChange={(e) => handleFieldChange(index, { rows: parseInt(e.target.value, 10) || 3 })} className={commonInputClass} />
                        </div>
                    </>
                );
            case 'select':
                return (
                    <div className="md:col-span-2">
                        <label htmlFor={`field-options-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Options (one per line, format: value:Label)</label>
                        <textarea id={`field-options-${index}`} value={field.options?.map(o => `${o.value}:${o.label}`).join('\n') || ''} onChange={(e) => handleOptionsChange(index, e.target.value)} rows={3} className={commonInputClass} placeholder={'option_1:First Option\noption_2:Second Option'}/>
                    </div>
                );
            case 'file':
                 return (
                    <div>
                        <label htmlFor={`field-accept-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Accepted File Types</label>
                        <input type="text" id={`field-accept-${index}`} value={field.accept || ''} onChange={(e) => handleFieldChange(index, { accept: e.target.value })} className={commonInputClass} placeholder="image/*, .pdf" />
                    </div>
                );
            case 'checkbox':
                return <div className="text-xs text-slate-400 italic mt-1">Checkboxes only require a Label.</div>;
            case 'input':
            default:
                 return (
                    <div>
                        <label htmlFor={`field-placeholder-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Placeholder</label>
                        <input type="text" id={`field-placeholder-${index}`} value={field.placeholder || ''} onChange={(e) => handleFieldChange(index, { placeholder: e.target.value })} className={commonInputClass} />
                    </div>
                );
        }
    }


    return (
        <div className="space-y-6 p-4 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border))] rounded-lg">
            <div>
                <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2 mb-4">Template Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fm-title" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">Title</label>
                        <input type="text" id="fm-title" name="title" value={frontmatter.title || ''} onChange={handleFmChange} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]" />
                    </div>
                     <div>
                        <label htmlFor="fm-description" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">Description</label>
                        <textarea id="fm-description" name="description" value={frontmatter.description || ''} onChange={handleFmChange} rows={2} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]" />
                    </div>
                     <div>
                        <label htmlFor="fm-buttonText" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))]">Button Text</label>
                        <input type="text" id="fm-buttonText" name="buttonText" value={frontmatter.buttonText || ''} onChange={handleFmChange} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm focus:border-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))] sm:text-sm bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-primary))]" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2 mb-4">Form Fields</h3>
                <div className="space-y-4">
                    {frontmatter.fields.map((field, index) => (
                        <div key={index} className="p-4 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-bg-secondary))] relative">
                            <button onClick={() => handleRemoveField(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600" aria-label="Remove field">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor={`field-id-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Field ID (unique)</label>
                                    <input type="text" id={`field-id-${index}`} value={field.id} onChange={(e) => handleFieldChange(index, { id: e.target.value })} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm sm:text-sm bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]" />
                                </div>
                                <div>
                                    <label htmlFor={`field-label-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Label</label>
                                    <input type="text" id={`field-label-${index}`} value={field.label} onChange={(e) => handleFieldChange(index, { label: e.target.value })} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm sm:text-sm bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]" />
                                </div>
                                <div>
                                    <label htmlFor={`field-type-${index}`} className="block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">Type</label>
                                    <select id={`field-type-${index}`} value={field.type} onChange={(e) => handleFieldChange(index, { type: e.target.value as Field['type'] })} className="mt-1 block w-full rounded-md border-[rgb(var(--color-border))] shadow-sm sm:text-sm bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]" >
                                        <option value="input">Input</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Select (Dropdown)</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="file">File Upload</option>
                                    </select>
                                </div>
                                {renderFieldSpecifics(field, index)}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddField} className="mt-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[rgb(var(--color-accent-text))] bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-hover))]">
                    + Add Field
                </button>
            </div>
        </div>
    );
};

export default FormEditor;