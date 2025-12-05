import React from 'react';
import { useHistory } from '../../hooks/useHistory';
import HistoryItem from './HistoryItem';

/**
 * HistoryList component - displays user's request history
 * Fetches from Supabase and allows clicking to populate request builder
 */
const HistoryList = ({ onHistoryClick }) => {
    const { history, loading, error, removeItem, clearAll } = useHistory();

    const handleClearAll = () => {
        const confirmed = window.confirm(
            `Are you sure you want to clear all ${history.length} history entries? This cannot be undone.`
        );

        if (confirmed) {
            clearAll();
        }
    };

    const handleDeleteItem = async (id) => {
        await removeItem(id);
    };

    if (loading) {
        return (
            <div className="px-4 py-3 text-text-tertiary text-[13px] text-center">
                Loading history...
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 py-3 text-error text-[13px] text-center">
                Failed to load history
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="px-4 py-3 text-text-tertiary text-[13px] text-center">
                No history yet
            </div>
        );
    }

    return (
        <div>
            {/* Clear All Button */}
            <div className="px-3 pb-2 flex justify-end">
                <button
                    onClick={handleClearAll}
                    className="text-[11px] text-text-tertiary hover:text-error transition-colors cursor-pointer bg-transparent border-none"
                    title="Clear all history"
                >
                    Clear All
                </button>
            </div>

            {/* History Items */}
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                {history.map((item) => (
                    <HistoryItem
                        key={item.id}
                        item={item}
                        onClick={onHistoryClick}
                        onDelete={handleDeleteItem}
                    />
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
