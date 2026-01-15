import { cn } from '@/lib/utils'
import { EditorContent, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'

import { DEFAULT_EDITOR_CONFIG } from '../constants'
import { getExtensions } from '../extensions'
import { useEditorStore } from '../store/editor'
import { TextEditorProps } from '../types'
import { EditorStatusBar } from './editor-statusbar'
import { EditorToolbar } from './editor-toolbar'
import { KeyboardShortcuts } from './keyboard-shortcuts'

const TextEditor: React.FC<TextEditorProps> = ({
    value = '',
    onChange,
    editable = true,
    config,
    options = {},
    className = '',
    placeholder,
    autoFocus = false,
    disabled = false,
    onBlur,
    onFocus,
    onKeyDown,
    onReady,
    onError,
}) => {
    const { content, setContent, setIsEditable, setEditor, setIsFocused, setPlaceholder, setIsLoading, setError, setHistory, setSelection } =
        useEditorStore()

    const mergedConfig = { ...DEFAULT_EDITOR_CONFIG, ...config }

    useEffect(() => {
        if (value !== undefined && value !== content) {
            setContent(value)
        }
    }, [value, content, setContent])

    useEffect(() => {
        setIsEditable(editable && !disabled)
    }, [editable, disabled, setIsEditable])

    useEffect(() => {
        if (placeholder) {
            setPlaceholder(placeholder)
        }
    }, [placeholder, setPlaceholder])

    const editor = useEditor({
        extensions: getExtensions(
            {
                placeholder: placeholder || config?.placeholder,
                enableTextAlign: mergedConfig.enableTextAlign,
                enableImages: mergedConfig.enableImages,
                enableVideos: mergedConfig.enableVideos,
                enableIframe: mergedConfig.enableIframe,
                enableFloatingMenu: mergedConfig.enableFloatingMenu,
            },
        ),
        content: content,
        editable: editable && !disabled,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-xs sm:prose-sm lg:prose lg:prose-lg xl:prose-2xl dark:prose-invert text-editor max-w-none border-none p-2 focus:outline-none sm:p-4',
                    config?.minHeight || 'min-h-[150px] sm:min-h-[200px]',
                    config?.maxHeight && `max-h-[${config.maxHeight}]`,
                    className,
                ),
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': config?.placeholder || 'Rich text editor',
                'aria-describedby': 'editor-instructions',
            },
            handleKeyDown: (view, event) => {
                onKeyDown?.(event as unknown as React.KeyboardEvent)
                return false // Allow default behavior
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setContent(html)
            onChange?.(html)

            // Update history state
            setHistory({
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo(),
            })

            // Update selection state
            const { from, to } = editor.state.selection
            setSelection({ from, to })
        },
        onFocus: () => {
            setIsFocused(true)
            onFocus?.()
        },
        onBlur: () => {
            setIsFocused(false)
            onBlur?.()
        },
        onTransaction: ({ editor }) => {
            // Update history state on every transaction
            setHistory({
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo(),
            })
        },
        ...options,
    })

    useEffect(() => {
        if (editor) {
            setEditor(editor)

            // Set up error handling
            try {
                // Update content if it changes externally
                if (editor.getHTML() !== content) {
                    editor.commands.setContent(content, { emitUpdate: false })
                }

                // Auto focus if needed
                if (autoFocus) {
                    editor.commands.focus()
                }

                // Call ready callback
                onReady?.(editor)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred')
                onError?.(error instanceof Error ? error : new Error('An error occurred'))
            }
        }

        return () => {
            if (editor) {
                setEditor(null)
            }
        }
    }, [editor, setEditor, autoFocus, onReady, onError, setError, content])

    // Handle loading state
    useEffect(() => {
        setIsLoading(!editor)
    }, [editor, setIsLoading])

    const { error } = useEditorStore()

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>
    }

    return (
        <div className={cn('overflow-hidden rounded-md text-xs sm:text-sm', className)}>
            {mergedConfig.enableToolbar && editor && <EditorToolbar editor={editor} config={mergedConfig} />}
            <EditorContent editor={editor} />
            {mergedConfig.enableStatusBar && editor && <EditorStatusBar />}
            {editor && <KeyboardShortcuts editor={editor} />}
        </div>
    )
}

export default TextEditor
