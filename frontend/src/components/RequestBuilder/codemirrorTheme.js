import { EditorView } from "@codemirror/view";

// A highly-stable, matte-dark CodeMirror theme using your CSS variables.
// Designed to eliminate flicker, gutter jumps, cursor flashes, and selection jitter.

export const customTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--surface)",
      color: "var(--text-primary)",
      height: "100%",
      fontSize: "13px",
      fontFamily: "var(--font-sans)",
      lineHeight: "1.55",
      outline: "none !important",
    },

    ".cm-content": {
      caretColor: "var(--accent)",
      padding: "0 !important", // Prevent height shifts
    },

    ".cm-scroller": {
      overflow: "overlay", // prevents scroll jump flicker
      fontFamily: "var(--font-mono)",
      padding: "12px",
    },

    ".cm-gutters": {
      backgroundColor: "var(--surface)",
      borderRight: "1px solid var(--border)",
      color: "var(--text-tertiary)",
      minWidth: "40px",
    },

    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 8px",
    },

    ".cm-activeLine": {
      backgroundColor: "var(--surface-2) !important", // opaque = no flashing
    },

    ".cm-activeLineGutter": {
      backgroundColor: "var(--surface-3) !important",
      color: "var(--text-secondary)",
    },

    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "var(--accent-dim) !important",
    },

    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--accent)",
      borderLeftWidth: "2px",
    },

    ".cm-tooltip": {
      backgroundColor: "var(--surface-2)",
      border: "1px solid var(--border)",
      color: "var(--text-primary)",
    },

    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "var(--accent)",
      color: "#000",
    },

    ".cm-editor": {
      transition: "none !important", // Prevent transition-based flicker
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "var(--surface-2)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
      padding: "2px 4px",
      borderRadius: "4px",
    },
  },
  { dark: true }
);

export default customTheme;