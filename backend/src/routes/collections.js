import express from "express"
import { supabaseAdmin } from "../supabase.js"
import {
    validateUID,
    validateName,
    validateUUID,
    validationError
} from "../utils/validation.js"

const collectionsRouter = express.Router()

// Create a new collection
collectionsRouter.post("/", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { name } = req.body

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateName(name)) {
            return res.status(400).json(validationError("Collection name is required"))
        }

        const { data, error } = await supabaseAdmin
            .from("collections")
            .insert({
                user_uid: uid,
                name: name.trim()
            })
            .select()
            .single()

        if (error) {
            console.error("Create Collection Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        return res.status(201).json({ error: false, data })
    } catch (error) {
        console.error("Create Collection Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Get all collections for a user
collectionsRouter.get("/", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }

        const { data, error } = await supabaseAdmin
            .from("collections")
            .select("*")
            .eq("user_uid", uid)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Get Collections Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        return res.status(200).json({ error: false, data })
    } catch (error) {
        console.error("Get Collections Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Rename a collection
collectionsRouter.patch("/:id", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { id } = req.params
        const { name } = req.body

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(id)) {
            return res.status(400).json(validationError("Invalid collection ID"))
        }
        if (!validateName(name)) {
            return res.status(400).json(validationError("Collection name is required"))
        }

        // Verify ownership and update
        const { data, error } = await supabaseAdmin
            .from("collections")
            .update({ name: name.trim() })
            .eq("id", id)
            .eq("user_uid", uid)
            .select()
            .single()

        if (error) {
            console.error("Rename Collection Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        if (!data) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        return res.status(200).json({ error: false, data })
    } catch (error) {
        console.error("Rename Collection Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

// Delete a collection
collectionsRouter.delete("/:id", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"]
        const { id } = req.params

        if (!validateUID(uid)) {
            return res.status(400).json(validationError("Missing or invalid x-user-uid header"))
        }
        if (!validateUUID(id)) {
            return res.status(400).json(validationError("Invalid collection ID"))
        }

        // Verify ownership and delete
        const { data, error } = await supabaseAdmin
            .from("collections")
            .delete()
            .eq("id", id)
            .eq("user_uid", uid)
            .select()

        if (error) {
            console.error("Delete Collection Error:", error)
            return res.status(500).json({ error: true, message: "Database error", errorType: "DB_ERROR" })
        }

        if (data.length === 0) {
            return res.status(404).json({ error: true, message: "Collection not found or access denied", errorType: "NOT_FOUND" })
        }

        return res.status(200).json({ error: false, data: { id, deleted: true } })
    } catch (error) {
        console.error("Delete Collection Exception:", error)
        return res.status(500).json({ error: true, message: "Internal server error", errorType: "UNKNOWN" })
    }
})

export default collectionsRouter
