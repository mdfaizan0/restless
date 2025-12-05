/**
 * Standard validation error response
 */
export const validationError = (message) => ({
    error: true,
    message,
    errorType: "VALIDATION"
})

/**
 * Validates User UID
 */
export const validateUID = (uid) => {
    if (!uid || typeof uid !== "string" || !uid.trim()) {
        return false
    }
    return true
}

/**
 * Validates Collection Name
 */
export const validateName = (name) => {
    if (!name || typeof name !== "string" || !name.trim()) {
        return false
    }
    return true
}

/**
 * Validates UUID format
 */
export const validateUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
}

/**
 * Validates HTTP Method
 */
export const validateMethod = (method) => {
    const allowed = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
    return allowed.includes(method?.toUpperCase())
}

/**
 * Validates URL
 */
export const validateURL = (url) => {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}
