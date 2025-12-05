import { useState, useEffect, useRef } from 'react';
import MethodSelector from './MethodSelector';
import URLInput from './URLInput';
import SendButton from './SendButton';
import ParamsEditor from './ParamsEditor';

const RequestBuilder = ({
    url,
    setUrl,
    method,
    setMethod,
    onSend,
    loading,
    onSave
}) => {
    const [params, setParams] = useState([]);
    const [showParams, setShowParams] = useState(false);

    // Ref to track if the params update came from the user editing the table
    const isUserEditingParams = useRef(false);
    // Ref to prevent circular update loops
    const ignoreNextUrlUpdate = useRef(false);

    // 1. URL -> Params Sync
    // Runs whenever the URL changes (e.g. user typing in input)
    useEffect(() => {
        // If the URL change was caused by us updating the params, ignore it
        if (ignoreNextUrlUpdate.current) {
            ignoreNextUrlUpdate.current = false;
            return;
        }

        try {
            if (!url) {
                setParams([]);
                return;
            }

            const queryString = url.split('?')[1];

            // If no query string, we just clear active params
            if (queryString === undefined) {
                setParams(prev => prev.filter(p => !p.active));
                return;
            }

            const searchParams = new URLSearchParams(queryString);
            const newParams = [];
            const usedIds = new Set();
            const currentActiveParams = params.filter(p => p.active);

            // Build new params list from URL, trying to reuse existing IDs to prevent re-renders
            searchParams.forEach((value, key) => {
                // Try to find a matching param (same key) that hasn't been used yet
                const match = currentActiveParams.find(p => p.key === key && !usedIds.has(p.id));

                if (match) {
                    usedIds.add(match.id);
                    newParams.push({ ...match, value, active: true });
                } else {
                    newParams.push({
                        id: Date.now().toString() + Math.random(),
                        key,
                        value,
                        active: true
                    });
                }
            });

            // Append inactive params from previous state
            const finalParams = [...newParams, ...params.filter(p => !p.active)];

            setParams(finalParams);
        } catch (e) {
            console.error("Error parsing URL params:", e);
        }
    }, [url]);

    // 2. Params -> URL Sync
    // Only runs when params change AND it was initiated by the user editing the table
    useEffect(() => {
        if (!isUserEditingParams.current) {
            return;
        }
        isUserEditingParams.current = false;

        const buildUrl = () => {
            try {
                const baseUrl = url.split('?')[0] || '';
                const activeParams = params.filter(p => p.active && p.key);

                if (activeParams.length === 0) {
                    return baseUrl;
                }

                const searchParams = new URLSearchParams();
                activeParams.forEach(p => {
                    searchParams.append(p.key, p.value);
                });

                return `${baseUrl}?${searchParams.toString()}`;
            } catch (e) {
                return url;
            }
        };

        const newUrl = buildUrl();
        if (newUrl !== url) {
            setUrl(newUrl);
        }
    }, [params]);

    // Wrappers for ParamsEditor to set the flag
    const handleParamsChange = (newParams) => {
        isUserEditingParams.current = true;
        ignoreNextUrlUpdate.current = true;
        setParams(newParams);
    };

    return (
        <div className="flex flex-col border-b border-border bg-surface">
            {/* Top Bar: Method, URL, Send */}
            <div className="p-4">
                <div className="flex gap-2">
                    <MethodSelector method={method} setMethod={setMethod} />
                    <URLInput
                        url={url}
                        setUrl={setUrl}
                        onEnter={onSend}
                    />
                    <SendButton onClick={onSend} loading={loading} />
                    <button
                        onClick={onSave}
                        className="px-3 py-2 bg-transparent border border-border text-text-secondary rounded hover:bg-surface-3 hover:text-text-primary transition-colors text-sm cursor-pointer"
                        title="Save to collection"
                    >
                        💾
                    </button>
                </div>

                {/* Params Toggle */}
                <div className="mt-2 flex items-center">
                    <button
                        onClick={() => setShowParams(!showParams)}
                        className={`text-xs font-medium px-2 py-1 rounded transition-colors ${showParams ? 'text-text-primary bg-surface-3' : 'text-text-tertiary hover:text-text-secondary'}`}
                    >
                        Query Params {params.length > 0 && `(${params.length})`}
                    </button>
                </div>
            </div>

            {/* Params Editor (Collapsible) */}
            {showParams && (
                <div className="h-[200px] border-t border-border animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
                    <ParamsEditor params={params} setParams={handleParamsChange} />
                </div>
            )}
        </div>
    );
};

export default RequestBuilder;