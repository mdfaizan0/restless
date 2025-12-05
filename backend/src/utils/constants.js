export const TLSErrorValue = {
    UNABLE_TO_GET_ISSUER_CERT: "Unable to get issuer certificate",
    UNABLE_TO_GET_CRL: "Unable to get certificate CRL",
    UNABLE_TO_DECRYPT_CERT_SIGNATURE: "Unable to decrypt certificate's signature",
    UNABLE_TO_DECRYPT_CRL_SIGNATURE: "Unable to decrypt CRL's signature",
    UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY: "Unable to decode issuer public key",
    CERT_SIGNATURE_FAILURE: "Certificate signature failure",
    CRL_SIGNATURE_FAILURE: "CRL signature failure",
    CERT_NOT_YET_VALID: "Certificate is not yet valid",
    CERT_HAS_EXPIRED: "Certificate has expired",
    CRL_NOT_YET_VALID: "CRL is not yet valid",
    CRL_HAS_EXPIRED: "CRL has expired",
    ERROR_IN_CERT_NOT_BEFORE_FIELD: "Format error in certificate's notBefore field",
    ERROR_IN_CERT_NOT_AFTER_FIELD: "Format error in certificate's notAfter field",
    ERROR_IN_CRL_LAST_UPDATE_FIELD: "Format error in CRL's lastUpdate field",
    ERROR_IN_CRL_NEXT_UPDATE_FIELD: "Format error in CRL's nextUpdate field",
    OUT_OF_MEM: "Out of memory",
    DEPTH_ZERO_SELF_SIGNED_CERT: "Self signed certificate",
    SELF_SIGNED_CERT_IN_CHAIN: "Self signed certificate in certificate chain",
    UNABLE_TO_GET_ISSUER_CERT_LOCALLY: "Unable to get local issuer certificate",
    UNABLE_TO_VERIFY_LEAF_SIGNATURE: "Unable to verify the first certificate",
    CERT_CHAIN_TOO_LONG: "Certificate chain too long",
    CERT_REVOKED: "Certificate revoked",
    INVALID_CA: "Invalid CA certificate",
    PATH_LENGTH_EXCEEDED: "Path length constraint exceeded",
    INVALID_PURPOSE: "Unsupported certificate purpose",
    CERT_UNTRUSTED: "Certificate not trusted",
    CERT_REJECTED: "Certificate rejected",
    HOSTNAME_MISMATCH: "Hostname mismatch"
}

export const binaryTypes = ["application/octet-stream", "image/jpeg", "image/png", "image/gif", "image/webp", "audio/mpeg", "audio/wav", "video/mp4", "video/webm", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

export const forbiddenHeaders = ['accept-charset', 'accept-encoding', 'access-control-request-headers', 'access-control-request-method', 'connection', 'content-length', 'cookie', 'date', 'dnt', 'expect', 'host', 'keep-alive', 'origin', 'referer', 'set-cookie', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'via']

export function getErrorObj(errorType, message, code, time) {
    return {
        error: true,
        errorType: errorType.toUpperCase(),
        code,
        message,
        time
    }
}