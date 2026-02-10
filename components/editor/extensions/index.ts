import type { Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import { ListKit } from '@tiptap/extension-list'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontFamily, LineHeight, TextStyle } from '@tiptap/extension-text-style'

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
export const getExtensions = (config?: EditorConfig, EditorFloatingMenu?: any): Extensions => {
    const extensions: Extensions = [
        StarterKitExtension,
        TextStyle,
        Subscript,
        Superscript,
        LineHeight.configure({
            types: ['textStyle'],
        }),
        FontFamily.configure({
            types: ['textStyle'],
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        ListKit.configure({
            listItem: {
                HTMLAttributes: { class: 'list-item' },
            },
            taskList: {
                HTMLAttributes: { class: 'task-list' },
            },
            taskItem: {
                HTMLAttributes: { class: 'task-item' },
                nested: false,
            },
        }),
    ]

    if (config?.enableFloatingMenu && EditorFloatingMenu) {
        extensions.push(EditorFloatingMenu)
    }

    return extensions
}
