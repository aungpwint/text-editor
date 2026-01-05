export const DEFAULT_EDITOR_PLACEHOLDER = 'Write something...'

export const DEFAULT_EDITOR_CONFIG = {
    enableHistory: true,
    enableImages: true,
    enableVideos: true,
    enableTables: true,
    enableCodeBlock: true,
    enableBlockquote: true,
    enableLists: true,
    enableTextAlign: true,
    enableFontFamily: true,
    enableFontSize: true,
    enableTypography: true,
    enableColor: true,
    enableHighlight: true,
    enableIframe: false,
    enableIndent: true,
    enableLineHeight: false,
    enableLink: true,
    enableBubbleMenu: true,
    enableFloatingMenu: true,
    enableFloatingToolbar: false,
    enableToolbar: true,
    enableStatusBar: false,
    minHeight: '200px',
    maxHeight: '600px',
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const KEYBOARD_SHORTCUTS = {
    BOLD: 'Mod+b',
    ITALIC: 'Mod+i',
    UNDERLINE: 'Mod+u',
    STRIKE: 'Mod+Shift+s',
    HEADING_1: 'Mod+Alt+1',
    HEADING_2: 'Mod+Alt+2',
    HEADING_3: 'Mod+Alt+3',
    HEADING_4: 'Mod+Alt+4',
    HEADING_5: 'Mod+Alt+5',
    HEADING_6: 'Mod+Alt+6',
    UNDO: 'Mod+z',
    REDO: 'Mod+Shift+z',
    BULLET_LIST: 'Mod+Shift+8',
    ORDERED_LIST: 'Mod+Shift+7',
    CODE: 'Mod+e',
    CODE_BLOCK: 'Mod+Shift+c',
    BLOCKQUOTE: 'Mod+Shift+b',
    TABLE: 'Mod+Shift+t',
    HORIZONTAL_RULE: 'Mod+Shift+_',
    LINK: 'Mod+k',
    IMAGE: 'Mod+Shift+i',
}

export const FONT_SIZES = [
    { name: 'Small', value: 'text-sm' },
    { name: 'Normal', value: 'text-base' },
    { name: 'Large', value: 'text-lg' },
    { name: 'X-Large', value: 'text-xl' },
    { name: 'XX-Large', value: 'text-2xl' },
]

export const COLORS = ['#000000', '#ffffff', '#dc2626', '#2563eb', '#059669', '#d97706', '#7e22ce']

export const HIGHLIGHT_COLORS = ['#fef3c7', '#fecaca', '#bfdbfe', '#bbf7d0', '#ddd6fe', '#fbcfe8']

export const VIDEO_PLATFORMS = ['youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com', 'bilibili.com', 'drive.google.com']

export const FONT_FAMILIES = [
    // 🔤 Sans-serif (most common)
    {
        name: 'Arial',
        value: 'Arial, Helvetica, sans-serif',
        style: { fontFamily: 'Arial, Helvetica, sans-serif' },
    },
    {
        name: 'Helvetica',
        value: 'Helvetica, Arial, sans-serif',
        style: { fontFamily: 'Helvetica, Arial, sans-serif' },
    },
    {
        name: 'Verdana',
        value: 'Verdana, Geneva, sans-serif',
        style: { fontFamily: 'Verdana, Geneva, sans-serif' },
    },
    {
        name: 'Tahoma',
        value: 'Tahoma, Geneva, sans-serif',
        style: { fontFamily: 'Tahoma, Geneva, sans-serif' },
    },

    // 📖 Serif (reading / documents)
    {
        name: 'Times New Roman',
        value: '"Times New Roman", Times, serif',
        style: { fontFamily: '"Times New Roman", Times, serif' },
    },
    {
        name: 'Georgia',
        value: 'Georgia, "Times New Roman", serif',
        style: { fontFamily: 'Georgia, "Times New Roman", serif' },
    },

    // 💻 Monospace (code / technical)
    {
        name: 'Courier New',
        value: '"Courier New", Courier, monospace',
        style: { fontFamily: '"Courier New", Courier, monospace' },
    },
    {
        name: 'Consolas',
        value: 'Consolas, "Courier New", monospace',
        style: { fontFamily: 'Consolas, "Courier New", monospace' },
    },
    {
        name: 'Monaco',
        value: 'Monaco, Consolas, monospace',
        style: { fontFamily: 'Monaco, Consolas, monospace' },
    },

    // 🌐 Modern / widely used (needs web font loaded)
    {
        name: 'Inter',
        value: 'Inter, system-ui, sans-serif',
        style: { fontFamily: 'Inter, system-ui, sans-serif' },
    },
    {
        name: 'Roboto',
        value: 'Roboto, Arial, sans-serif',
        style: { fontFamily: 'Roboto, Arial, sans-serif' },
    },
    {
        name: 'Open Sans',
        value: '"Open Sans", Arial, sans-serif',
        style: { fontFamily: '"Open Sans", Arial, sans-serif' },
    },
]
