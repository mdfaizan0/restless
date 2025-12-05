import { useState, useEffect } from 'react';
import { fetchHistory, deleteHistoryItem, clearUserHistory } from '../services/historyService';
import { getLocalUID } from '../utils/localUID';

/**
 * Custom hook to manage history state
 * Fetches history on mount and provides methods to refresh and delete
 */
export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const uid = getLocalUID();
            const data = await fetchHistory(uid);
            setHistory(data);
        } catch (err) {
            console.error('[useHistory] Load error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id) => {
        // Store the item in case we need to rollback
        const itemToRemove = history.find(item => item.id === id);

        if (!itemToRemove) return false;

        // Optimistically update UI immediately
        setHistory(prev => prev.filter(item => item.id !== id));

        // Try to delete from backend
        const uid = getLocalUID();
        const success = await deleteHistoryItem(id, uid);

        if (!success) {
            // Rollback: add the item back
            setHistory(prev => {
                // Insert back in original position (sorted by created_at)
                const newHistory = [...prev, itemToRemove];
                return newHistory.sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );
            });

            // Notify user of the error
            alert('Failed to delete history entry. Please try again.');
        }

        return success;
    };

    const clearAll = async () => {
        // Store current history in case we need to rollback
        const previousHistory = [...history];

        // Optimistically clear UI immediately
        setHistory([]);

        // Try to clear from backend
        const uid = getLocalUID();
        const success = await clearUserHistory(uid);

        if (!success) {
            // Rollback: restore previous history
            setHistory(previousHistory);

            // Notify user of the error
            alert('Failed to clear history. Please try again.');
        }

        return success;
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return {
        history,
        loading,
        error,
        refreshHistory: loadHistory,
        removeItem,
        clearAll
    };
};
