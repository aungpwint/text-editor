export interface EmbedUrlOptions {
    startAt?: number
    endTime?: number
    autoplay?: boolean
    controls?: boolean
    loop?: boolean
    muted?: boolean
    nocookie?: boolean
    rel?: number
}

export interface VideoOptions {
    addPasteHandler: boolean
    allowFullscreen: boolean
    autoplay: boolean
    controls: boolean
    loop: boolean
    muted: boolean
    poster: string
    width: number | string
    height: number | string
    startAt: number
    endTime: number
    nocookie: boolean
    rel: number
    containerClass: string
    inline: boolean
    HTMLAttributes: Record<string, any>
    resize?: {
        enabled: boolean
        directions: string[]
        minWidth: number
        minHeight: number
        alwaysPreserveAspectRatio: boolean
    }
}

export interface VideoAttrs {
    src: string
    provider: string
    width: number | string
    height: number | string
    start: number
    poster?: string
    autoplay: boolean
    loop: boolean
    muted: boolean
    controls: boolean
}
