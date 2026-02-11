import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'

import { useAlign } from '@/components/editor/hooks/use-align'
import { getAlignmentClasses, useResizable } from '@/components/editor/hooks/use-resizable'
import type { Alignment } from '@/components/editor/types'
import { getEmbedUrl } from './video-providers'

interface VideoNodeViewProps extends NodeViewProps {
    node: any
    editor: any
    updateAttributes: (attrs: any) => void
    getPos: () => number | undefined
    selected: boolean
    deleteNode: () => void
}

export function VideoNodeView(props: VideoNodeViewProps) {
    const { editor, node, updateAttributes, getPos, selected } = props

    // Get the properties from the node attributes
    const src = node.attrs.src
    const provider = node.attrs.provider || 'direct'
    const isDirect = provider === 'direct'
    const initialWidth =
        typeof node.attrs.width === 'string' && node.attrs.width.endsWith('px')
            ? parseInt(node.attrs.width, 10)
            : typeof node.attrs.width === 'number'
              ? node.attrs.width
              : 400
    const initialHeight = node.attrs.height
    const autoplay = node.attrs.autoplay
    const controls = node.attrs.controls
    const loop = node.attrs.loop
    const muted = node.attrs.muted
    const poster = node.attrs.poster
    const start = node.attrs.start
    const align = node.attrs['data-align'] || 'center'
    const nodeSize = node.nodeSize

    // Integration with useAlign hook
    const {
        handleAlign: _handleAlign,
        isActive: _isAlignActive,
        canAlign: _canAlign,
    } = useAlign({
        editor,
        align: align as Alignment,
        extensionName: 'video',
        attributeName: 'data-align',
        onAligned: () => {
            // Alignment change handled through updateAttributes in useResizable
        },
    })

    const embedOptions = {
        startAt: start,
        autoplay,
        controls,
        loop,
        muted,
        nocookie: false, // This could be passed as an option
        rel: 1, // This could be passed as an option
    }

    const videoSrc = isDirect ? src : getEmbedUrl(src, embedOptions) || ''

    const {
        width,
        height,
        showHandles,
        wrapperRef,
        topLeftResizeHandleRef,
        topRightResizeHandleRef,
        bottomLeftResizeHandleRef,
        bottomRightResizeHandleRef,
        mediaRef,
        onMediaClick,
        onTopLeftResizeMouseDown,
        onTopLeftResizeTouchStart,
        onTopRightResizeMouseDown,
        onTopRightResizeTouchStart,
        onBottomLeftResizeMouseDown,
        onBottomLeftResizeTouchStart,
        onBottomRightResizeMouseDown,
        onBottomRightResizeTouchStart,
        onWrapperMouseEnter,
        onWrapperMouseLeave,
        onWrapperTouchStart,
    } = useResizable({
        editor,
        align,
        minWidth: 200,
        maxWidth: 800,
        initialWidth,
        initialHeight,
        onResize: (newWidth, newHeight) => {
            const updates: Record<string, any> = {}
            if (newWidth !== undefined) {
                updates.width = newWidth
            }
            if (newHeight !== undefined) {
                updates.height = newHeight
            }
            if (Object.keys(updates).length > 0) {
                updateAttributes(updates)
            }
        },
        getPos: () => {
            const pos = getPos?.()
            return typeof pos === 'number' ? pos : 0
        },
        nodeSize,
        onUpdateAttributes: updateAttributes,
        showCaption: false, // Video doesn't have captions
        hasContent: false, // Video doesn't have content
        enablePreview: true,
        resizeHandles: 'corners',
        enableHeightResize: true,
        aspectRatio: initialHeight && initialWidth ? initialHeight / initialWidth : undefined,
    })

    return (
        <NodeViewWrapper
            onMouseEnter={onWrapperMouseEnter}
            onMouseLeave={onWrapperMouseLeave}
            onTouchStart={onWrapperTouchStart}
            data-align={align}
            className={`enhanced-video-wrapper my-6 flex w-full flex-col ${getAlignmentClasses(align)}`}
        >
            <div
                ref={wrapperRef}
                data-resize-wrapper=""
                className={`enhanced-video relative z-40 flex cursor-pointer flex-col transition-all duration-100 ease-in-out select-none ${selected ? 'ProseMirror-selectednode' : ''}`}
                style={{
                    width: width ? `${width}px` : 'fit-content',
                    height: height ? `${height}px` : 'auto',
                }}
            >
                <div className="relative flex max-w-full items-center">
                    {isDirect ? (
                        <video
                            ref={mediaRef as React.RefObject<HTMLVideoElement>}
                            src={videoSrc}
                            poster={poster || undefined}
                            controls={controls}
                            autoPlay={autoplay}
                            muted={muted}
                            loop={loop}
                            className="max-w-full rounded-md"
                            contentEditable={false}
                            draggable={false}
                            onClick={onMediaClick}
                            style={{
                                cursor: editor?.isEditable ? 'pointer' : 'default',
                                width: '100%',
                                height: height ? `${height}px` : 'auto',
                                display: 'block',
                                outline: 'none',
                                border: 'none',
                            }}
                        />
                    ) : (
                        <iframe
                            ref={mediaRef as React.RefObject<HTMLIFrameElement>}
                            src={videoSrc}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="max-w-full rounded-md"
                            contentEditable={false}
                            draggable={false}
                            onClick={onMediaClick}
                            style={{
                                cursor: editor?.isEditable ? 'pointer' : 'default',
                                width: '100%',
                                height: height ? `${height}px` : 'auto',
                                display: 'block',
                                outline: 'none',
                                border: 'none',
                            }}
                        />
                    )}

                    {(showHandles || selected) && editor?.isEditable && (
                        <>
                            {/* Corner resize handles */}
                            <div
                                ref={topLeftResizeHandleRef}
                                data-resize-handle="top-left"
                                onMouseDown={onTopLeftResizeMouseDown}
                                onTouchStart={onTopLeftResizeTouchStart}
                            />
                            <div
                                ref={topRightResizeHandleRef}
                                data-resize-handle="top-right"
                                onMouseDown={onTopRightResizeMouseDown}
                                onTouchStart={onTopRightResizeTouchStart}
                            />
                            <div
                                ref={bottomLeftResizeHandleRef}
                                data-resize-handle="bottom-left"
                                onMouseDown={onBottomLeftResizeMouseDown}
                                onTouchStart={onBottomLeftResizeTouchStart}
                            />
                            <div
                                ref={bottomRightResizeHandleRef}
                                data-resize-handle="bottom-right"
                                onMouseDown={onBottomRightResizeMouseDown}
                                onTouchStart={onBottomRightResizeTouchStart}
                            />
                        </>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    )
}