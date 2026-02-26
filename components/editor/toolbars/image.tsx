import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlignCenter, AlignLeft, AlignRight, Check, ExternalLink, Image as ImageIcon, Trash2 } from 'lucide-react'
import React, { KeyboardEvent, useCallback, useState } from 'react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const ImageToolbar: React.FC = () => {
    const { editor } = useToolbar()
    const [open, setOpen] = useState(false)
    const [imageData, setImageData] = useState({
        url: '',
        alt: '',
        alignment: 'center' as 'left' | 'center' | 'right',
        note: '',
        width: '',
        height: '',
    })

    // Set default alignment to 'center' if not specified
    React.useEffect(() => {
        if (!open && !editor?.isActive('image')) {
            setImageData((prev) => ({
                ...prev,
                alignment: 'center',
            }))
        }
    }, [open, editor])

    const onSave = () => {
        if (!editor) return
        const url = imageData.url.trim()
        const alt = imageData.alt.trim() || 'image'

        if (!url) {
            setOpen(false)
            return
        }

        try {
            const anyCommands = editor.commands as any
            if (anyCommands.setImage) {
                anyCommands.setImage({
                    src: url,
                    alt,
                    'data-align': imageData.alignment,
                    note: imageData.note || null,
                    width: imageData.width ? parseInt(imageData.width) : null,
                    height: imageData.height ? parseInt(imageData.height) : null,
                })
            } else {
                editor.chain().focus().setImage({ src: url, alt }).run()
                // Update the alignment separately
                if (editor.isActive('image')) {
                    editor.chain().updateAttributes('image', { 'data-align': imageData.alignment }).run()
                }
            }
        } catch (_error) {
            editor.chain().focus().setImage({ src: url, alt }).run()
            // Update the alignment separately
            if (editor.isActive('image')) {
                editor.chain().updateAttributes('image', { 'data-align': imageData.alignment }).run()
            }
        }

        setOpen(false)
        setImageData({ url: '', alt: '', alignment: 'center', note: '', width: '', height: '' })
    }

    const onRemove = () => {
        if (!editor) return

        try {
            if (editor.isActive('image')) {
                editor.chain().focus().deleteSelection().run()
            }
        } catch (error) {
            console.error('Error removing image:', error)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSave()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setOpen(false)
        }
    }

    const openImageInNewTab = (url: string) => {
        if (!url.trim()) return

        try {
            let formattedUrl = url.trim()

            if (!formattedUrl.startsWith('http') && !formattedUrl.startsWith('data:')) {
                formattedUrl = `https://${formattedUrl}`
            }

            window.open(formattedUrl, '_blank', 'noopener,noreferrer')
        } catch (error) {
            console.error('Invalid URL:', error)
        }
    }

    const handleUrlChange = (url: string) => {
        setImageData((prev) => ({ ...prev, url }))
    }

    const updateCurrentImage = useCallback(() => {
        if (!editor || !editor.isActive('image')) return

        const attrs = editor.getAttributes('image')
        if (attrs) {
            setImageData({
                url: attrs.src || '',
                alt: attrs.alt || '',
                alignment: attrs['data-align'] || 'center',
                note: attrs.note || '',
                width: attrs.width?.toString() || '',
                height: attrs.height?.toString() || '',
            })
        }
    }, [editor])

    React.useEffect(() => {
        if (open && editor?.isActive('image')) {
            updateCurrentImage()
        }
    }, [open, editor, updateCurrentImage])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ActionButton
                    icon={<ImageIcon className="h-4 w-4" />}
                    onClick={() => setOpen(true)}
                    isActive={editor?.isActive('image')}
                    disabled={!editor}
                    title="Add or edit image"
                />
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="start"
                className="border-border bg-background/90 w-[420px] max-w-[95vw] rounded-2xl border px-3 py-2 shadow-xl backdrop-blur-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="mb-3 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold">Add Image</h3>
                    <p className="text-muted-foreground text-xs">Paste an image URL and configure options</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">Image URL</label>
                        <Input
                            placeholder="https://example.com/image.jpg"
                            value={imageData.url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="placeholder:text-muted-foreground border-input bg-background h-9 border px-3 text-sm focus-visible:ring-1"
                        />
                    </div>

                    <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">Alt Text (Description)</label>
                        <Input
                            placeholder="Describe the image for accessibility"
                            value={imageData.alt}
                            onChange={(e) => setImageData((prev) => ({ ...prev, alt: e.target.value }))}
                            onKeyDown={handleKeyDown}
                            className="placeholder:text-muted-foreground border-input bg-background h-9 border px-3 text-sm focus-visible:ring-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-medium">Width (px)</label>
                            <Input
                                placeholder="auto"
                                value={imageData.width}
                                onChange={(e) => setImageData((prev) => ({ ...prev, width: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                className="placeholder:text-muted-foreground border-input bg-background h-9 border px-3 text-sm focus-visible:ring-1"
                            />
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1 block text-xs font-medium">Height (px)</label>
                            <Input
                                placeholder="auto"
                                value={imageData.height}
                                onChange={(e) => setImageData((prev) => ({ ...prev, height: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                className="placeholder:text-muted-foreground border-input bg-background h-9 border px-3 text-sm focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">Alignment</label>
                        <Select
                            value={imageData.alignment}
                            onValueChange={(value: 'left' | 'center' | 'right') => setImageData((prev) => ({ ...prev, alignment: value }))}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select alignment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="left">
                                    <div className="flex items-center gap-2">
                                        <AlignLeft className="h-3.5 w-3.5" />
                                        Left
                                    </div>
                                </SelectItem>
                                <SelectItem value="center">
                                    <div className="flex items-center gap-2">
                                        <AlignCenter className="h-3.5 w-3.5" />
                                        Center
                                    </div>
                                </SelectItem>
                                <SelectItem value="right">
                                    <div className="flex items-center gap-2">
                                        <AlignRight className="h-3.5 w-3.5" />
                                        Right
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-muted-foreground mb-1 block text-xs font-medium">Note/Caption (optional)</label>
                        <Input
                            placeholder="Add a note or caption..."
                            value={imageData.note}
                            onChange={(e) => setImageData((prev) => ({ ...prev, note: e.target.value }))}
                            onKeyDown={handleKeyDown}
                            className="placeholder:text-muted-foreground border-input bg-background h-9 border px-3 text-sm focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-8 text-xs">
                            Cancel
                        </Button>
                    </div>

                    <div className="flex items-center gap-1">
                        {imageData.url.trim() && (
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={!imageData.url.trim()}
                                onClick={() => openImageInNewTab(imageData.url)}
                                className="h-8 w-8"
                                title="Open image in new tab"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                        )}

                        {editor?.isActive('image') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onRemove}
                                className="text-destructive hover:text-destructive h-8 w-8"
                                title="Remove image"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}

                        <Button variant="default" size="sm" onClick={onSave} disabled={!imageData.url.trim()} className="h-8 gap-1 px-3">
                            <Check className="h-3.5 w-3.5" />
                            {editor?.isActive('image') ? 'Update' : 'Insert'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default ImageToolbar
