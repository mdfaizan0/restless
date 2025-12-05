const HeadersViewer = ({ headers }) => {
    if (!headers) return <div style={{ padding: '10px', color: 'var(--text-secondary)' }}>No headers</div>;

    return (
        <div style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '13px', overflow: 'auto', height: '100%' }}>
            {Object.entries(headers).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '150px', fontWeight: 'bold' }}>{key}:</span>
                    <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{value}</span>
                </div>
            ))}
        </div>
    );
};

export default HeadersViewer;
