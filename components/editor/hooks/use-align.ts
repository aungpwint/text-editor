'use client'

import { useIsBreakpoint } from '@/hooks/use-is-breakpoint'
import { NodeSelection } from '@tiptap/pm/state'
import { type Editor } from '@tiptap/react'
import { AlignCenterHorizontal, AlignEndHorizontal, AlignStartHorizontal } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Alignment } from '../types'
import { isExtensionAvailable } from '../utils'

/**
 * Configuration for the align functionality
 */
export interface UseAlignConfig {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor | null
    /**
     * The alignment to apply.
     */
    align: Alignment
    /**
     * The name of the extension to target.
     * @default "image"
     */
    extensionName: string
    /**
     * The attribute name used for alignment.
     * @default "data-align"
     */
    attributeName?: string
    /**
     * Whether the button should hide when alignment is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean
    /**
     * Callback function called after a successful alignment change.
     */
    onAligned?: () => void
}

export const ALIGN_SHORTCUT_KEYS: Record<Alignment, string> = {
    left: 'alt+shift+l',
    center: 'alt+shift+e',
    right: 'alt+shift+r',
    full: 'alt+shift+j',
}

export const alignIcons = {
    left: AlignStartHorizontal,
    center: AlignCenterHorizontal,
    right: AlignEndHorizontal,
    full: AlignEndHorizontal,
}

export const alignLabels: Record<Alignment, string> = {
    left: 'Align left',
    center: 'Align center',
    right: 'Align right',
    full: 'Align justify',
}

/**
 * Checks if alignment can be performed in the current editor state
 */
export function canSetAlign(editor: Editor | null, align: Alignment, extensionName: string, attributeName: string = 'data-align'): boolean {
    if (!editor || !editor.isEditable) return false
    if (!isExtensionAvailable(editor, [extensionName])) return false

    // Check if we can update the attribute
    try {
        return editor.can().updateAttributes(extensionName, { [attributeName]: align })
    } catch {
        return false
    }
}

/**
 * Checks if the alignment is currently active
 */
export function isAlignActive(editor: Editor | null, align: Alignment, extensionName: string, attributeName: string = 'data-align'): boolean {
    if (!editor || !editor.isEditable) return false
    if (!isExtensionAvailable(editor, [extensionName])) return false

    const attributes = editor.getAttributes(extensionName)
    const currentAlign = attributes[attributeName] || 'left'
    return currentAlign === align
}

/**
 * Sets alignment in the editor
 */
export function setAlign(editor: Editor | null, align: Alignment, extensionName: string, attributeName: string = 'data-align'): boolean {
    if (!editor?.isEditable) {
        return false
    }

    if (!isExtensionAvailable(editor, [extensionName])) {
        return false
    }

    if (!canSetAlign(editor, align, extensionName, attributeName)) {
        return false
    }

    try {
        const { selection } = editor.state
        const isNodeSelection = selection instanceof NodeSelection
        const selectionPosition = isNodeSelection ? selection.from : selection.$anchor.pos

        const alignmentUpdated = editor
            .chain()
            .focus()
            .updateAttributes(extensionName, { [attributeName]: align })
            .run()

        if (alignmentUpdated && isNodeSelection) {
            editor.commands.setNodeSelection(selectionPosition)
        }

        return alignmentUpdated
    } catch {
        return false
    }
}

/**
 * Determines if the align button should be shown
 */
export function shouldShowAlignButton(props: {
    editor: Editor | null
    hideWhenUnavailable: boolean
    align: Alignment
    extensionName: string
    attributeName?: string
}): boolean {
    const { editor, hideWhenUnavailable, align, extensionName, attributeName = 'data-align' } = props

    if (!editor || !editor.isEditable) return false
    if (!isExtensionAvailable(editor, [extensionName])) return false

    if (hideWhenUnavailable) {
        return canSetAlign(editor, align, extensionName, attributeName)
    }

    return true
}

export function useAlign(config: UseAlignConfig) {
    const { editor, align, extensionName, attributeName = 'data-align', hideWhenUnavailable = false, onAligned } = config

    const isMobile = useIsBreakpoint()
    const [isVisible, setIsVisible] = useState<boolean>(true)
    const canAlign = editor ? canSetAlign(editor, align, extensionName, attributeName) : false
    const isActive = editor ? isAlignActive(editor, align, extensionName, attributeName) : false

    useEffect(() => {
        if (!editor) return

        const handleSelectionUpdate = () => {
            setIsVisible(
                shouldShowAlignButton({
                    editor,
                    align,
                    hideWhenUnavailable,
                    extensionName,
                    attributeName,
                }),
            )
        }

        handleSelectionUpdate()

        editor.on('selectionUpdate', handleSelectionUpdate)
        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate)
        }
    }, [editor, hideWhenUnavailable, align, extensionName, attributeName])

    const handleAlign = useCallback(() => {
        if (!editor) return false

        const success = setAlign(editor, align, extensionName, attributeName)
        if (success) {
            onAligned?.()
        }
        return success
    }, [editor, align, extensionName, attributeName, onAligned])

    useHotkeys(
        ALIGN_SHORTCUT_KEYS[align],
        (event) => {
            event.preventDefault()
            handleAlign()
        },
        {
            enabled: isVisible && canAlign,
            enableOnContentEditable: !isMobile,
            enableOnFormTags: true,
        },
    )

    return {
        isVisible,
        isActive,
        handleAlign,
        canAlign,
        label: alignLabels[align],
        shortcutKeys: ALIGN_SHORTCUT_KEYS[align],
        Icon: alignIcons[align],
    }
}
