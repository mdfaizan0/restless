import React from 'react';
import { motion } from 'framer-motion';

const SendButton = ({ onClick, loading }) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 12px var(--color-accent-dim)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`bg-accent text-white border-none rounded-r-md px-6 font-bold h-[42px] flex items-center justify-center gap-2 min-w-[100px] relative overflow-hidden ${loading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer opacity-100'}`}
        >
            {loading && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
            )}
            {loading ? 'SENDING...' : 'SEND'}

            {!loading && (
                <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }}
                    whileTap={{ opacity: 1, scale: 2, transition: { duration: 0.3 } }}
                />
            )}
        </motion.button>
    );
};

export default SendButton;
