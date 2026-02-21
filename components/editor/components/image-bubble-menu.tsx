import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, Check, Trash2, Type } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ActionButton from './action-button'

interface ImageBubbleMenuProps {
    editor: Editor
}

interface Position {
    x: number
    y: number
}

export default function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
    const bubbleRef = useRef<HTMLDivElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [position, setPosition] = useState<Position | null>(null)

    const isActive = editor.isActive('image') || editor.isActive('video')

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

    useEffect(() => {
        if (isActive) {
            const nodeType = editor.isActive('image') ? 'image' : 'video'
            setNoteText(editor.getAttributes(nodeType)?.note ?? '')
        }
    }, [isActive, editor])

    const getAlignment = () => {
        if (!editor) return 'center'
        const nodeType = editor.isActive('image') ? 'image' : 'video'
        const attrs = editor.getAttributes(nodeType)
        return attrs?.['data-align'] || 'center'
    }

    const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
        if (!editor) return

        try {
            const nodeType = editor.isActive('image') ? 'image' : 'video'
            const anyCommands = editor.commands as any
            if (anyCommands.updateImageAlignment) {
                anyCommands.updateImageAlignment(alignment)
            } else {
                editor.chain().focus().updateAttributes(nodeType, { 'data-align': alignment }).run()
            }
        } catch (error) {
            console.error('Failed to update alignment:', error)
        }
    }

    const editNote = () => {
        setIsEditing(true)
    }

    const saveNote = () => {
        if (!editor) return

        try {
            const nodeType = editor.isActive('image') ? 'image' : 'video'
            const anyCommands = editor.commands as any
            if (anyCommands.updateImageNote) {
                anyCommands.updateImageNote(noteText)
            } else {
                editor.chain().focus().updateAttributes(nodeType, { note: noteText }).run()
            }
        } catch (error) {
            console.error('Failed to update note:', error)
        }

        setIsEditing(false)
    }

    const cancelNote = () => {
        const nodeType = editor.isActive('image') ? 'image' : 'video'
        setNoteText(editor.getAttributes(nodeType)?.note ?? '')
        setIsEditing(false)
    }

    const handleDelete = () => {
        if (!editor) return
        editor.chain().focus().deleteSelection().run()
        setPosition(null)
    }

    if (!position) return null

    const currentAlignment = getAlignment()

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
                <div className="border-border flex items-center gap-0.5 border-r pr-1">
                    <ActionButton
                        icon={<AlignLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        onClick={() => handleAlignmentChange('left')}
                        isActive={currentAlignment === 'left'}
                        className="h-6 w-6"
                        label="Align left"
                        title="Align left"
                    />
                    <ActionButton
                        icon={<AlignCenter className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        onClick={() => handleAlignmentChange('center')}
                        isActive={currentAlignment === 'center'}
                        className="h-6 w-6"
                        label="Align center"
                        title="Align center"
                    />
                    <ActionButton
                        icon={<AlignRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                        onClick={() => handleAlignmentChange('right')}
                        isActive={currentAlignment === 'right'}
                        className="h-6 w-6"
                        label="Align right"
                        title="Align right"
                    />
                </div>

                <div className="flex items-center gap-0.5">
                    {isEditing ? (
                        <div className="flex items-center gap-0.5">
                            <Input
                                placeholder="Add note..."
                                autoFocus
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveNote()
                                    if (e.key === 'Escape') cancelNote()
                                }}
                                className="h-7 flex-1 appearance-none border-0 bg-transparent pr-1 pl-2 text-xs focus-visible:ring-0 dark:bg-transparent"
                            />
                            <div className="flex shrink-0 items-center gap-0.5">
                                <ActionButton
                                    icon={<Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                                    onClick={saveNote}
                                    disabled={!noteText.trim()}
                                    className="h-6 w-6"
                                    label="Save note"
                                />
                            </div>
                        </div>
                    ) : (
                        <ActionButton
                            icon={<Type className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                            onClick={editNote}
                            className="h-6 w-6"
                            label="Edit note"
                        />
                    )}
                </div>

                <ActionButton
                    icon={<Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive h-6 w-6"
                    label="Delete"
                />
            </div>
        </div>
    )
}