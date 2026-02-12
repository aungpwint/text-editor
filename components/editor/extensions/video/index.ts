import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import type { EmbedUrlOptions, VideoOptions } from './types'
import { VideoNodeView } from './video-node-view'
import { getEmbedUrl, getVideoProvider, isValidVideoUrl, providers } from './video-providers'

type SetVideoOptions = {
    src: string
    width?: number | string
    start?: number
    poster?: string
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
    controls?: boolean
}

interface Range {
    from: number
    to: number
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        video: {
            setVideo: (options: SetVideoOptions) => ReturnType
            deleteVideo: (options?: { src?: string }) => ReturnType
        }
    }
}

export const Video = Node.create<VideoOptions>({
    name: 'video',

    atom: true,
    draggable: true,
    selectable: true,

    addOptions() {
        return {
            inline: false,
            allowFullscreen: true,
            autoplay: false,
            controls: true,
            loop: false,
            muted: false,
            poster: '',
            width: '100%',
            height: 'auto',
            startAt: 0,
            endTime: 0,
            nocookie: false,
            rel: 1,
            containerClass: 'video-container',
            addPasteHandler: true,
            HTMLAttributes: {},
            resize: {
                enabled: true,
                directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                minWidth: 400,
                minHeight: 200,
                alwaysPreserveAspectRatio: true,
            },
        }
    },

    inline() {
        return this.options.inline
    },

    group() {
        return this.options.inline ? 'inline' : 'block'
    },

    addAttributes() {
        return {
            src: { default: null },
            provider: { default: null },
            width: { default: this.options.width },
            height: { default: this.options.height },
            start: { default: this.options.startAt },
            poster: { default: this.options.poster },
            autoplay: { default: this.options.autoplay },
            loop: { default: this.options.loop },
            muted: { default: this.options.muted },
            controls: { default: this.options.controls },
            'data-align': { default: 'center' },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-video]',
                getAttrs: (el: HTMLElement) => {
                    const w = el.style.width || this.options.width
                    const align = el.getAttribute('data-align') || 'center'
                    if (typeof w === 'string') {
                        if (w.endsWith('px')) {
                            const px = parseFloat(w)
                            return { width: isNaN(px) ? this.options.width : px, 'data-align': align }
                        }
                        return { width: w, 'data-align': align }
                    }
                    return { width: w, 'data-align': align }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        const provider = HTMLAttributes.provider || getVideoProvider(HTMLAttributes.src)?.name || 'direct'
        const isDirect = provider === 'direct'
        const align = HTMLAttributes['data-align'] || 'center'

        const embedOptions: EmbedUrlOptions = {
            startAt: HTMLAttributes.start,
            autoplay: HTMLAttributes.autoplay,
            controls: HTMLAttributes.controls,
            loop: HTMLAttributes.loop,
            muted: HTMLAttributes.muted,
            nocookie: this.options.nocookie,
            rel: this.options.rel,
        }

        const src = isDirect ? HTMLAttributes.src : getEmbedUrl(HTMLAttributes.src, embedOptions)

        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                'data-video': '',
                'data-align': align,
                class: this.options.containerClass,
                style: `width:${HTMLAttributes.width}; max-width:100%;`,
            }),
            [
                isDirect ? 'video' : 'iframe',
                mergeAttributes({
                    src,
                    poster: isDirect ? HTMLAttributes.poster : null,
                    controls: isDirect && HTMLAttributes.controls ? 'true' : null,
                    autoplay: isDirect && HTMLAttributes.autoplay ? 'true' : null,
                    muted: isDirect && HTMLAttributes.muted ? 'true' : null,
                    loop: isDirect && HTMLAttributes.loop ? 'true' : null,
                    allow: !isDirect ? 'autoplay; fullscreen; picture-in-picture' : null,
                    allowfullscreen: !isDirect && this.options.allowFullscreen ? 'true' : null,
                }),
            ],
        ]
    },

    addCommands() {
        return {
            setVideo:
                (options) =>
                ({ commands }) => {
                    if (!isValidVideoUrl(options.src)) return false
                    const provider = getVideoProvider(options.src)
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            ...options,
                            provider: provider?.name || 'direct',
                        },
                    })
                },

            deleteVideo:
                (opts: { src?: string } = {}) =>
                ({ tr, state, dispatch }: { tr: any; state: any; dispatch?: (tr: any) => void }) => {
                    const targetSrc = opts.src

                    const toDelete: Range[] = []

                    const matches = (node: any): boolean => node.type?.name === this.name && (!targetSrc || node.attrs?.src === targetSrc)

                    const { selection } = state
                    const $from = (selection as any).$from

                    // NodeSelection check
                    const selectedNode = (selection as any).node
                    if (selectedNode && matches(selectedNode)) {
                        toDelete.push({ from: selection.from, to: selection.to })
                    }

                    // Traverse document for selection range
                    const start = $from?.pos ?? selection.from
                    const end = selection.to

                    state.doc.nodesBetween(start, end, (node: any, pos: number) => {
                        if (matches(node)) toDelete.push({ from: pos, to: pos + node.nodeSize })
                        return true
                    })

                    // Check cursor-adjacent nodes outside selection
                    if ($from) {
                        const addIfMatches = (node: any, pos: number) => {
                            if (matches(node)) toDelete.push({ from: pos, to: pos + node.nodeSize })
                        }

                        if ($from.nodeBefore) addIfMatches($from.nodeBefore, $from.pos - $from.nodeBefore.nodeSize)
                        if ($from.nodeAfter) addIfMatches($from.nodeAfter, $from.pos)
                    }

                    if (!toDelete.length) return false

                    // Merge overlapping or adjacent ranges
                    const merged: Range[] = []
                    toDelete
                        .sort((a, b) => a.from - b.from)
                        .forEach((span) => {
                            const last = merged[merged.length - 1]
                            if (!last || span.from > last.to) merged.push({ ...span })
                            else last.to = Math.max(last.to, span.to)
                        })

                    // Delete from end to start to avoid position shift
                    merged.sort((a, b) => b.from - a.from).forEach((span) => tr.delete(span.from, span.to))

                    if (dispatch) dispatch(tr.scrollIntoView())
                    return true
                },
        }
    },

    addPasteRules() {
        if (!this.options.addPasteHandler) return []
        return providers.map((provider) =>
            nodePasteRule({
                find: provider.regex,
                type: this.type,
                getAttributes: (match) => ({
                    src: match.input,
                    provider: provider.name,
                }),
            }),
        )
    },

    addNodeView() {
        if (!this.options.resize?.enabled) return null

        return ReactNodeViewRenderer(VideoNodeView)
    },
})