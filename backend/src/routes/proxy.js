import express from "express"
import fetch from "node-fetch"
import { binaryTypes, forbiddenHeaders } from "../utils/constants.js"
import { parseHeaders } from "../utils/parseHeaders.js"
import { handleProxyError } from "../utils/handleErrors.js"
import { saveHistory } from "../utils/history.js"

const proxyRouter = express.Router()

proxyRouter.post("/", async (req, res) => {
    try {
        const { link, method, headers, body } = req.body
        const allowed = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"];
        if (!link.trim() || !method) {
            return res.json({
                error: true,
                errorType: "INPUT_ERROR",
                message: "URL and method are required"
            })
        }

        const finalMethod = method.toUpperCase()
        let finalUrl
        if (!allowed.includes(finalMethod)) {
            return res.json({
                error: true,
                errorType: "INPUT_ERROR",
                message: "Invalid method"
            })
        }
        try { finalUrl = new URL(link.trim()).href } catch (error) {
            return res.json({
                error: true,
                errorType: "INPUT_ERROR",
                message: "Invalid URL"
            })
        }

        const finalHeaders = parseHeaders(headers, forbiddenHeaders)
        if (!finalHeaders) {
            return res.json({
                error: true,
                errorType: "INPUT_ERROR",
                message: "Invalid headers"
            })
        }

        // Auto-set JSON header if body is object but no content-type provided
        if (body && typeof body === "object" && !finalHeaders["content-type"]) {
            finalHeaders["content-type"] = "application/json"
        }

        // Stringify JSON body when needed
        let finalBody = body
        if (finalHeaders["content-type"] === "application/json" && typeof body === "object") {
            try {
                finalBody = JSON.stringify(body)
            } catch (err) {
                return res.json({
                    error: true,
                    errorType: "INPUT_ERROR",
                    message: "Invalid JSON body"
                })
            }
        }

        // Remove body for no-body methods
        if (["GET", "HEAD"].includes(finalMethod)) {
            finalBody = undefined
        }

        const controller = new AbortController()
        const fetchOptions = {
            method: finalMethod,
            headers: finalHeaders,
            body: finalBody,
            signal: controller.signal
        }

        const start = performance.now()
        setTimeout(() => controller.abort(), 60000);
        try {
            const response = await fetch(finalUrl, fetchOptions)

            const contentType = response.headers.get("content-type") || null
            let isBinary = false
            if (contentType) {
                isBinary = binaryTypes.includes(contentType.split(";")[0])
            }

            let responseBody
            let rawBody
            let size

            if (isBinary) {
                const arrayBuffer = await response.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                rawBody = buffer.toString('base64')
                responseBody = rawBody // Send base64 string as body
                size = buffer.length
            } else {
                const rawText = await response.text()
                rawBody = rawText
                size = Buffer.byteLength(rawText, "utf8")
                try {
                    responseBody = JSON.parse(rawText)
                } catch (error) {
                    responseBody = rawText
                }
            }

            const contentLength = response.headers.get("content-length") ? Number(response.headers.get("content-length")) : size

            const responseData = {
                error: false,
                ok: response.ok,
                contentType,
                isBinary,
                contentLength,
                url: finalUrl,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                time: performance.now() - start,
                body: responseBody,
                rawBody: rawBody,
                size: size
            }

            saveHistory(req, responseData).catch(err => console.error("History save error:", err))

            return res.status(200).json(responseData)
        } catch (error) {
            const timeTaken = performance.now() - start;
            return handleProxyError(error, timeTaken, res)
        }
    } catch (error) {
        console.error("API Server Error", error)
    }
})

export default proxyRouter