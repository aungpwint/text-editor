import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ExternalLink, Link2, Unlink } from 'lucide-react'
import { useEffect, useState } from 'react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const LinkToolbar = () => {
    const { editor } = useToolbar()

    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState('')

    const isActive = editor?.isActive('link')

    useEffect(() => {
        if (!open || !editor) return
        const { href } = editor.getAttributes('link')
        setUrl(href || '')
    }, [open, editor])

    const saveLink = () => {
        if (!editor) return

        if (!url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
        }

        setOpen(false)
    }

    const removeLink = () => {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        setOpen(false)
    }

    const openLink = (rawUrl: string) => {
        if (!rawUrl?.trim()) return
        const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
        window.open(normalized, '_blank', 'noopener,noreferrer')
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ActionButton icon={<Link2 className="h-4 w-4" />} onClick={() => setOpen(true)} isActive={isActive} title="Insert link" />
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="start"
                className="border-border bg-background/90 w-[250px] max-w-[90vw] rounded-full border px-2 py-1 shadow-xl"
            >
                <div className="flex items-center gap-1">
                    {/* Wide, borderless, no-bg input */}
                    <Input
                        placeholder="Paste or type link…"
                        value={url}
                        autoFocus
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveLink()}
                        className="h-7 flex-1 appearance-none border-0 bg-transparent pr-1 pl-2 text-xs focus-visible:ring-0 dark:bg-transparent"
                    />

                    {/* Compact actions */}
                    <div className="flex shrink-0 items-center gap-0.5">
                        <Button variant="ghost" size="icon" onClick={saveLink} disabled={!url.trim()} className="h-6 w-6" aria-label="Apply link">
                            <Check className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={!url.trim()}
                            onClick={() => openLink(url)}
                            className="h-6 w-6"
                            aria-label="Open link"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={removeLink}
                            className="text-destructive hover:text-destructive h-6 w-6"
                            aria-label="Remove link"
                        >
                            <Unlink className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default LinkToolbar
