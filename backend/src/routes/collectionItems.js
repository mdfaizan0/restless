import express from "express"
import { supabaseAdmin } from "../supabase.js"
import {
    validateUID,
    validateUUID,
    validateMethod,
    validateURL,
    validationError
} from "../utils/validation.js"
import { sanitizeForDB } from "../utils/history.js" // Reusing sanitize helper

const collectionItemsRouter = express.Router()

// Add item to a collection
collectionItemsRouter.post("/:id/items", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { id } = req.params
        const { url, method, headers, body } = req.body

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(id)) {
            return res.status(400).json(validationError("Invalid collection ID"))
        }
        if (!validateURL(url)) {
            return res.status(400).json(validationError("Invalid URL"))
        }
        if (!validateMethod(method)) {
            return res.status(400).json(validationError("Invalid HTTP method"))
        }

        // Verify collection ownership first
        const { data: collection, error: collectionError } = await supabaseAdmin
            .from("collections")
            .select("id")
            .eq("id", id)
            .eq("user_uid", uid)
            .single()

        if (collectionError || !collection) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        const { data, error } = await supabaseAdmin
            .from("collection_items")
            .insert({
                collection_id: id,
                url: url.trim(),
                method: method.toUpperCase(),
                headers: sanitizeForDB(headers),
                body: sanitizeForDB(body)
            })
            .select()
            .single()

        if (error) {
            console.error("Add Item Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        return res.status(201).json({ error: false, data })
    } catch (error) {
        console.error("Add Item Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Get all items under a collection
collectionItemsRouter.get("/:id/items", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { id } = req.params

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(id)) {
            return res.status(400).json(validationError("Invalid collection ID"))
        }

        // Verify collection ownership
        const { data: collection, error: collectionError } = await supabaseAdmin
            .from("collections")
            .select("id")
            .eq("id", id)
            .eq("user_uid", uid)
            .single()

        if (collectionError || !collection) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        const { data, error } = await supabaseAdmin
            .from("collection_items")
            .select("*")
            .eq("collection_id", id)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Get Items Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        return res.status(200).json({ error: false, data })
    } catch (error) {
        console.error("Get Items Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Update item
collectionItemsRouter.patch("/:collectionId/items/:itemId", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { collectionId, itemId } = req.params
        const { url, method, headers, body } = req.body

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(collectionId) || !validateUUID(itemId)) {
            return res.status(400).json(validationError("Invalid ID(s)"))
        }

        // Validate fields if present
        if (url && !validateURL(url)) return res.status(400).json(validationError("Invalid URL"))
        if (method && !validateMethod(method)) return res.status(400).json(validationError("Invalid HTTP method"))

        // Verify collection ownership
        const { data: collection, error: collectionError } = await supabaseAdmin
            .from("collections")
            .select("id")
            .eq("id", collectionId)
            .eq("user_uid", uid)
            .single()

        if (collectionError || !collection) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        const updates = {}
        if (url) updates.url = url.trim()
        if (method) updates.method = method.toUpperCase()
        if (headers !== undefined) updates.headers = sanitizeForDB(headers)
        if (body !== undefined) updates.body = sanitizeForDB(body)

        const { data, error } = await supabaseAdmin
            .from("collection_items")
            .update(updates)
            .eq("id", itemId)
            .eq("collection_id", collectionId)
            .select()
            .single()

        if (error) {
            console.error("Update Item Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        if (!data) {
            return res.status(404).json({ error: true, message: "Item not found", errorType: "NOT_FOUND" })
        }

        return res.status(200).json({ error: false, data })
    } catch (error) {
        console.error("Update Item Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Delete item
collectionItemsRouter.delete("/:collectionId/items/:itemId", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { collectionId, itemId } = req.params

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(collectionId) || !validateUUID(itemId)) {
            return res.status(400).json(validationError("Invalid ID(s)"))
        }

        // Verify collection ownership
        const { data: collection, error: collectionError } = await supabaseAdmin
            .from("collections")
            .select("id")
            .eq("id", collectionId)
            .eq("user_uid", uid)
            .single()

        if (collectionError || !collection) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        const { data, error } = await supabaseAdmin
            .from("collection_items")
            .delete()
            .eq("id", itemId)
            .eq("collection_id", collectionId)
            .select()
            .single()

        if (error) {
            console.error("Delete Item Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        if (!data) {
            return res.status(404).json({ error: true, message: "Item not found", errorType: "NOT_FOUND" })
        }

        return res.status(200).json({ error: false, data: { id: itemId, deleted: true } })
    } catch (error) {
        console.error("Delete Item Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

export default collectionItemsRouter
