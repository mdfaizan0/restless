export const parseHeaders = (headers, forbiddenHeaders) => {
    if (!headers || typeof headers !== 'object') return null;
    return Object.fromEntries(
        Object.entries(headers)
            .map(([key, value]) => [key.toLowerCase(), String(value).trim()])
            .filter(([_, value]) => String(value).trim().length > 0)
            .filter(([key, _]) => !forbiddenHeaders.includes(key))
            .filter(([key, _]) => !key.startsWith("sec-"))
            .filter(([key, _]) => !key.startsWith("proxy-"))
    )
}