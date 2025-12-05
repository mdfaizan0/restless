import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
 * Individual collection with expandable items
 */
const CollectionItem = ({ collection, items, onLoadItems, onItemClick, onRename, onDelete, onItemDelete, onItemEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const handleToggle = () => {
        if (!isExpanded && items.length === 0) {
            onLoadItems(collection.id);
        }
        setIsExpanded(!isExpanded);
    };

    const handleItemClick = (item) => {
        onItemClick(item);
    };

    const handleItemDelete = (e, itemId) => {
        e.stopPropagation();
        onItemDelete(collection.id, itemId);
    };

    return (
        <div className="border-b border-border last:border-b-0">
            {/* Collection Header */}
            <div
                className="relative px-3 py-2 cursor-pointer flex items-center gap-2 text-[13px] transition-colors hover:bg-surface-3 border-l-2 border-transparent hover:border-accent"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Expand/Collapse Arrow */}
                <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-tertiary text-xs"
                    onClick={handleToggle}
                >
                    ▶
                </motion.span>

                {/* Collection Name */}
                <span
                    onClick={handleToggle}
                    className={`flex-1 font-medium transition-colors ${isHovered ? 'text-text-primary' : 'text-text-secondary'}`}
                >
                    {collection.name}
                </span>

                {/* Item Count */}
                <span className="text-[11px] text-text-tertiary">
                    {items.length}
                </span>

                {/* Actions - absolutely positioned */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 transition-opacity duration-150 pointer-events-none rounded flex gap-1"
                    style={{
                        right: '6px',
                        opacity: isHovered ? 1 : 0,
                        backgroundColor: 'var(--color-surface-3)',
                        paddingLeft: '6px'
                    }}
                >
                    {/* Rename Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRename(collection);
                        }}
                        className="p-1 rounded transition-colors pointer-events-auto text-text-secondary hover:text-text-primary"
                        title="Rename collection"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(collection.id);
                        }}
                        className="p-1 rounded transition-colors pointer-events-auto"
                        style={{ color: 'var(--color-method-delete)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b6b'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-method-delete)'}
                        title="Delete collection"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Collection Items */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {items.length === 0 ? (
                            <div className="px-8 py-2 text-[12px] text-text-tertiary">
                                No items yet
                            </div>
                        ) : (
                            <div>
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        onMouseEnter={() => setHoveredItemId(item.id)}
                                        onMouseLeave={() => setHoveredItemId(null)}
                                        className="relative pl-8 pr-3 py-1.5 cursor-pointer flex items-center gap-2 text-[12px] transition-colors hover:bg-surface-2 border-l-2 border-transparent hover:border-accent"
                                    >
                                        {/* Method Badge */}
                                        <span
                                            className="font-bold text-[10px] min-w-[40px] text-center px-1 py-0.5 rounded"
                                            style={{
                                                color: getMethodColor(item.method),
                                                backgroundColor: `${getMethodColor(item.method)}15`
                                            }}
                                        >
                                            {item.method}
                                        </span>

                                        {/* URL */}
                                        <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${hoveredItemId === item.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                                            {item.url}
                                        </span>

                                        {/* Delete Icon */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 transition-opacity duration-150 pointer-events-none rounded"
                                            style={{
                                                right: '6px',
                                                opacity: hoveredItemId === item.id ? 1 : 0,
                                                backgroundColor: 'var(--color-surface-2)',
                                                paddingLeft: '6px'
                                            }}
                                        >
                                            <button
                                                onClick={(e) => handleItemDelete(e, item.id)}
                                                className="p-1 rounded transition-colors pointer-events-auto"
                                                style={{ color: 'var(--color-method-delete)', cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b6b'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-method-delete)'}
                                                title="Delete item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollectionItem;
