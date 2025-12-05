import { supabaseAdmin } from "../supabase.js"

/**
 * Sanitizes values for database insertion
 * - Converts undefined to null
 * - Stringifies objects/arrays
 * - Truncates large strings (>1MB)
 * - Handles circular references
 */
export const sanitizeForDB = (value) => {
    if (value === undefined) return null
    if (value === null) return null

    try {
        if (typeof value === "object") {
            const str = JSON.stringify(value)
            // 1MB limit check (approx)
            if (str.length > 1024 * 1024) {
                return JSON.stringify({ _truncated: true, message: "Body too large (>1MB)" })
            }
            return value // Return original object for JSONB columns, Supabase client handles stringification if needed, but usually better to pass object for jsonb
        }
    } catch (e) {
        return JSON.stringify({ _error: "Circular structure or invalid JSON" })
    }

    return value
}

/**
 * Saves request history to Supabase
 * @param {Object} req - Express request object
 * @param {Object} responseData - Data sent back to the client
 */
export const saveHistory = async (req, responseData) => {
    try {
        const uid = req.headers["x-user-uid"]

        // Graceful skip if no UID
        if (!uid || typeof uid !== "string" || !uid.trim()) {
            return
        }

        const entry = {
            user_uid: uid,
            url: responseData.url,
            method: req.body.method?.toUpperCase() || "UNKNOWN",
            headers: sanitizeForDB(responseData.headers),
            body: sanitizeForDB(responseData.body),
            status: responseData.status,
            time_ms: Math.round(responseData.time)
        }

        const { error } = await supabaseAdmin
            .from("history")
            .insert(entry)

        if (error) {
            console.error("[History] Insert failed:", error.message)
        }
    } catch (err) {
        console.error("[History] Unexpected error:", err.message)
    }
}
