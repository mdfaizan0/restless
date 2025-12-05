const URLInput = ({ url, setUrl, onEnter }) => {
    return (
        <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onEnter()}
            placeholder="Enter request URL"
            className="flex-1 bg-surface text-text-primary border border-border rounded px-4 outline-none h-[42px] font-mono text-sm transition-colors focus:border-accent"
        />
    );
};

export default URLInput;
