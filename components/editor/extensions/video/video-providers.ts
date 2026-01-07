import type { EmbedUrlOptions } from './types'

export interface VideoProvider {
    name: string
    regex: RegExp
    getEmbedUrl: (url: string, options: EmbedUrlOptions) => string | null
}

/* ---------------- YOUTUBE ---------------- */

export const youtubeProvider: VideoProvider = {
    name: 'youtube',
    regex: /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/.+$/,

    getEmbedUrl(url, options) {
        const idMatch =
            url.match(/youtu\.be\/([\w-]+)/) || url.match(/[?&]v=([\w-]+)/) || url.match(/embed\/([\w-]+)/) || url.match(/shorts\/([\w-]+)/)

        const videoId = idMatch?.[1]
        if (!videoId) return null

        const base = options.nocookie ? 'https://www.youtube-nocookie.com/embed/' : 'https://www.youtube.com/embed/'

        const params = new URLSearchParams()

        if (options.startAt) params.set('start', String(options.startAt))
        if (options.endTime) params.set('end', String(options.endTime))
        if (options.autoplay) params.set('autoplay', '1')
        if (options.controls === false) params.set('controls', '0')
        if (options.loop) params.set('loop', '1')
        if (options.rel !== undefined) params.set('rel', String(options.rel))

        return `${base}${videoId}${params.toString() ? `?${params}` : ''}`
    },
}

/* ---------------- VIMEO ---------------- */

export const vimeoProvider: VideoProvider = {
    name: 'vimeo',
    regex: /vimeo\.com\/(\d+)/,

    getEmbedUrl(url, options) {
        const match = url.match(/vimeo\.com\/(\d+)/)
        if (!match) return null

        const params = new URLSearchParams()
        if (options.autoplay) params.set('autoplay', '1')
        if (options.loop) params.set('loop', '1')
        if (options.controls === false) params.set('controls', '0')

        return `https://player.vimeo.com/video/${match[1]}?${params}`
    },
}

/* ---------------- TIKTOK ---------------- */

export const tiktokProvider: VideoProvider = {
    name: 'tiktok',
    regex: /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|t\/|embed\/v2\/|player\/v1\/|)(\d+|[\w-]{9})/i,

    getEmbedUrl(url, options) {
        const match = url.match(/(\d{18,19}|[\w-]{9})(?:\?|$)/i)
        const videoId = match?.[1]
        if (!videoId) return null

        const baseUrl = `https://www.tiktok.com/player/v1/${videoId}`
        const params = new URLSearchParams()

        if (options.autoplay) params.set('autoplay', '1')
        if (options.loop) params.set('loop', '1')

        if (options.controls !== undefined) {
            params.set('controls', options.controls ? '1' : '0')
            if (!options.controls) {
                params.set('progress_bar', '0')
                params.set('play_button', '0')
                params.set('volume_control', '0')
                params.set('fullscreen_button', '0')
            }
        }

        if (options.rel !== undefined) {
            params.set('rel', options.rel ? '1' : '0')
        }

        if (options.startAt) {
            params.set('start', String(options.startAt))
        }

        const queryString = params.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
}

/* ---------------- DIRECT ---------------- */

export const directVideoProvider: VideoProvider = {
    name: 'direct',
    regex: /\.(mp4|webm|ogg|mov|m3u8)$/i,
    getEmbedUrl: (url) => url,
}

export const providers = [youtubeProvider, vimeoProvider, tiktokProvider, directVideoProvider]

export const getVideoProvider = (url: string) => providers.find((p) => p.regex.test(url)) ?? null

export const getEmbedUrl = (url: string, options: EmbedUrlOptions) => getVideoProvider(url)?.getEmbedUrl(url, options) ?? null

export const isValidVideoUrl = (url: string) => providers.some((p) => p.regex.test(url))
