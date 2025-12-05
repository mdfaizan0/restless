import { useState } from 'react';

/**
 * Modal for saving current request to a collection
 */
const SaveToCollectionModal = ({ isOpen, collections, currentRequest, onClose, onSubmit }) => {
    const [selectedCollectionId, setSelectedCollectionId] = useState('');
    const [itemName, setItemName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCollectionId) {
            setError('Please select a collection');
            return;
        }

        const result = await onSubmit(selectedCollectionId, {
            name: itemName.trim() || currentRequest.url,
            url: currentRequest.url,
            method: currentRequest.method,
            headers: currentRequest.headers,
            body: currentRequest.body
        });

        if (result.success) {
            setSelectedCollectionId('');
            setItemName('');
            setError('');
            onClose();
        } else {
            setError(result.error || 'Failed to save request');
        }
    };

    const handleClose = () => {
        setSelectedCollectionId('');
        setItemName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
            <div className="bg-surface-2 rounded-lg p-6 w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Save to Collection</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-2">Collection</label>
                        <select
                            value={selectedCollectionId}
                            onChange={(e) => setSelectedCollectionId(e.target.value)}
                            className="w-full bg-surface border border-border text-text-primary p-2 rounded outline-none focus:border-accent transition-colors"
                            autoFocus
                        >
                            <option value="">Select a collection...</option>
                            {collections.map(col => (
                                <option key={col.id} value={col.id}>{col.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-2">Request Name (Optional)</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder={currentRequest.url || 'Request name'}
                            className="w-full bg-surface border border-border text-text-primary p-2 rounded outline-none focus:border-accent transition-colors"
                        />
                    </div>

                    <div className="mb-4 p-3 bg-surface rounded border border-border">
                        <div className="text-xs text-text-tertiary mb-1">Preview:</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{
                                color: `var(--color-method-${currentRequest.method?.toLowerCase() || 'get'})`,
                                backgroundColor: `var(--color-method-${currentRequest.method?.toLowerCase() || 'get'})15`
                            }}>
                                {currentRequest.method || 'GET'}
                            </span>
                            <span className="text-xs text-text-secondary truncate">{currentRequest.url || 'No URL'}</span>
                        </div>
                    </div>

                    {error && <p className="text-error text-xs mb-4">{error}</p>}

                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-transparent border border-border text-text-secondary rounded hover:bg-surface-3 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors cursor-pointer hover:text-text-primary"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaveToCollectionModal;
