import express from "express";
import { supabaseAdmin } from "../supabase.js";

const historyRouter = express.Router();

/**
 * DELETE /history/:id
 * Deletes a single history entry
 */
historyRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.headers["x-user-uid"];

        // Validate UID
        if (!uid || typeof uid !== "string" || !uid.trim()) {
            return res.status(400).json({
                error: true,
                message: "Missing or invalid x-user-uid header"
            });
        }

        // Validate ID
        if (!id || !id.trim()) {
            return res.status(400).json({
                error: true,
                message: "Missing history ID"
            });
        }

        // Delete the entry (only if it belongs to this user)
        const { data, error } = await supabaseAdmin
            .from("history")
            .delete()
            .eq("id", id)
            .eq("user_uid", uid)
            .select();

        if (error) {
            console.error("[History Delete] Error:", error.message);
            return res.status(500).json({
                error: true,
                message: "Failed to delete history entry"
            });
        }

        // Check if anything was deleted
        if (!data || data.length === 0) {
            return res.status(404).json({
                error: true,
                message: "History entry not found or unauthorized"
            });
        }

        return res.status(200).json({
            deleted: true,
            id: id
        });
    } catch (err) {
        console.error("[History Delete] Unexpected error:", err.message);
        return res.status(500).json({
            error: true,
            message: "Server error"
        });
    }
});

/**
 * DELETE /history
 * Clears all history entries for the user
 */
historyRouter.delete("/", async (req, res) => {
    try {
        const uid = req.headers["x-user-uid"];

        // Validate UID
        if (!uid || typeof uid !== "string" || !uid.trim()) {
            return res.status(400).json({
                error: true,
                message: "Missing or invalid x-user-uid header"
            });
        }

        // Delete all entries for this user
        const { error, count } = await supabaseAdmin
            .from("history")
            .delete()
            .eq("user_uid", uid);

        if (error) {
            console.error("[History Clear] Error:", error.message);
            return res.status(500).json({
                error: true,
                message: "Failed to clear history"
            });
        }

        return res.status(200).json({
            cleared: true,
            count: count || 0
        });
    } catch (err) {
        console.error("[History Clear] Unexpected error:", err.message);
        return res.status(500).json({
            error: true,
            message: "Server error"
        });
    }
});

export default historyRouter;
