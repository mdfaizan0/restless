import { getLocalUID } from '../utils/localUID';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch all collections for the user
 */
export const fetchCollections = async () => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections`, {
            headers: {
                'x-user-uid': uid
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Fetch error:', data.message);
            return [];
        }

        return data.data || [];
    } catch (err) {
        console.error('[Collections Service] Fetch error:', err);
        return [];
    }
};

/**
 * Create a new collection
 */
export const createCollection = async (name) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': uid
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Create error:', data.message);
            return { success: false, error: data.message };
        }

        return { success: true, collection: data.data };
    } catch (err) {
        console.error('[Collections Service] Create error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Rename a collection
 */
export const renameCollection = async (id, name) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': uid
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Rename error:', data.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[Collections Service] Rename error:', err);
        return false;
    }
};

/**
 * Delete a collection
 */
export const deleteCollection = async (id) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${id}`, {
            method: 'DELETE',
            headers: {
                'x-user-uid': uid
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Delete error:', data.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[Collections Service] Delete error:', err);
        return false;
    }
};

/**
 * Fetch items for a collection
 */
export const fetchCollectionItems = async (collectionId) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${collectionId}/items`, {
            headers: {
                'x-user-uid': uid
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Fetch items error:', data.message);
            return [];
        }

        return data.data || [];
    } catch (err) {
        console.error('[Collections Service] Fetch items error:', err);
        return [];
    }
};

/**
 * Create a collection item
 */
export const createCollectionItem = async (collectionId, itemData) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${collectionId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': uid
            },
            body: JSON.stringify(itemData)
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Create item error:', data.message);
            return { success: false, error: data.message };
        }

        return { success: true, item: data.data };
    } catch (err) {
        console.error('[Collections Service] Create item error:', err);
        return { success: false, error: err.message };
    }
};

/**
 * Update a collection item
 */
export const updateCollectionItem = async (collectionId, itemId, itemData) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${collectionId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-user-uid': uid
            },
            body: JSON.stringify(itemData)
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Update item error:', data.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[Collections Service] Update item error:', err);
        return false;
    }
};

/**
 * Delete a collection item
 */
export const deleteCollectionItem = async (collectionId, itemId) => {
    try {
        const uid = getLocalUID();
        const response = await fetch(`${API_BASE}/collections/${collectionId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'x-user-uid': uid
            }
        });

        const data = await response.json();

        if (data.error) {
            console.error('[Collections Service] Delete item error:', data.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('[Collections Service] Delete item error:', err);
        return false;
    }
};
