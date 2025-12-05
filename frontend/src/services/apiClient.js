import { getLocalUID } from '../utils/localUID';

const PROXY_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/proxy`;

export const sendProxyRequest = async ({ link, method, headers, body }) => {
    const uid = getLocalUID();

    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-uid': uid,
        },
        body: JSON.stringify({
            link,
            method,
            headers,
            body,
        }),
    });

    const data = await response.json();
    return data;
};
