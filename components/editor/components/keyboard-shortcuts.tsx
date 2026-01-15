import { Editor } from '@tiptap/react'
import React, { useEffect } from 'react'

interface KeyboardShortcutsProps {
    editor: Editor
    onShortcut?: (shortcut: string, event: KeyboardEvent) => void
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ editor, onShortcut }) => {
    useEffect(() => {
        if (!editor) return

        const handleKeyDown = (event: KeyboardEvent) => {
            // Bold: Mod+b
            if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                editor.chain().focus().toggleBold().run()
                onShortcut?.('BOLD', event)
                return
            }

            // Italic: Mod+i
            if (event.key === 'i' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                editor.chain().focus().toggleItalic().run()
                onShortcut?.('ITALIC', event)
                return
            }

            // Underline: Mod+u
            if (event.key === 'u' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                editor.chain().focus().toggleUnderline().run()
                onShortcut?.('UNDERLINE', event)
                return
            }

            // Strike: Mod+Shift+s
            if (event.key === 's' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().toggleStrike().run()
                onShortcut?.('STRIKE', event)
                return
            }

            // Heading 1: Mod+Alt+1
            if (event.key === '1' && (event.ctrlKey || event.metaKey) && event.altKey) {
                event.preventDefault()
                editor.chain().focus().toggleHeading({ level: 1 }).run()
                onShortcut?.('HEADING_1', event)
                return
            }

            // Heading 2: Mod+Alt+2
            if (event.key === '2' && (event.ctrlKey || event.metaKey) && event.altKey) {
                event.preventDefault()
                editor.chain().focus().toggleHeading({ level: 2 }).run()
                onShortcut?.('HEADING_2', event)
                return
            }

            // Heading 3: Mod+Alt+3
            if (event.key === '3' && (event.ctrlKey || event.metaKey) && event.altKey) {
                event.preventDefault()
                editor.chain().focus().toggleHeading({ level: 3 }).run()
                onShortcut?.('HEADING_3', event)
                return
            }

            // Undo: Mod+z
            if (event.key === 'z' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().undo().run()
                onShortcut?.('UNDO', event)
                return
            }

            // Redo: Mod+Shift+z
            if (event.key === 'z' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().redo().run()
                onShortcut?.('REDO', event)
                return
            }

            // Bullet List: Mod+Shift+8
            if (event.key === '8' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().toggleBulletList().run()
                onShortcut?.('BULLET_LIST', event)
                return
            }

            // Ordered List: Mod+Shift+7
            if (event.key === '7' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().toggleOrderedList().run()
                onShortcut?.('ORDERED_LIST', event)
                return
            }

            // Code: Mod+e
            if (event.key === 'e' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                editor.chain().focus().toggleCode().run()
                onShortcut?.('CODE', event)
                return
            }

            // Code Block: Mod+Shift+c
            if (event.key === 'c' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().toggleCodeBlock().run()
                onShortcut?.('CODE_BLOCK', event)
                return
            }

            // Blockquote: Mod+Shift+b
            if (event.key === 'b' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                event.preventDefault()
                editor.chain().focus().toggleBlockquote().run()
                onShortcut?.('BLOCKQUOTE', event)
                return
            }

            // Link: Mod+k
            if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                const url = window.prompt('Enter URL')
                if (url) {
                    editor.chain().focus().setLink({ href: url }).run()
                }
                onShortcut?.('LINK', event)
                return
            }
        }

        const editorElement = editor.view.dom as HTMLElement
        editorElement.addEventListener('keydown', handleKeyDown)

        return () => {
            editorElement.removeEventListener('keydown', handleKeyDown)
        }
    }, [editor, onShortcut])

    return null
}
