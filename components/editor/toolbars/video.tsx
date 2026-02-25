import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, Trash2, Video as VideoIcon } from 'lucide-react'
import { KeyboardEvent, useEffect, useState } from 'react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const VideoToolbar: React.FC = () => {
    const { editor } = useToolbar()
    const [open, setOpen] = useState(false)
    const [src, setSrc] = useState('')

    useEffect(() => {
        if (!open || !editor) return
        const current = editor.getAttributes?.('video') as { src?: string } | undefined
        setSrc(current?.src || '')
    }, [open, editor])

    const onSave = () => {
        const value = src.trim()
        if (!editor || !value) return
        editor.commands.setVideo({ src: value })
        setOpen(false)
        setSrc('')
    }

    const onRemove = () => {
        if (!editor) return
        const current = editor.getAttributes?.('video') as { src?: string } | undefined
        const srcToDelete = current?.src || undefined
        editor.commands.deleteVideo?.(srcToDelete ? { src: srcToDelete } : undefined)
        setOpen(false)
        setSrc('')
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onSave()
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ActionButton
                    icon={<VideoIcon className="h-4 w-4" />}
                    onClick={() => setOpen(true)}
                    isActive={editor?.isActive('video')}
                    disabled={!editor}
                    title="Add video"
                />
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="start"
                className="border-border bg-background/90 w-[360px] max-w-[95vw] rounded-2xl border px-3 py-2 shadow-xl backdrop-blur-md"
            >
                {/* Header */}
                <div className="mb-2 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold">Add Video</h3>
                    <p className="text-muted-foreground text-xs">Paste a video URL (YouTube, Vimeo, or MP4)</p>
                </div>

                {/* Input + Actions */}
                <div className="flex items-center gap-2">
                    {/* Input */}
                    <Input
                        placeholder="https://example.com/video.mp4"
                        value={src}
                        autoFocus
                        onChange={(e) => setSrc(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="placeholder:text-muted-foreground h-9 flex-1 border-0 bg-transparent px-3 text-sm focus-visible:ring-0"
                    />

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                        {/* Save */}
                        <Button variant="ghost" size="icon" onClick={onSave} disabled={!src.trim()} className="h-7 w-7" aria-label="Add video">
                            <Check className="h-4 w-4" />
                        </Button>

                        {/* Remove */}
                        {editor?.isActive('video') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onRemove}
                                className="text-destructive hover:text-destructive h-7 w-7"
                                aria-label="Remove video"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default VideoToolbar
