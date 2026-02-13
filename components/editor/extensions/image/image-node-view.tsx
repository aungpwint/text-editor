import type { NodeViewProps } from '@tiptap/react'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

import { useAlign } from '@/components/editor/hooks/use-align'
import { getAlignmentClasses, useResizable } from '@/components/editor/hooks/use-resizable'
import type { Alignment } from '@/components/editor/types'

export function ImageNodeView(props: NodeViewProps) {
    const { editor, node, updateAttributes, getPos } = props
    const hasContent = node.content.size > 0

    // Get the properties from the node attributes
    const src = node.attrs.src
    const alt = node.attrs.alt || ''
    const align = node.attrs['data-align']
    const initialWidth = node.attrs.width
    const showCaption = node.attrs.showCaption
    const nodeSize = node.nodeSize

    const {
        handleAlign: _handleAlign,
        isActive: _isAlignActive,
        canAlign: _canAlign,
    } = useAlign({
        editor,
        align: align as Alignment,
        extensionName: 'image',
        attributeName: 'data-align',
    })

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
        initialHeight: node.attrs.height,
        onResize: (width, height) => {
            const updates: Record<string, any> = {}
            if (width !== undefined) {
                updates.width = width
            }
            if (height !== undefined) {
                updates.height = height
            }
            if (Object.keys(updates).length > 0) {
                updateAttributes(updates)
            }
        },
        getPos,
        nodeSize,
        onUpdateAttributes: updateAttributes,
        showCaption,
        hasContent,
        enablePreview: true,
        resizeHandles: 'corners',
        enableHeightResize: true,
    })

    const shouldShowCaption = showCaption || hasContent

    return (
        <NodeViewWrapper
            onMouseEnter={onWrapperMouseEnter}
            onMouseLeave={onWrapperMouseLeave}
            onTouchStart={onWrapperTouchStart}
            data-align={align}
            data-width={width}
            className={`image-wrapper my-6 flex w-full flex-col ${getAlignmentClasses(align)}`}
        >
            <div
                ref={wrapperRef}
                data-resize-wrapper=""
                className="image-container relative z-40 flex cursor-pointer flex-col transition-all duration-100 ease-in-out select-none"
                style={{
                    width: width ? `${width}px` : 'fit-content',
                    height: height ? `${height}px` : 'auto',
                }}
            >
                <div className="relative flex max-w-full items-center">
                    <img
                        ref={mediaRef as React.RefObject<HTMLImageElement>}
                        src={src}
                        alt={alt}
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

                    {(showHandles || props.selected) && editor?.isEditable && (
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

                {editor?.isEditable && shouldShowCaption && (
                    <NodeViewContent
                        as="div"
                        className="relative mt-4 w-full max-w-full text-center text-sm break-words text-gray-500 outline-none"
                        data-placeholder="Add a caption..."
                    />
                )}
            </div>
        </NodeViewWrapper>
    )
}
