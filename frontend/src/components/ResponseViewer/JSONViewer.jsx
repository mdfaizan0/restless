import React, { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

const JSONViewer = ({ data, isBinary, contentType }) => {
    const [copied, setCopied] = useState(false);

    const jsonString = useMemo(() => {
        if (isBinary) return "Binary data detected";
        return JSON.stringify(data, null, 2);
    }, [data, isBinary]);

    const size = isBinary ? (data ? data.length : 0) : jsonString.length;

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getExtension = (type) => {
        if (!type) return '.bin';
        const mime = type.split(';')[0].trim();
        const extensions = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'application/pdf': '.pdf',
            'application/json': '.json',
            'text/plain': '.txt',
            'text/html': '.html',
            'application/xml': '.xml',
            'audio/mpeg': '.mp3',
            'video/mp4': '.mp4',
            'application/zip': '.zip',
            'application/octet-stream': '.bin'
        };
        return extensions[mime] || '.bin';
    };

    const shouldHighlight = !isBinary && size < 1024 * 1024;
    const highlighted = shouldHighlight
        ? Prism.highlight(jsonString, Prism.languages.json, 'json')
        : jsonString;

    return (
        <div className="h-full flex flex-col">
            {/* Controls Bar */}
            <div className="flex justify-between px-3 py-2 border-b border-border bg-surface items-center shrink-0">
                <div className="text-xs text-text-secondary">
                    {(size / 1024).toFixed(2)} KB
                </div>
                {!isBinary && (
                    <button
                        onClick={handleCopy}
                        className={`bg-transparent border border-border rounded px-2 py-1 text-xs cursor-pointer transition-all ${copied ? 'text-success' : 'text-text-primary'}`}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                )}
            </div>

            {/* Warning for large responses */}
            {!isBinary && size > 500 * 1024 && (
                <div className="bg-warning/10 text-warning p-2 text-xs text-center border-b border-warning shrink-0">
                    Large response detected ({(size / 1024).toFixed(0)} KB). Syntax highlighting disabled for performance.
                </div>
            )}

            {/* Content */}
            {isBinary ? (
                <div className="flex-center h-full flex-col gap-2.5 text-text-secondary italic">
                    <div className="text-2xl">📦</div>
                    <div>Binary Data Detected</div>
                    <div className="text-xs opacity-70">Cannot display raw binary content</div>
                    <button
                        onClick={() => {
                            try {
                                const byteCharacters = atob(data);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: contentType || 'application/octet-stream' });

                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                const ext = getExtension(contentType);
                                a.download = `download${ext}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            } catch (e) {
                                alert('Error downloading file: ' + e.message);
                            }
                        }}
                        className="mt-2.5 bg-accent text-white border-none rounded px-4 py-2 cursor-pointer text-[13px] font-medium"
                    >
                        Download File
                    </button>
                </div>
            ) : shouldHighlight ? (
                <pre
                    className="m-0 p-2.5 font-mono text-[13px] leading-normal text-text-primary overflow-auto flex-1 whitespace-pre-wrap break-all"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                />
            ) : (
                <pre className="m-0 p-2.5 font-mono text-[13px] leading-normal text-text-primary overflow-auto flex-1 whitespace-pre-wrap break-all">
                    {jsonString}
                </pre>
            )}
        </div>
    );
};

export default JSONViewer;
