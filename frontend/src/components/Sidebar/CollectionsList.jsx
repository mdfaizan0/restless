import React, { useState } from 'react';
import { useCollections } from '../../hooks/useCollections';
import CollectionItem from './CollectionItem';
import NewCollectionModal from '../Modals/NewCollectionModal';
import RenameCollectionModal from '../Modals/RenameCollectionModal';

/**
 * Collections list container
 */
const CollectionsList = ({ onItemClick }) => {
    const {
        collections,
        collectionItems,
        loading,
        loadCollectionItems,
        addCollection,
        updateCollectionName,
        removeCollection,
        removeItem
    } = useCollections();

    const [showNewModal, setShowNewModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const handleNewCollection = () => {
        setShowNewModal(true);
    };

    const handleRename = (collection) => {
        setSelectedCollection(collection);
        setShowRenameModal(true);
    };

    const handleDelete = (collectionId) => {
        const confirmed = window.confirm('Delete this collection and all its items? This cannot be undone.');
        if (confirmed) {
            removeCollection(collectionId);
        }
    };

    const handleItemDelete = (collectionId, itemId) => {
        removeItem(collectionId, itemId);
    };

    if (loading) {
        return (
            <div className="px-4 py-3 text-text-tertiary text-[13px] text-center">
                Loading collections...
            </div>
        );
    }

    return (
        <div>
            {/* Header with + button */}
            <div className="px-3 pb-2 flex justify-between items-center">
                <span className="text-[11px] text-text-tertiary">
                    {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
                </span>
                <button
                    onClick={handleNewCollection}
                    className="text-accent hover:text-accent-hover text-lg leading-none transition-colors cursor-pointer"
                    title="New collection"
                >
                    +
                </button>
            </div>

            {/* Collections List */}
            {collections.length === 0 ? (
                <div className="px-4 py-3 text-text-tertiary text-[13px] text-center">
                    No collections yet
                </div>
            ) : (
                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                    {collections.map((collection) => (
                        <CollectionItem
                            key={collection.id}
                            collection={collection}
                            items={collectionItems[collection.id] || []}
                            onLoadItems={loadCollectionItems}
                            onItemClick={onItemClick}
                            onRename={handleRename}
                            onDelete={handleDelete}
                            onItemDelete={handleItemDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <NewCollectionModal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                onSubmit={addCollection}
            />

            <RenameCollectionModal
                isOpen={showRenameModal}
                collection={selectedCollection}
                onClose={() => {
                    setShowRenameModal(false);
                    setSelectedCollection(null);
                }}
                onSubmit={updateCollectionName}
            />
        </div>
    );
};

export default CollectionsList;
