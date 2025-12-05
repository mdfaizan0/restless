const RawViewer = ({ data }) => {
    return (
        <textarea
            readOnly
            value={typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                padding: '10px',
                outline: 'none',
                resize: 'none'
            }}
        />
    );
};

export default RawViewer;
