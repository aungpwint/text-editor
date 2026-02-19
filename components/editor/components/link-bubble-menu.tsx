import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Editor } from '@tiptap/react'
import { Check, ExternalLink, Pencil, Unlink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ActionButton from './action-button'

interface LinkBubbleMenuProps {
    editor: Editor
}

interface Position {
    x: number
    y: number
}

export function LinkBubbleMenu({ editor }: LinkBubbleMenuProps) {
    const bubbleRef = useRef<HTMLDivElement>(null)
    const savedSelection = useRef<{ from: number; to: number } | null>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [position, setPosition] = useState<Position | null>(null)

    const isActive = editor.isActive('link')

    useEffect(() => {
        if (!editor) return

        const updatePosition = () => {
            const { state, view } = editor
            const { from, to } = state.selection

            // derive visibility from selection
            if (from === to || !isActive) {
                setPosition(null)
                return
            }

            const start = view.coordsAtPos(from)
            const end = view.coordsAtPos(to)

            // bubbleRef might be null on first run → estimate later
            const rect = bubbleRef.current?.getBoundingClientRect()
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
    }, [editor, isActive])

    // Update link URL when active state changes
    useEffect(() => {
        if (isActive) {
            setLinkUrl(editor.getAttributes('link')?.href ?? '')
        }
    }, [isActive, editor])

    // Save selection when it changes
    useEffect(() => {
        const save = () => {
            const { from, to } = editor.state.selection
            if (from !== to) {
                savedSelection.current = { from, to }
            }
        }

        editor.on('selectionUpdate', save)
        return () => {
            editor.off('selectionUpdate', save)
        }
    }, [editor])

    const editLink = () => {
        if (savedSelection.current) {
            editor.chain().focus().setTextSelection(savedSelection.current).run()
        } else {
            editor.commands.focus()
        }
        setIsEditing(true)
    }

    const saveLink = () => {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
        setIsEditing(false)
    }

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        setPosition(null)
    }

    const openLink = (rawUrl: string) => {
        if (!rawUrl?.trim()) return
        const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
        window.open(normalized, '_blank', 'noopener,noreferrer')
    }

    if (!position) return null

    return (
        <div
            ref={bubbleRef}
            className={cn(
                'border-border bg-background/90 text-foreground fixed z-[9999] flex items-center gap-0.5 rounded-full border px-2 py-1 text-xs shadow-xl shadow-black/20 backdrop-blur-md sm:gap-1',
                isEditing ? 'w-[260px] max-w-[90vw]' : 'w-max',
            )}
            style={{
                top: position.y,
                left: position.x,
            }}
        >
            <div className="flex items-center gap-1">
                {isEditing && (
                    <Input
                        placeholder="Paste or type link…"
                        autoFocus
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLink()
                            if (e.key === 'Escape') setIsEditing(false)
                        }}
                        className="h-7 flex-1 appearance-none border-0 bg-transparent pr-1 pl-2 text-xs focus-visible:ring-0 dark:bg-transparent"
                    />
                )}
                <div className="flex shrink-0 items-center gap-0.5">
                    {isEditing ? (
                        <ActionButton
                            icon={<Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                            onClick={saveLink}
                            disabled={!linkUrl.trim()}
                            className="h-6 w-6"
                            label="Apply link"
                        />
                    ) : (
                        <ActionButton icon={<Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} onClick={editLink} label="Edit" className="h-6 w-6" />
                    )}

                    <ActionButton
                        icon={<ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        onClick={() => openLink(linkUrl)}
                        disabled={!linkUrl.trim()}
                        className="h-6 w-6"
                        label="Open link"
                    />
                    <ActionButton
                        icon={<Unlink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        onClick={removeLink}
                        className="text-destructive hover:text-destructive h-6 w-6"
                        label="Remove link"
                    />
                </div>
            </div>
        </div>
    )
}