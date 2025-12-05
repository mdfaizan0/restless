import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParamsEditor = ({ params, setParams }) => {
    const handleAddParam = () => {
        setParams([
            ...params,
            { id: Date.now().toString(), key: '', value: '', active: true }
        ]);
    };

    const handleUpdateParam = (id, field, value) => {
        setParams(params.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleRemoveParam = (id) => {
        setParams(params.filter(p => p.id !== id));
    };

    const handleToggleParam = (id) => {
        setParams(params.map(p =>
            p.id === id ? { ...p, active: !p.active } : p
        ));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-2 border-b border-border">
                <span className="text-sm font-semibold text-text-secondary">Query Params</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div className="flex flex-col gap-1">
                    <AnimatePresence initial={false}>
                        {params.map((param) => (
                            <motion.div
                                key={param.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 group relative pr-8"
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={param.active}
                                    onChange={() => handleToggleParam(param.id)}
                                    className="w-4 h-4 rounded border-border bg-surface accent-accent cursor-pointer"
                                />

                                {/* Key Input */}
                                <input
                                    type="text"
                                    value={param.key}
                                    onChange={(e) => handleUpdateParam(param.id, 'key', e.target.value)}
                                    placeholder="Key"
                                    className={`flex-1 bg-surface border border-border rounded px-2 py-1.5 text-sm font-mono outline-none focus:border-accent transition-colors ${!param.active && 'opacity-50 line-through text-text-tertiary'}`}
                                />

                                {/* Value Input */}
                                <input
                                    type="text"
                                    value={param.value}
                                    onChange={(e) => handleUpdateParam(param.id, 'value', e.target.value)}
                                    placeholder="Value"
                                    className={`flex-1 bg-surface border border-border rounded px-2 py-1.5 text-sm font-mono outline-none focus:border-accent transition-colors ${!param.active && 'opacity-50 line-through text-text-tertiary'}`}
                                />

                                {/* Delete Button - Absolute */}
                                <button
                                    onClick={() => handleRemoveParam(param.id)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete parameter"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button
                    onClick={handleAddParam}
                    className="mt-2 flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Parameter
                </button>
            </div>
        </div>
    );
};

export default ParamsEditor;
