import type { Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import { ListKit } from '@tiptap/extension-list'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontFamily, LineHeight, TextStyle } from '@tiptap/extension-text-style'
import { Iframe } from './iframe'
import ImageExtension from './image'
import { Video } from './video'

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
        Iframe,
    ]

    if (config?.enableImages) {
        extensions.push(
            ImageExtension.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'enhanced-image',
                },
                resize: {
                    enabled: true,
                    directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    minWidth: 200,
                    minHeight: 150,
                    alwaysPreserveAspectRatio: true,
                },
                // alignment: {
                //     enabled: true,
                //     defaultAlignment: 'center',
                // },
                // note: {
                //     enabled: true,
                //     placeholder: 'Add a note...',
                //     editable: true,
                // },
            }),
        )
    }

    if (config?.enableVideos) {
        extensions.push(
            Video.configure({
                inline: false,
                containerClass: 'video-container',
                width: '100%',
                height: 'auto',
                resize: {
                    enabled: true,
                    directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    minWidth: 200,
                    minHeight: 150,
                    alwaysPreserveAspectRatio: true,
                },
            }),
        )
    }

    if (config?.enableFloatingMenu && EditorFloatingMenu) {
        extensions.push(EditorFloatingMenu)
    }

    return extensions
}
