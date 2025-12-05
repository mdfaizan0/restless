import { useState } from 'react';

const authTypes = [
    { label: 'No Auth', value: 'none' },
    { label: 'Bearer Token', value: 'bearer' },
    { label: 'API Key', value: 'apikey' },
    { label: 'Basic Auth', value: 'basic' },
    { label: 'Custom', value: 'custom' }
];

const HeadersEditor = ({ headers, setHeaders }) => {
    const [authType, setAuthType] = useState('none');
    const [authValue, setAuthValue] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const addHeader = (key, value) => {
        const index = headers.findIndex(h => h.key.toLowerCase() === key.toLowerCase());
        if (index !== -1) {
            const newHeaders = [...headers];
            newHeaders[index] = { key, value };
            setHeaders(newHeaders);
        } else {
            setHeaders([...headers, { key, value }]);
        }
    };

    const handleAuthChange = (type) => {
        setAuthType(type);
    };

    const applyAuth = () => {
        if (authType === 'bearer') {
            addHeader('Authorization', `Bearer ${authValue}`);
        } else if (authType === 'apikey') {
            addHeader(authKey, authValue);
        } else if (authType === 'basic') {
            const token = btoa(`${username}:${password}`);
            addHeader('Authorization', `Basic ${token}`);
        } else if (authType === 'custom') {
            addHeader('Authorization', authValue);
        }
    };

    const updateHeader = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const removeHeader = (index) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    return (
        <div className="p-2.5">
            {/* Auth Section */}
            <div className="mb-5 p-2.5 bg-surface-2 rounded-md">
                <div className="mb-2.5 font-semibold text-sm text-text-secondary">Authorization</div>
                <div className="flex gap-2.5 flex-wrap items-center">
                    <select
                        value={authType}
                        onChange={(e) => handleAuthChange(e.target.value)}
                        className="bg-surface border border-border text-text-primary p-2 rounded-md font-mono outline-none"
                    >
                        {authTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>

                    {authType === 'bearer' && (
                        <input
                            placeholder="Token"
                            value={authValue}
                            onChange={(e) => setAuthValue(e.target.value)}
                            onBlur={applyAuth}
                            className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                        />
                    )}

                    {authType === 'apikey' && (
                        <>
                            <input
                                placeholder="Key (e.g. X-API-Key)"
                                value={authKey}
                                onChange={(e) => setAuthKey(e.target.value)}
                                onBlur={applyAuth}
                                className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                            />
                            <input
                                placeholder="Value"
                                value={authValue}
                                onChange={(e) => setAuthValue(e.target.value)}
                                onBlur={applyAuth}
                                className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                            />
                        </>
                    )}

                    {authType === 'basic' && (
                        <>
                            <input
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={applyAuth}
                                className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={applyAuth}
                                className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                            />
                        </>
                    )}

                    {authType === 'custom' && (
                        <input
                            placeholder="Header Value"
                            value={authValue}
                            onChange={(e) => setAuthValue(e.target.value)}
                            onBlur={applyAuth}
                            className="flex-1 bg-surface border border-border text-text-primary p-2 rounded-md outline-none"
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-between mb-2.5 items-center">
                <span className="font-semibold text-sm text-text-secondary">Headers List</span>
                <div>
                    {headers.length > 0 && <button
                        onClick={() => setHeaders([])}
                        className="bg-transparent border border-border text-error rounded px-2 py-1 cursor-pointer text-xs transition-colors hover:bg-error-dim"
                    >
                        🗑 Clear All Headers
                    </button>}
                    <button
                        onClick={() => setHeaders([...headers, { key: '', value: '' }])}
                        className="bg-transparent border border-border text-accent rounded px-2 py-1 cursor-pointer text-xs transition-colors hover:bg-accent-dim"
                    >
                        + Add
                    </button>
                </div>
            </div>

            {headers.map((header, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        className="flex-1 bg-surface border border-border text-text-primary p-2 rounded font-mono text-[13px] outline-none transition-colors focus:border-accent"
                    />
                    <input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        className="flex-1 bg-surface border border-border text-text-primary p-2 rounded font-mono text-[13px] outline-none transition-colors focus:border-accent"
                    />
                    <button
                        onClick={() => removeHeader(index)}
                        className="bg-transparent border-none text-error cursor-pointer px-2 text-lg"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default HeadersEditor;
