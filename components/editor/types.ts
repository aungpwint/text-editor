import { Editor } from '@tiptap/react'

export type ExtensionNameKeys = 'bold' | 'italic' | 'underline' | 'link' | 'image' | 'video' | 'audio' | 'highlight' | 'quote'

export type PaperSize = 'Legal' | 'Letter' | 'Tabloid' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5'

export type Alignment = 'left' | 'center' | 'right' | 'full'

export interface AlignmentConfig {
    defaultAlign?: Alignment
    allowedAlignments?: Alignment[]
}

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

export interface ToolbarButtonProps {
    editor: Editor
    icon: React.ReactNode
    action: () => void
    isActive?: () => boolean
    tooltip?: string
    disabled?: boolean
}

export interface BubbleMenuProps {
    editor: Editor
    children: React.ReactNode
    tippyOptions?: any
}

export interface EditorHistoryState {
    canUndo: boolean
    canRedo: boolean
}

export interface EditorSelectionState {
    from: number
    to: number
}

export interface EnhancedImageAttributes {
    src: string
    alt?: string
    title?: string
    width?: number | null
    height?: number | null
    alignment?: Alignment
    note?: string | null
}

export interface EnhancedImageOptions {
    inline: boolean
    allowBase64: boolean
    HTMLAttributes: Record<string, any>
    resize: {
        enabled: boolean
        alwaysPreserveAspectRatio: boolean
        minWidth?: number
        maxWidth?: number
        minHeight?: number
        maxHeight?: number
    }
    alignment: {
        enabled: boolean
        defaultAlignment: Alignment
    }
    note: {
        enabled: boolean
        placeholder?: string
        editable?: boolean
    }
}

export interface ImageNodeViewProps {
    node: any
    editor: Editor
    selected: boolean
    extension: any
    getPos: () => number | (() => number)
    updateAttributes: (attributes: Partial<EnhancedImageAttributes>) => void
    deleteNode: () => void
}

export interface ImageBubbleMenuProps {
    editor: Editor
}
