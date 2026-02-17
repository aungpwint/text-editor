import type { Alignment } from '@/components/editor/types'
import { CommandProps, Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import IframeNodeView from './iframe-node-view'

interface SetIframeOptions {
    src: string
    width?: number
    height?: number
    align?: Alignment
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            setIframe: (options: SetIframeOptions) => ReturnType
            deleteIframe: (options?: { src?: string }) => ReturnType
        }
    }
}

export const Iframe = Node.create({
    name: 'iframe',
    group: 'block',
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (element) => element.getAttribute('src'),
            },
            width: {
                default: 640,
                parseHTML: (element) => {
                    const width = element.getAttribute('width')
                    return width ? parseInt(width) : 640
                },
            },
            height: {
                default: 360,
                parseHTML: (element) => {
                    const height = element.getAttribute('height')
                    return height ? parseInt(height) : 360
                },
            },
            align: {
                default: 'center',
                parseHTML: (element) => element.getAttribute('data-align') || 'center',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="iframe"]',
            },
            {
                tag: 'iframe',
                getAttrs: (node) => {
                    if (typeof node === 'string' || !(node instanceof HTMLElement)) return false
                    return {
                        src: node.getAttribute('src'),
                        width: parseInt(node.getAttribute('width') || '640'),
                        height: parseInt(node.getAttribute('height') || '360'),
                    }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'iframe',
            }),
            [
                'iframe',
                {
                    src: HTMLAttributes.src || '',
                    width: String(HTMLAttributes.width || '640'),
                    height: String(HTMLAttributes.height || '360'),
                    frameborder: '0',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowfullscreen: 'true',
                },
            ],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(IframeNodeView)
    },

    addCommands() {
        return {
            setIframe: (options: SetIframeOptions) => (props: CommandProps) => {
                return props.commands.insertContent({
                    type: this.name,
                    attrs: {
                        src: options.src,
                        width: options.width ?? 640,
                        height: options.height ?? 360,
                        align: options.align ?? 'center',
                    },
                })
            },
            deleteIframe: (_options?: { src?: string }) => (props: CommandProps) => {
                return props.commands.deleteNode(this.name)
            },
        }
    },
})

export default Iframe
