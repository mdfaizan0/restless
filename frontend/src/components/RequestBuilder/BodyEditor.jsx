import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentOnInput } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { customTheme } from './codemirrorTheme';

const BodyEditor = ({ body, setBody, method }) => {
    const [shake, setShake] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handlePrettify = useCallback(() => {
        try {
            const parsed = JSON.parse(body);
            setBody(JSON.stringify(parsed, null, 2));
            setFeedback({ type: 'success', text: 'Formatted JSON' });
        } catch (e) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setFeedback({ type: 'error', text: 'Invalid JSON — unchanged' });
        }
        setTimeout(() => setFeedback(null), 2000);
    }, [body, setBody]);

    const handleClear = useCallback(() => {
        setBody('');
    }, [setBody]);

    const wrapInQuotesKeymap = useMemo(() => keymap.of([
        {
            key: 'Shift-\'',
            run: (view) => {
                const { state } = view;
                const { selection } = state;
                const changes = [];

                selection.ranges.forEach(range => {
                    if (!range.empty) {
                        const selectedText = state.doc.sliceString(range.from, range.to);
                        changes.push({
                            from: range.from,
                            to: range.to,
                            insert: `"${selectedText}"`
                        });
                    }
                });

                if (changes.length > 0) {
                    view.dispatch({ changes });
                    return true;
                }
                return false;
            }
        }
    ]), []);

    const extensions = useMemo(() => [
        json(),
        indentOnInput(),
        closeBrackets(),
        customTheme,
        EditorView.lineWrapping,
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            indentWithTab
        ]),
        wrapInQuotesKeymap,
        EditorState.tabSize.of(2)
    ], [wrapInQuotesKeymap]);

    const handleChange = useCallback((value) => {
        setBody(value);
    }, [setBody]);

    const supportsBody = !['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method);

    if (!supportsBody) {
        return (
            <div className="flex-center h-full text-text-tertiary text-[0.9rem] italic">
                This method does not support a request body.
            </div>
        );
    }

    return (
        <div className="p-2.5 h-full flex flex-col">
            <div className="flex justify-between mb-2.5 items-center">
                <div className="font-semibold text-sm text-text-secondary">Body (JSON)</div>
                <div className="flex items-center gap-2.5">
                    <AnimatePresence>
                        {feedback && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className={`text-xs ${feedback.type === 'success' ? 'text-success' : 'text-error'}`}
                            >
                                {feedback.text}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <motion.button
                        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={handlePrettify}
                        className="bg-transparent border border-border text-text-secondary rounded px-2 py-1 cursor-pointer text-xs transition-colors hover:text-text-primary hover:border-text-primary"
                    >
                        Prettify JSON
                    </motion.button>
                    {body.length > 0 && <motion.button
                        type="button"
                        onClick={handleClear}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-transparent border border-border text-text-secondary rounded px-2 py-1 cursor-pointer text-xs transition-colors hover:text-error hover:border-error"
                    >
                        Clear
                    </motion.button>}
                </div>
            </div>
            <div className="flex-1 border border-border rounded overflow-hidden min-h-[200px]">
                <CodeMirror
                    value={body}
                    height="100%"
                    extensions={extensions}
                    onChange={handleChange}
                    placeholder="{}"
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        foldGutter: true,
                        drawSelection: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        syntaxHighlighting: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        rectangularSelection: true,
                        crosshairCursor: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        closeBracketsKeymap: true,
                        searchKeymap: true,
                        foldKeymap: true,
                        completionKeymap: true,
                        lintKeymap: true
                    }}
                />
            </div>
        </div>
    );
};

export default BodyEditor;
