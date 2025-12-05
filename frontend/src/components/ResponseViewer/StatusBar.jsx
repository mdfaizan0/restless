const StatusBar = ({ status, duration, size }) => {
    const getStatusColor = (s) => {
        if (s >= 200 && s < 300) return 'text-success';
        if (s >= 300 && s < 400) return 'text-warning';
        if (s >= 400) return 'text-error';
        return 'text-text-secondary';
    };

    const getStatusText = (s) => {
        if (s >= 200 && s < 300) return 'Success';
        if (s >= 300 && s < 400) return 'Redirect';
        if (s >= 400) return 'Client Error';
        if (s >= 500) return 'Server Error';
        return 'Unknown';
    };

    const getSizeUnit = (s) => {
        if (s >= 1024 * 1024) return `${(s / 1024 / 1024).toFixed(2)} MB`;
        if (s >= 1024) return `${(s / 1024).toFixed(2)} KB`;
        return `${s} B`;
    };

    const formatDuration = (d) => {
        if (d > 1000) return `${(d / 1000).toFixed(2)}s`;
        return `${d}ms`;
    }

    const getBgColor = (s) => {
        if (s >= 400) return 'bg-error/10';
        if (s >= 300) return 'bg-warning/10';
        return 'bg-success/10';
    };

    return (
        <div className="flex gap-5 px-4 py-2.5 border-b border-border text-[13px] font-mono text-text-secondary bg-surface items-center pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-none">
                Status:
                <span className={`px-2 py-0.5 rounded-xl text-xs font-semibold uppercase inline-flex items-center justify-center ${getBgColor(status)} ${getStatusColor(status)}`}>
                    {status} {getStatusText(status)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                Time: <span className={getStatusColor(status)}>{formatDuration(duration)}</span>
            </div>
            {size && (
                <div className="flex items-center gap-2">
                    Size: <span className={getStatusColor(status)}>{getSizeUnit(size)}</span>
                </div>
            )}
        </div>
    );
};

export default StatusBar;
