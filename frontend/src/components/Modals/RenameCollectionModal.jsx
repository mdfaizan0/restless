import { useState } from 'react';

/**
 * Modal for renaming a collection
 */
const RenameCollectionModal = ({ isOpen, collection, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Reset state when modal opens with new collection
    if (isOpen && collection && name !== collection.name) {
        setName(collection.name);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Collection name is required');
            return;
        }

        if (name.trim() === collection?.name) {
            handleClose();
            return;
        }

        const success = await onSubmit(collection.id, name.trim());

        if (success) {
            setName('');
            setError('');
            onClose();
        } else {
            setError('Failed to rename collection');
        }
    };

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    if (!isOpen || !collection) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
            <div className="bg-surface-2 rounded-lg p-6 w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Rename Collection</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-text-secondary mb-2">Collection Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface border border-border text-text-primary p-2 rounded outline-none focus:border-accent transition-colors"
                            autoFocus
                        />
                        {error && <p className="text-error text-xs mt-1">{error}</p>}
                    </div>

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
                            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
                        >
                            Rename
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameCollectionModal;