import { getErrorObj, TLSErrorValue } from "./constants.js"

export const handleProxyError = (error, timeTaken, res) => {
    if (error.name === "AbortError") {
        return res.json(getErrorObj("TIMEOUT", "Request timed out after 60 seconds", error.code, timeTaken))
    } else if (["ENOTFOUND", "EAI_AGAIN"].includes(error.code)) {
        return res.json(getErrorObj("DNS_FAILURE", "DNS Lookup failed", error.code, timeTaken))
    } else if (error.code === "ECONNREFUSED") {
        return res.json(getErrorObj("CONNECTION_REFUSED", "Connection refused by the server", error.code, timeTaken))
    } else if (error.code === "ECONNRESET") {
        return res.json(getErrorObj("CONNECTION_RESET", "Connection got reset by peer", error.code, timeTaken))
    } else if (error.code && TLSErrorValue[error.code]) {
        return res.json(getErrorObj("SSL_ERROR", TLSErrorValue[error.code], error.code, timeTaken))
    } else {
        return res.json(getErrorObj("UNKNOWN_ERROR", error.message || "Unknown error occured", error.code, timeTaken))
    }
}