import { Editor } from '@tiptap/react'

export type ImageAlign = 'left' | 'center' | 'right'

export interface TextEditorProps {
    value?: string
    onChange?: (content: string) => void
    editable?: boolean
    config?: EditorConfig
    options?: EditorOptions
    className?: string
    placeholder?: string
    autoFocus?: boolean
    disabled?: boolean
    onBlur?: () => void
    onFocus?: () => void
    onKeyDown?: (event: React.KeyboardEvent) => void
    onReady?: (editor: Editor) => void
    onError?: (error: Error) => void
}

export interface EditorConfig {
    placeholder?: string
    extensions?: any[]
    content?: string

    enableHistory?: boolean
    enableImages?: boolean
    enableVideos?: boolean
    enableTables?: boolean
    enableCodeBlock?: boolean
    enableBlockquote?: boolean
    enableLists?: boolean
    enableTextAlign?: boolean
    enableFontFamily?: boolean
    enableFontSize?: boolean
    enableTypography?: boolean
    enableColor?: boolean
    enableHighlight?: boolean
    enableIframe?: boolean
    enableIndent?: boolean
    enableLineHeight?: boolean
    enableLink?: boolean
    minHeight?: string
    maxHeight?: string
    height?: string
    width?: string

    enableBubbleMenu?: boolean
    enableFloatingMenu?: boolean
    enableFloatingToolbar?: boolean
    enableToolbar?: boolean
    enableStatusBar?: boolean
}

export interface EditorOptions {
    [key: string]: any
}