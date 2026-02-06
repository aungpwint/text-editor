import { Editor } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'
import { ToolbarProvider } from './toolbar-provider'

import BoldToolbar from '../toolbars/bold'
import ItalicToolbar from '../toolbars/italic'
import StrikethroughToolbar from '../toolbars/strikethrough'
import UnderlineToolbar from '../toolbars/underline'

interface TextBubbleMenuProps {
    editor: Editor
}

interface Position {
    x: number
    y: number
}

export function TextBubbleMenu({ editor }: TextBubbleMenuProps) {
    const bubbleMenuRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<Position | null>(null)

    useEffect(() => {
        if (!editor) return

        const updatePosition = () => {
            const { state, view } = editor
            const { from, to } = state.selection

            // derive visibility from selection
            if (from === to || editor.isActive('link') || editor.isActive('video') || editor.isActive('image') || editor.isActive('code')) {
                setPosition(null)
                return
            }

            const start = view.coordsAtPos(from)
            const end = view.coordsAtPos(to)

            // bubbleMenuRef might be null on first run → estimate later
            const rect = bubbleMenuRef.current?.getBoundingClientRect()
            const width = rect?.width ?? 160
            const height = rect?.height ?? 40
            const padding = 8

            const x = (start.left + end.left) / 2 - width / 2
            const y = Math.max(padding, start.top - height - padding)

            setPosition({ x, y })
        }

        editor.on('selectionUpdate', updatePosition)
        editor.on('transaction', updatePosition)

        return () => {
            editor.off('selectionUpdate', updatePosition)
            editor.off('transaction', updatePosition)
        }
    }, [editor])

    if (!position) return null

    return (
        <ToolbarProvider editor={editor}>
            <div
                ref={bubbleMenuRef}
                className="border-border bg-background/90 text-foreground fixed z-[9999] flex items-center gap-0.5 rounded-full border p-1 text-xs shadow-lg shadow-black/20 backdrop-blur-md sm:gap-1"
                style={{
                    top: position.y,
                    left: position.x,
                }}
            >
                <BoldToolbar className="h-6 w-6" iconClassName="h-3.5 w-3.5" />
                <ItalicToolbar className="h-6 w-6" iconClassName="h-3.5 w-3.5" />
                <UnderlineToolbar className="h-6 w-6" iconClassName="h-3.5 w-3.5" />
                <StrikethroughToolbar className="h-6 w-6" iconClassName="h-3.5 w-3.5" />
            </div>
        </ToolbarProvider>
    )
}
