import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const getMethodColor = (method) => {
    switch (method) {
        case 'GET': return 'text-method-get';
        case 'POST': return 'text-method-post';
        case 'PUT': return 'text-method-put';
        case 'DELETE': return 'text-method-delete';
        case 'PATCH': return 'text-method-patch';
        case 'HEAD':
        case 'OPTIONS': return 'text-method-head';
        default: return 'text-text-primary';
    }
};

const MethodSelector = ({ method, setMethod }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (isOpen) {
            const currentIndex = methods.indexOf(method);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % methods.length;
                setMethod(methods[nextIndex]);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + methods.length) % methods.length;
                setMethod(methods[prevIndex]);
            }
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative z-10"
            onKeyDown={handleKeyDown}
        >
            <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 8px var(--color-accent-dim)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-surface border border-border rounded-l-md px-4 font-bold outline-none cursor-pointer h-[42px] font-mono flex items-center justify-center min-w-[100px] text-[0.9rem] ${getMethodColor(method)}`}
            >
                {method}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute font-mono top-full left-0 w-full bg-surface border border-border rounded-md mt-1 overflow-hidden shadow-lg"
                    >
                        {methods.map((m) => (
                            <div
                                key={m}
                                onClick={() => {
                                    setMethod(m);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2 cursor-pointer font-bold font-mono text-[0.85rem] transition-colors hover:bg-surface-3 ${getMethodColor(m)} ${method === m ? 'bg-surface-2' : 'bg-transparent'}`}
                            >
                                {m}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MethodSelector;
