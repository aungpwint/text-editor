'use client'

import type { Alignment } from '@/components/editor/types'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { NodeViewWrapper } from '@tiptap/react'
import { AlignCenter, AlignLeft, AlignRight, Maximize2, X } from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'

interface IframeNodeViewProps {
    node: any
    updateAttributes: (attrs: any) => void
    deleteNode: () => void
    selected: boolean
}

export default function IframeNodeView({ node, updateAttributes, deleteNode, selected }: IframeNodeViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [width, setWidth] = useState(node.attrs.width || 640)
    const [height, setHeight] = useState(node.attrs.height || 360)
    const containerRef = useRef<HTMLDivElement>(null)
    const [aspectRatio] = useState((node.attrs.width || 640) / (node.attrs.height || 360))

    const handleResize = (newWidth: number, newHeight: number) => {
        setWidth(newWidth)
        setHeight(newHeight)
        updateAttributes({ width: newWidth, height: newHeight })
    }

    const handleAlignment = (align: Alignment) => {
        updateAttributes({ align })
    }

    const handleDragResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        const startX = e.clientX
        const startWidth = width

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX
            const newWidth = Math.max(200, startWidth + deltaX)
            const newHeight = Math.round(newWidth / aspectRatio)
            handleResize(newWidth, newHeight)
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    const getAlignmentClasses = (align: Alignment) => {
        switch (align) {
            case 'left':
                return 'mr-auto'
            case 'center':
                return 'mx-auto'
            case 'right':
                return 'ml-auto'
            case 'full':
                return 'w-full'
            default:
                return 'mx-auto'
        }
    }

    return (
        <NodeViewWrapper as="div">
            <div
                ref={containerRef}
                className={`group relative transition-all ${selected ? 'rounded-lg ring-2 ring-blue-500 ring-offset-2' : ''} ${getAlignmentClasses(node.attrs.align || 'center')} ${node.attrs.align === 'full' ? 'w-full' : 'w-fit'}`}
                data-testid="iframe-container"
            >
                {selected && (
                    <div className="absolute -top-12 left-0 z-50 flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 whitespace-nowrap text-white shadow-lg">
                        <span className="text-xs font-medium">
                            {node.attrs.align === 'full' ? 'Full Width' : `${Math.round(width)}×${Math.round(height)}`}
                        </span>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white hover:bg-slate-700">
                                    {node.attrs.align === 'left' && <AlignLeft className="h-4 w-4" />}
                                    {node.attrs.align === 'center' && <AlignCenter className="h-4 w-4" />}
                                    {node.attrs.align === 'right' && <AlignRight className="h-4 w-4" />}
                                    {node.attrs.align === 'full' && <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleAlignment('left')}
                                    className={node.attrs.align === 'left' ? 'bg-blue-100' : ''}
                                >
                                    <AlignLeft className="mr-2 h-4 w-4" /> Left
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAlignment('center')}
                                    className={node.attrs.align === 'center' ? 'bg-blue-100' : ''}
                                >
                                    <AlignCenter className="mr-2 h-4 w-4" /> Center
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAlignment('right')}
                                    className={node.attrs.align === 'right' ? 'bg-blue-100' : ''}
                                >
                                    <AlignRight className="mr-2 h-4 w-4" /> Right
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleAlignment('full')}
                                    className={node.attrs.align === 'full' ? 'bg-blue-100' : ''}
                                >
                                    <Maximize2 className="mr-2 h-4 w-4" /> Full Width
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-white hover:bg-slate-700"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Done' : 'Edit'}
                        </Button>

                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white hover:bg-red-600" onClick={deleteNode}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div
                    style={{
                        width: node.attrs.align === 'full' ? '100%' : `${width}px`,
                        height: node.attrs.align === 'full' ? 'auto' : `${height}px`,
                        position: 'relative',
                        aspectRatio: node.attrs.align === 'full' ? '16 / 9' : undefined,
                    }}
                    className="overflow-hidden rounded-lg bg-slate-100 shadow-md dark:bg-slate-900"
                >
                    <iframe
                        src={node.attrs.src}
                        width={node.attrs.align === 'full' ? '100%' : width}
                        height={node.attrs.align === 'full' ? '100%' : height}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>

                {selected && node.attrs.align !== 'full' && (
                    <>
                        <div
                            className="absolute -right-2 -bottom-2 h-5 w-5 cursor-se-resize rounded-full bg-blue-500 shadow-lg transition-colors hover:bg-blue-600"
                            onMouseDown={handleDragResize}
                            title="Drag to resize"
                        />
                        <div
                            className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 cursor-ns-resize rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                const startY = e.clientY
                                const startHeight = height
                                const onMouseMove = (moveEvent: MouseEvent) => {
                                    const deltaY = moveEvent.clientY - startY
                                    const newHeight = Math.max(150, startHeight + deltaY)
                                    const newWidth = Math.round(newHeight * aspectRatio)
                                    handleResize(newWidth, newHeight)
                                }
                                const onMouseUp = () => {
                                    document.removeEventListener('mousemove', onMouseMove)
                                    document.removeEventListener('mouseup', onMouseUp)
                                }
                                document.addEventListener('mousemove', onMouseMove)
                                document.addEventListener('mouseup', onMouseUp)
                            }}
                        />
                        <div
                            className="absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 cursor-ew-resize rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                const startX = e.clientX
                                const startWidth = width
                                const onMouseMove = (moveEvent: MouseEvent) => {
                                    const deltaX = moveEvent.clientX - startX
                                    const newWidth = Math.max(200, startWidth + deltaX)
                                    const newHeight = Math.round(newWidth / aspectRatio)
                                    handleResize(newWidth, newHeight)
                                }
                                const onMouseUp = () => {
                                    document.removeEventListener('mousemove', onMouseMove)
                                    document.removeEventListener('mouseup', onMouseUp)
                                }
                                document.addEventListener('mousemove', onMouseMove)
                                document.addEventListener('mouseup', onMouseUp)
                            }}
                        />
                    </>
                )}
            </div>

            {selected && isEditing && node.attrs.align !== 'full' && (
                <div className="mt-4 space-y-4 rounded-lg border border-slate-300 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Width (px)</label>
                            <Input
                                type="number"
                                value={Math.round(width)}
                                onChange={(e) => {
                                    const newWidth = Number.parseInt(e.target.value) || width
                                    const newHeight = Math.round(newWidth / aspectRatio)
                                    handleResize(newWidth, newHeight)
                                }}
                                min="200"
                                className="h-9"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Height (px)</label>
                            <Input
                                type="number"
                                value={Math.round(height)}
                                onChange={(e) => {
                                    const newHeight = Number.parseInt(e.target.value) || height
                                    const newWidth = Math.round(newHeight * aspectRatio)
                                    handleResize(newWidth, newHeight)
                                }}
                                min="150"
                                className="h-9"
                            />
                        </div>
                    </div>

                    <Button size="sm" className="w-full" onClick={() => setIsEditing(false)}>
                        Save Changes
                    </Button>
                </div>
            )}
        </NodeViewWrapper>
    )
}
