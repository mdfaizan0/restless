import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollectionsList from './CollectionsList';
import HistoryList from './HistoryList';

const SidebarSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-3 cursor-pointer flex items-center justify-between select-none bg-bg transition-colors hover:bg-surface-2"
            >
                <span className="font-semibold text-[13px] text-text-secondary uppercase tracking-[0.5px]">
                    {title}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-tertiary text-xs"
                >
                    ▶
                </motion.span>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-2.5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Sidebar = ({ onHistoryClick, onCollectionItemClick }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 font-bold text-lg border-b border-border flex items-center gap-2.5 text-accent">
                <div className="flex items-center gap-2.5">
                    <img src="./assets/icons8-lightning-bolt-48.png" alt="restless" width="24" height="24" />
                    <span>Restless</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <SidebarSection title="Collections">
                    <CollectionsList onItemClick={onCollectionItemClick} />
                </SidebarSection>
                <SidebarSection title="History">
                    <HistoryList onHistoryClick={onHistoryClick} />
                </SidebarSection>
            </div>
        </div>
    );
};

export default Sidebar;
