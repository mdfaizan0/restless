import React, { useState } from 'react';

/**
 * Get color for HTTP method badge
 */
const getMethodColor = (method) => {
    const colors = {
        GET: 'var(--color-method-get)',
        POST: 'var(--color-method-post)',
        PUT: 'var(--color-method-put)',
        PATCH: 'var(--color-method-patch)',
        DELETE: 'var(--color-method-delete)',
        HEAD: 'var(--color-method-head)',
        OPTIONS: 'var(--color-method-options)'
    };
    return colors[method?.toUpperCase()] || '#6b7280';
};

/**
 * Get color for status code badge
 */
const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'var(--color-success)';
    if (status >= 300 && status < 400) return 'var(--color-info)';
    if (status >= 400 && status < 500) return 'var(--color-warning)';
    if (status >= 500) return 'var(--color-error)';
    return 'var(--color-text-tertiary)';
};

/**
 * Format timestamp to human-readable format
 */
const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Individual history item component
 */
const HistoryItem = React.memo(({ item, onClick, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const methodColor = getMethodColor(item.method);
    const statusColor = getStatusColor(item.status);

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering onClick
        if (onDelete) {
            onDelete(item.id);
        }
    };

    return (
        <div
            onClick={() => onClick(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative px-3 py-2 cursor-pointer flex items-center gap-2 text-[13px] transition-colors hover:bg-surface-3 border-l-2 border-transparent hover:border-accent"
        >
            {/* Method Badge */}
            <span
                className="font-bold text-[11px] min-w-[45px] text-center px-1.5 py-0.5 rounded"
                style={{
                    color: methodColor,
                    backgroundColor: `${methodColor}15`
                }}
            >
                {item.method}
            </span>

            {/* URL */}
            <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${isHovered ? 'text-text-primary' : 'text-text-secondary'}`}>
                {item.url}
            </span>

            {/* Status Code Badge */}
            {item.status && (
                <span
                    className="font-semibold text-[11px] min-w-[35px] text-center px-1.5 py-0.5 rounded"
                    style={{
                        color: statusColor,
                        backgroundColor: `${statusColor}15`
                    }}
                >
                    {item.status}
                </span>
            )}

            {/* Timestamp */}
            <span className="text-[11px] text-text-tertiary min-w-[50px] text-right">
                {formatTimestamp(item.created_at)}
            </span>

            {/* Delete Icon - absolutely positioned, appears on hover */}
            <div
                className="absolute top-1/2 -translate-y-1/2 transition-opacity duration-150 pointer-events-none rounded"
                style={{
                    right: '6px',
                    opacity: isHovered ? 1 : 0,
                    backgroundColor: 'var(--color-surface-3)',
                    paddingLeft: '6px'
                }}
            >
                <button
                    onClick={handleDelete}
                    className="p-1 rounded transition-colors pointer-events-auto"
                    style={{
                        color: 'var(--color-method-delete)',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b6b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-method-delete)'}
                    title="Delete this entry"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

HistoryItem.displayName = 'HistoryItem';

export default HistoryItem;
