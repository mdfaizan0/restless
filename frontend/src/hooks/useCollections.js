import { useState, useEffect } from 'react';
import {
    fetchCollections,
    createCollection,
    renameCollection,
    deleteCollection,
    fetchCollectionItems,
    createCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../services/collectionsService';

/**
 * Custom hook to manage collections and their items
 */
export const useCollections = () => {
    const [collections, setCollections] = useState([]);
    const [collectionItems, setCollectionItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCollections = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchCollections();
            setCollections(data);
        } catch (err) {
            console.error('[useCollections] Load error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCollectionItems = async (collectionId) => {
        try {
            const items = await fetchCollectionItems(collectionId);
            setCollectionItems(prev => ({
                ...prev,
                [collectionId]: items
            }));
        } catch (err) {
            console.error('[useCollections] Load items error:', err);
        }
    };

    const addCollection = async (name) => {
        const result = await createCollection(name);

        if (result.success) {
            setCollections(prev => [...prev, result.collection]);
        }

        return result;
    };

    const updateCollectionName = async (id, name) => {
        // Optimistic update
        const previousCollections = [...collections];
        setCollections(prev =>
            prev.map(col => col.id === id ? { ...col, name } : col)
        );

        const success = await renameCollection(id, name);

        if (!success) {
            // Rollback
            setCollections(previousCollections);
            alert('Failed to rename collection. Please try again.');
        }

        return success;
    };

    const removeCollection = async (id) => {
        // Optimistic update
        const previousCollections = [...collections];
        setCollections(prev => prev.filter(col => col.id !== id));

        // Remove items from cache
        setCollectionItems(prev => {
            const newItems = { ...prev };
            delete newItems[id];
            return newItems;
        });

        const success = await deleteCollection(id);

        if (!success) {
            // Rollback
            setCollections(previousCollections);
            alert('Failed to delete collection. Please try again.');
        }

        return success;
    };

    const addItem = async (collectionId, itemData) => {
        const result = await createCollectionItem(collectionId, itemData);

        if (result.success) {
            // Add to local cache
            setCollectionItems(prev => ({
                ...prev,
                [collectionId]: [...(prev[collectionId] || []), result.item]
            }));
        }

        return result;
    };

    const updateItem = async (collectionId, itemId, itemData) => {
        // Optimistic update
        const previousItems = { ...collectionItems };
        setCollectionItems(prev => ({
            ...prev,
            [collectionId]: prev[collectionId]?.map(item =>
                item.id === itemId ? { ...item, ...itemData } : item
            ) || []
        }));

        const success = await updateCollectionItem(collectionId, itemId, itemData);

        if (!success) {
            // Rollback
            setCollectionItems(previousItems);
            alert('Failed to update item. Please try again.');
        }

        return success;
    };

    const removeItem = async (collectionId, itemId) => {
        // Optimistic update
        const previousItems = { ...collectionItems };
        setCollectionItems(prev => ({
            ...prev,
            [collectionId]: prev[collectionId]?.filter(item => item.id !== itemId) || []
        }));

        const success = await deleteCollectionItem(collectionId, itemId);

        if (!success) {
            // Rollback
            setCollectionItems(previousItems);
            alert('Failed to delete item. Please try again.');
        }

        return success;
    };

    useEffect(() => {
        loadCollections();
    }, []);

    return {
        collections,
        collectionItems,
        loading,
        error,
        loadCollections,
        loadCollectionItems,
        addCollection,
        updateCollectionName,
        removeCollection,
        addItem,
        updateItem,
        removeItem
    };
};
