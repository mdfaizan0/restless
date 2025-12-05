import { useState } from 'react';
import { sendProxyRequest } from '../services/apiClient';

export const useRequest = () => {
    const [status, setStatus] = useState('idle');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [duration, setDuration] = useState(0);

    const executeRequest = async (requestData) => {
        setStatus('loading');
        setResponse(null);
        setError(null);
        const startTime = performance.now();

        try {
            const result = await sendProxyRequest(requestData);
            const endTime = performance.now();

            if (result.error) {
                setError(result.message || 'Request failed');
                setStatus('error');
                setDuration(result.time ? Math.round(result.time) : Math.round(endTime - startTime));
            } else {
                setResponse(result);
                setStatus('success');
                setDuration(Math.round(result.time));
            }
        } catch (err) {
            const endTime = performance.now();
            setDuration(Math.round(endTime - startTime));
            setError(err.message || 'Network error');
            setStatus('error');
        }
    };

    return { status, response, error, duration, executeRequest };
};
