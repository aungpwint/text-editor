'use client'

import { NodeSelection } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'

// Helper function to get alignment classes
export function getAlignmentClasses(align?: 'left' | 'center' | 'right' | 'full'): string {
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

export interface ResizeParams {
    handleUsed: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    initialWidth: number
    initialHeight?: number
    initialClientX: number
    initialClientY?: number
}

export interface UseResizableConfig {
    editor?: Editor
    align?: 'left' | 'center' | 'right'
    minWidth?: number
    maxWidth?: number
    initialWidth?: number
    initialHeight?: number
    onResize?: (width?: number, height?: number) => void
    getPos?: () => number | undefined
    nodeSize?: number
    onUpdateAttributes?: (attrs: Record<string, any>) => void
    showCaption?: boolean
    hasContent?: boolean
    resizeHandles?: 'both' | 'left' | 'right' | 'corners' | 'all'
    enableHeightResize?: boolean
    aspectRatio?: number
    nodeType?: string
    enablePreview?: boolean
    minRatio?: number
    maxRatio?: number
}

export interface UseResizableReturn {
    resizeParams: ResizeParams | undefined
    setResizeParams: React.Dispatch<React.SetStateAction<ResizeParams | undefined>>
    width: number | undefined
    setWidth: React.Dispatch<React.SetStateAction<number | undefined>>
    height: number | undefined
    setHeight: React.Dispatch<React.SetStateAction<number | undefined>>
    showHandles: boolean
    setShowHandles: React.Dispatch<React.SetStateAction<boolean>>
    isResizingRef: React.RefObject<boolean>
    isMountedRef: React.RefObject<boolean>
    wrapperRef: React.RefObject<HTMLDivElement | null>
    leftResizeHandleRef: React.RefObject<HTMLDivElement | null>
    rightResizeHandleRef: React.RefObject<HTMLDivElement | null>
    topLeftResizeHandleRef: React.RefObject<HTMLDivElement | null>
    topRightResizeHandleRef: React.RefObject<HTMLDivElement | null>
    bottomLeftResizeHandleRef: React.RefObject<HTMLDivElement | null>
    bottomRightResizeHandleRef: React.RefObject<HTMLDivElement | null>
    mediaRef: React.RefObject<HTMLImageElement | HTMLVideoElement | HTMLIFrameElement | HTMLDivElement | null>
    onMediaClick: (event: React.MouseEvent) => void
    onWindowMouseMove: (event: MouseEvent | TouchEvent) => void
    onWindowMouseUp: (event: MouseEvent | TouchEvent) => void
    startResize: (handleUsed: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', clientX: number, clientY?: number) => void
    onLeftResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onLeftResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onRightResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onRightResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onTopLeftResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onTopLeftResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onTopRightResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onTopRightResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onBottomLeftResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onBottomLeftResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onBottomRightResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onBottomRightResizeTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
    onWrapperMouseEnter: () => void
    onWrapperMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void
    onWrapperTouchStart: () => void
}

export function useResizable(config: UseResizableConfig): UseResizableReturn {
    const {
        editor,
        align = 'left',
        minWidth = 96,
        maxWidth = 800,
        initialWidth,
        initialHeight,
        onResize,
        getPos,
        nodeSize,
        onUpdateAttributes,
        showCaption = false,
        hasContent = false,
        aspectRatio,
        enablePreview = false,
        minRatio,
        maxRatio,
    } = config

    const [resizeParams, setResizeParams] = useState<ResizeParams | undefined>()
    const [width, setWidth] = useState<number | undefined>(initialWidth)
    const [height, setHeight] = useState<number | undefined>(initialHeight)
    const [showHandles, setShowHandles] = useState(false)
    const isResizingRef = useRef(false)
    const isMountedRef = useRef(true)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const leftResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const rightResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const topLeftResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const topRightResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const bottomLeftResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const bottomRightResizeHandleRef = useRef<HTMLDivElement | null>(null)
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | HTMLIFrameElement | HTMLDivElement | null>(null)

    // Handle selection updates for caption management
    useEffect(() => {
        if (!editor || !showCaption) return

        const handleSelectionUpdate = () => {
            const pos = getPos?.()
            if (typeof pos !== 'number' || pos < 0 || !nodeSize) return

            const { from, to } = editor.state.selection
            const nodeStart = pos
            const nodeEnd = pos + nodeSize

            const isOutsideNode = to < nodeStart || from > nodeEnd

            if (isOutsideNode && !hasContent && onUpdateAttributes) {
                onUpdateAttributes({ showCaption: false })
            }
        }

        handleSelectionUpdate()

        editor.on('selectionUpdate', handleSelectionUpdate)
        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate)
        }
    }, [editor, showCaption, hasContent, getPos, nodeSize, onUpdateAttributes])

    const handleMediaClick = useCallback(
        (event: React.MouseEvent) => {
            if (!editor || !getPos || resizeParams) return

            event.preventDefault()
            event.stopPropagation()

            const pos = getPos()
            if (typeof pos === 'number' && pos >= 0) {
                editor.chain().focus().setNodeSelection(pos).run()
            }
        },
        [editor, getPos, resizeParams],
    )

    const windowMouseMoveHandler = useCallback(
        (event: MouseEvent | TouchEvent): void => {
            if (!resizeParams || !editor || !isMountedRef.current) return

            const clientX = 'touches' in event ? (event.touches[0]?.clientX ?? 0) : event.clientX
            const clientY = 'touches' in event ? (event.touches[0]?.clientY ?? 0) : event.clientY
            const isCornerHandle = resizeParams.handleUsed.indexOf('-') !== -1

            let newWidth = resizeParams.initialWidth
            let newHeight = resizeParams.initialHeight

            if (isCornerHandle && resizeParams.initialClientY !== undefined) {
                // Handle corner resizing
                const deltaY = clientY - resizeParams.initialClientY
                const deltaX = clientX - resizeParams.initialClientX
                const handleType = resizeParams.handleUsed as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

                if (handleType === 'top-left' || handleType === 'bottom-left') {
                    newWidth = resizeParams.initialWidth - deltaX
                } else {
                    newWidth = resizeParams.initialWidth + deltaX
                }

                if (handleType === 'top-left' || handleType === 'top-right') {
                    newHeight = (resizeParams.initialHeight || 0) - deltaY
                } else {
                    newHeight = (resizeParams.initialHeight || 0) + deltaY
                }

                // Apply aspect ratio if specified
                if (aspectRatio && newWidth && newHeight) {
                    newHeight = newWidth / aspectRatio
                }
            } else {
                // Handle edge resizing (original logic)
                const isLeftHandle = resizeParams.handleUsed === 'left'
                const multiplier = align === 'center' ? 2 : 1

                const delta = isLeftHandle
                    ? (resizeParams.initialClientX - clientX) * multiplier
                    : (clientX - resizeParams.initialClientX) * multiplier
                newWidth = resizeParams.initialWidth + delta

                if (aspectRatio && newWidth) {
                    newHeight = newWidth / aspectRatio
                }
            }

            const effectiveMaxWidth = editor.view?.dom?.firstElementChild?.clientWidth || maxWidth

            // Apply min/max constraints
            let clampedWidth = Math.min(Math.max(newWidth, minWidth), effectiveMaxWidth)
            const clampedHeight = newHeight

            if (minRatio !== undefined) {
                const minAllowedWidth = resizeParams.initialWidth * minRatio
                clampedWidth = Math.max(clampedWidth, minAllowedWidth)
            }

            if (maxRatio !== undefined) {
                const maxAllowedWidth = resizeParams.initialWidth * maxRatio
                clampedWidth = Math.min(clampedWidth, maxAllowedWidth)
            }

            setWidth(clampedWidth)
            if (clampedHeight !== undefined) {
                setHeight(clampedHeight)
            }

            if (wrapperRef.current) {
                wrapperRef.current!.style.width = `${clampedWidth}px`
                if (clampedHeight !== undefined) {
                    wrapperRef.current!.style.height = `${clampedHeight}px`
                }

                // Add temporary class for smooth visual feedback during resize
                if (enablePreview) {
                    wrapperRef.current.classList.add('resizing-preview')

                    // Remove the class after a brief delay
                    setTimeout(() => {
                        if (wrapperRef.current) {
                            wrapperRef.current.classList.remove('resizing-preview')
                        }
                    }, 100)
                }
            }

            // Prevent default to avoid text selection during resize
            event.preventDefault()
        },
        [editor, align, maxWidth, minWidth, resizeParams, aspectRatio, enablePreview, minRatio, maxRatio],
    )

    const windowMouseUpHandler = useCallback(
        (event: MouseEvent | TouchEvent): void => {
            if (!editor || !isMountedRef.current) return

            const target =
                'touches' in event
                    ? document.elementFromPoint(event.changedTouches[0]?.clientX ?? 0, event.changedTouches[0]?.clientY ?? 0)
                    : event.target

            const isInsideWrapper = target && wrapperRef.current?.contains(target as Node)

            if ((!isInsideWrapper || !editor.isEditable) && showHandles && isMountedRef.current) {
                setShowHandles(false)
            }

            if (!resizeParams) return

            const wasNodeSelection = editor.state.selection instanceof NodeSelection && editor.state.selection.node.type.name === 'image'

            if (isMountedRef.current) {
                setResizeParams(undefined)
            }

            // Remove the resizing class
            if (wrapperRef.current) {
                wrapperRef.current.classList.remove('is-resizing')
            }

            // Only trigger onResize if width actually changed
            if (width !== initialWidth) {
                onResize?.(width)
            }

            const pos = getPos?.()

            if (typeof pos === 'number' && pos >= 0 && wasNodeSelection && isMountedRef.current) {
                editor.chain().focus().setNodeSelection(pos).run()
            }

            isResizingRef.current = false
        },
        [editor, getPos, onResize, resizeParams, showHandles, width, initialWidth],
    )

    const startResize = useCallback(
        (handleUsed: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', clientX: number, clientY?: number) => {
            const currentWidth = wrapperRef.current?.clientWidth ?? initialWidth ?? minWidth
            const currentHeight = wrapperRef.current?.clientHeight ?? initialHeight

            setResizeParams({
                handleUsed,
                initialWidth: currentWidth,
                initialHeight: currentHeight,
                initialClientX: clientX,
                initialClientY: clientY,
            })
            isResizingRef.current = true

            // Add a class to indicate resizing is in progress
            if (wrapperRef.current) {
                wrapperRef.current.classList.add('is-resizing')
            }
        },
        [minWidth, initialWidth, initialHeight],
    )

    // Cleanup function to remove the resizing class
    useEffect(() => {
        const wrapperElement = wrapperRef.current
        return () => {
            if (wrapperElement) {
                wrapperElement.classList.remove('is-resizing')
            }
        }
    }, [])

    const leftResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('left', event.clientX)
    }

    const leftResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('left', touch.clientX)
    }

    const rightResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('right', event.clientX)
    }

    const rightResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('right', touch.clientX)
    }

    const topLeftResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('top-left', event.clientX, event.clientY)
    }

    const topLeftResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('top-left', touch.clientX, touch.clientY)
    }

    const topRightResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('top-right', event.clientX, event.clientY)
    }

    const topRightResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('top-right', touch.clientX, touch.clientY)
    }

    const bottomLeftResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('bottom-left', event.clientX, event.clientY)
    }

    const bottomLeftResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('bottom-left', touch.clientX, touch.clientY)
    }

    const bottomRightResizeHandleMouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        startResize('bottom-right', event.clientX, event.clientY)
    }

    const bottomRightResizeHandleTouchStartHandler = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        const touch = event.touches[0]
        if (touch) startResize('bottom-right', touch.clientX, touch.clientY)
    }

    const wrapperMouseEnterHandler = () => {
        if (editor?.isEditable && isMountedRef.current) setShowHandles(true)
    }

    const wrapperMouseLeaveHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isMountedRef.current) return

        if (event.relatedTarget === leftResizeHandleRef.current || event.relatedTarget === rightResizeHandleRef.current || resizeParams) return

        if (editor?.isEditable) setShowHandles(false)
    }

    const wrapperTouchStartHandler = () => {
        if (editor?.isEditable && isMountedRef.current) setShowHandles(true)
    }

    // Global event listeners for resize operations
    useEffect(() => {
        window.addEventListener('mousemove', windowMouseMoveHandler)
        window.addEventListener('mouseup', windowMouseUpHandler)
        window.addEventListener('touchmove', windowMouseMoveHandler, {
            passive: false,
        })
        window.addEventListener('touchend', windowMouseUpHandler)

        return () => {
            window.removeEventListener('mousemove', windowMouseMoveHandler)
            window.removeEventListener('mouseup', windowMouseUpHandler)
            window.removeEventListener('touchmove', windowMouseMoveHandler)
            window.removeEventListener('touchend', windowMouseUpHandler)
        }
    }, [windowMouseMoveHandler, windowMouseUpHandler])

    // Cleanup mounted ref on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false
        }
    }, [])

    return {
        resizeParams,
        setResizeParams,
        width,
        setWidth,
        height,
        setHeight,
        showHandles,
        setShowHandles,
        isResizingRef,
        isMountedRef,
        wrapperRef,
        leftResizeHandleRef,
        rightResizeHandleRef,
        topLeftResizeHandleRef,
        topRightResizeHandleRef,
        bottomLeftResizeHandleRef,
        bottomRightResizeHandleRef,
        mediaRef,
        onMediaClick: handleMediaClick,
        onWindowMouseMove: windowMouseMoveHandler,
        onWindowMouseUp: windowMouseUpHandler,
        startResize,
        onLeftResizeMouseDown: leftResizeHandleMouseDownHandler,
        onLeftResizeTouchStart: leftResizeHandleTouchStartHandler,
        onRightResizeMouseDown: rightResizeHandleMouseDownHandler,
        onRightResizeTouchStart: rightResizeHandleTouchStartHandler,
        onTopLeftResizeMouseDown: topLeftResizeHandleMouseDownHandler,
        onTopLeftResizeTouchStart: topLeftResizeHandleTouchStartHandler,
        onTopRightResizeMouseDown: topRightResizeHandleMouseDownHandler,
        onTopRightResizeTouchStart: topRightResizeHandleTouchStartHandler,
        onBottomLeftResizeMouseDown: bottomLeftResizeHandleMouseDownHandler,
        onBottomLeftResizeTouchStart: bottomLeftResizeHandleTouchStartHandler,
        onBottomRightResizeMouseDown: bottomRightResizeHandleMouseDownHandler,
        onBottomRightResizeTouchStart: bottomRightResizeHandleTouchStartHandler,
        onWrapperMouseEnter: wrapperMouseEnterHandler,
        onWrapperMouseLeave: wrapperMouseLeaveHandler,
        onWrapperTouchStart: wrapperTouchStartHandler,
    }
}
