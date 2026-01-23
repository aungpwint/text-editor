import type { Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Superscript } from '@tiptap/extension-superscript'
import { EditorConfig } from '../types'

/**
 * StarterKit
 */
export const StarterKitExtension = StarterKit.configure({
    heading: {
        levels: [1, 2, 3, 4, 5, 6],
    },
    link: {
        openOnClick: false,
    },
    bulletList: false,
    orderedList: false,
    listItem: false,
    listKeymap: false,
})

/**
 * Extensions Factory
 */
export const getExtensions = (config?: EditorConfig): Extensions => {
    const extensions: Extensions = [
        StarterKitExtension,
        Superscript,
    ]

    return extensions
}