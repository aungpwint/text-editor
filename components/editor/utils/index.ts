import { NodeSelection } from '@tiptap/pm/state'
import { type Editor } from '@tiptap/react'

/**
 * Checks if a value is a valid number (not null, undefined, or NaN)
 * @param value - The value to check
 * @returns boolean indicating if the value is a valid number
 */
export function isValidPosition(pos: number | null | undefined): pos is number {
    return typeof pos === 'number' && pos >= 0
}

/**
 * Checks if one or more extensions are registered in the Tiptap editor.
 * @param editor - The Tiptap editor instance
 * @param extensionNames - A single extension name or an array of names to check
 * @returns True if at least one of the extensions is available, false otherwise
 */
export function isExtensionAvailable(editor: Editor | null, extensionNames: string | string[]): boolean {
    if (!editor) return false

    const names = Array.isArray(extensionNames) ? extensionNames : [extensionNames]

    const found = names.some((name) => editor.extensionManager.extensions.some((ext) => ext.name === name))

    if (!found) {
        console.warn(
            `None of the extensions [${names.join(', ')}] were found in the editor schema. Ensure they are included in the editor configuration.`,
        )
    }

    return found
}

/**
 * Determines whether the current selection contains a node whose type matches
 * any of the provided node type names.
 * @param editor Tiptap editor instance
 * @param nodeTypeNames List of node type names to match against
 * @param checkAncestorNodes Whether to check ancestor node types up the depth chain
 */
export function isNodeTypeSelected(editor: Editor | null, nodeTypeNames: string[] = [], checkAncestorNodes: boolean = false): boolean {
    if (!editor || !editor.state.selection) return false

    const { selection } = editor.state
    if (selection.empty) return false

    // Direct node selection check
    if (selection instanceof NodeSelection) {
        const selectedNode = selection.node
        return selectedNode ? nodeTypeNames.includes(selectedNode.type.name) : false
    }

    // Depth-based ancestor node check
    if (checkAncestorNodes) {
        const { $from } = selection
        for (let depth = $from.depth; depth > 0; depth--) {
            const ancestorNode = $from.node(depth)
            if (nodeTypeNames.includes(ancestorNode.type.name)) {
                return true
            }
        }
    }

    return false
}
