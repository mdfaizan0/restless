import React, { useState, useEffect } from 'react';
import { useRequest } from '../hooks/useRequest';
import { useCollections } from '../hooks/useCollections';
import Sidebar from '../components/Sidebar/Sidebar';
import RequestBuilder from '../components/RequestBuilder/RequestBuilder';
import HeadersEditor from '../components/RequestBuilder/HeadersEditor';
import BodyEditor from '../components/RequestBuilder/BodyEditor';
import StatusBar from '../components/ResponseViewer/StatusBar';
import JSONViewer from '../components/ResponseViewer/JSONViewer';
import RawViewer from '../components/ResponseViewer/RawViewer';
import HeadersViewer from '../components/ResponseViewer/HeadersViewer';
import SaveToCollectionModal from '../components/Modals/SaveToCollectionModal';

const Home = () => {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState([]);
    const [body, setBody] = useState('');
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    const [activeResponseTab, setActiveResponseTab] = useState('JSON');
    const [showSaveModal, setShowSaveModal] = useState(false);

    const { status, response, error, duration, executeRequest } = useRequest();
    const { collections, addItem } = useCollections();

    const startResizing = (e) => {
        setIsResizing(true);
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e) => {
        if (isResizing) {
            let newWidth = e.clientX;
            if (newWidth < 220) newWidth = 220;
            if (newWidth > 420) newWidth = 420;
            setSidebarWidth(newWidth);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    const handleSend = () => {
        if (!url) return;

        // Convert headers array to object
        const headersObj = headers.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {});

        let parsedBody = undefined;
        if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
            try {
                parsedBody = body ? JSON.parse(body) : undefined;
            } catch (e) {
                alert('Invalid JSON in body');
                return;
            }
        }

        executeRequest({
            link: url,
            method,
            headers: headersObj,
            body: parsedBody
        });
    };

    const handleHistoryClick = (historyItem) => {
        setMethod(historyItem.method || 'GET');
        setUrl(historyItem.url || '');

        if (historyItem.headers && typeof historyItem.headers === 'object') {
            const headersArray = Object.entries(historyItem.headers).map(([key, value]) => ({
                key,
                value,
                enabled: true
            }));
            setHeaders(headersArray);
        } else {
            setHeaders([]);
        }

        if (historyItem.body) {
            try {
                const bodyStr = typeof historyItem.body === 'object'
                    ? JSON.stringify(historyItem.body, null, 2)
                    : historyItem.body;
                setBody(bodyStr);
            } catch (e) {
                setBody('');
            }
        } else {
            setBody('');
        }
    };

    const handleCollectionItemClick = (item) => {
        setMethod(item.method || 'GET');
        setUrl(item.url || '');

        if (item.headers && typeof item.headers === 'object') {
            const headersArray = Object.entries(item.headers).map(([key, value]) => ({
                key,
                value,
                enabled: true
            }));
            setHeaders(headersArray);
        } else {
            setHeaders([]);
        }

        if (item.body) {
            try {
                const bodyStr = typeof item.body === 'object'
                    ? JSON.stringify(item.body, null, 2)
                    : item.body;
                setBody(bodyStr);
            } catch (e) {
                setBody('');
            }
        } else {
            setBody('');
        }
    };

    const handleSaveToCollection = async (collectionId, itemData) => {
        let finalBody = itemData.body;
        if (typeof finalBody === 'string' && itemData.method !== 'GET' && itemData.method !== 'HEAD') {
            try {
                finalBody = JSON.parse(finalBody);
            } catch (e) {
                console.warn('Failed to parse body JSON for saving:', e);
            }
        }
        return await addItem(collectionId, { ...itemData, body: finalBody });
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar - Column 1 */}
            <div
                className="border-r border-border bg-bg shrink-0 relative"
                style={{ width: sidebarWidth }}
            >
                <Sidebar onHistoryClick={handleHistoryClick} onCollectionItemClick={handleCollectionItemClick} />
                <div
                    onMouseDown={startResizing}
                    className={`absolute top-0 -right-1 w-2 h-full cursor-col-resize z-10 transition-opacity duration-200 ${isResizing ? 'bg-accent opacity-50' : 'bg-transparent opacity-0'}`}
                />
            </div>

            {/* Request Builder - Column 2 */}
            <div className="flex-1 flex flex-col border-r border-border min-w-[300px] animate-[fadeIn_0.3s_ease-out]">
                <RequestBuilder
                    url={url}
                    setUrl={setUrl}
                    method={method}
                    setMethod={setMethod}
                    onSend={handleSend}
                    loading={status === 'loading'}
                    onSave={() => setShowSaveModal(true)}
                />

                <div className="flex-1 overflow-y-auto">
                    <HeadersEditor headers={headers} setHeaders={setHeaders} />
                    <div className="h-px bg-border my-2.5" />
                    <BodyEditor body={body} setBody={setBody} method={method} />
                </div>
            </div>

            {/* Response Viewer - Column 3 */}
            <div className="flex-1 flex flex-col min-w-[300px] bg-bg animate-[fadeIn_0.3s_ease-out_0.1s_backwards]">
                {status === 'idle' && (
                    <div className="flex-center h-full text-text-secondary">
                        Enter URL and send request
                    </div>
                )}

                {status === 'loading' && (
                    <div className="flex-center h-full text-accent">
                        Sending request...
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex-center h-full text-error flex-col gap-2.5">
                        <div>Error: {error}</div>
                        {duration > 0 && <div>Time: {duration}ms</div>}
                    </div>
                )}

                {status === 'success' && response && (
                    <>
                        <StatusBar status={response.status} duration={duration} size={response.size} />

                        <div className="border-b border-border flex">
                            {['JSON', 'Raw', 'Headers'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveResponseTab(tab)}
                                    className={`bg-transparent border-none border-b-2 px-5 py-2.5 cursor-pointer text-[13px] font-medium transition-colors ${activeResponseTab === tab ? 'border-accent text-text-primary' : 'border-transparent text-text-secondary'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            {activeResponseTab === 'JSON' && (
                                <JSONViewer data={response.body} isBinary={response.isBinary} contentType={response.contentType} />
                            )}
                            {activeResponseTab === 'Raw' && (
                                <RawViewer data={response.rawBody || response.body} />
                            )}
                            {activeResponseTab === 'Headers' && (
                                <HeadersViewer headers={response.headers} />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Save to Collection Modal */}
            <SaveToCollectionModal
                isOpen={showSaveModal}
                collections={collections}
                currentRequest={{
                    url,
                    method,
                    headers: headers.reduce((acc, curr) => {
                        if (curr.key) acc[curr.key] = curr.value;
                        return acc;
                    }, {}),
                    body: body
                }}
                onClose={() => setShowSaveModal(false)}
                onSubmit={handleSaveToCollection}
            />
        </div>
    );
};

export default Home;
