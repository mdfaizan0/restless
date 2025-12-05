import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch history for a specific user
 * @param {string} userUID - The user's unique identifier
 * @returns {Promise<Array>} Array of history entries
 */
export const fetchHistory = async (userUID) => {
    try {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_uid', userUID)
            .order('created_at', { ascending: false })
            .limit(100); // Limit to last 100 requests

        if (error) {
            console.error('[History Service] Fetch error:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('[History Service] Unexpected error:', err);
        return [];
    }
};

/**
 * Delete a single history item
 * @param {string} id - History entry ID
 * @param {string} userUID - The user's unique identifier
 * @returns {Promise<boolean>} Success status
 */
export const deleteHistoryItem = async (id, userUID) => {
    try {
        const response = await fetch(`http://localhost:5000/history/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': userUID
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[History Service] Delete error:', data.message);
            return false;
        }

        return data.deleted === true;
    } catch (err) {
        console.error('[History Service] Delete error:', err);
        return false;
    }
};

/**
 * Clear all history for a user
 * @param {string} userUID - The user's unique identifier
 * @returns {Promise<boolean>} Success status
 */
export const clearUserHistory = async (userUID) => {
    try {
        const response = await fetch('http://localhost:5000/history', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': userUID
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[History Service] Clear error:', data.message);
            return false;
        }

        return data.cleared === true;
    } catch (err) {
        console.error('[History Service] Clear error:', err);
        return false;
    }
};

