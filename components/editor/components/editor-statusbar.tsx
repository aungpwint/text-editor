import React from 'react'
import { useEditorStore } from '../store/editor'

export const EditorStatusBar: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { editor, isFocused, history } = useEditorStore()

    if (!editor) return null

    // Get word count
    const textContent = editor.getText()
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0

    // Get character count
    const characterCount = textContent.length

    // Get current selection info
    const { from, to } = editor.state.selection
    const selectionLength = to - from

    return (
        <div className={`bg-muted text-muted-foreground flex items-center justify-between border-t px-4 py-1 text-xs ${className}`}>
            <div className="flex items-center space-x-4">
                <span>Words: {wordCount}</span>
                <span>Characters: {characterCount}</span>
                {selectionLength > 0 && <span>Selected: {selectionLength}</span>}
            </div>
            <div className="flex items-center space-x-4">
                <span>{isFocused ? 'Editing' : 'Ready'}</span>
                <div className="flex space-x-2">
                    <span className={history.canUndo ? 'text-primary' : 'text-muted-foreground'}>Undo</span>
                    <span className={history.canRedo ? 'text-primary' : 'text-muted-foreground'}>Redo</span>
                </div>
            </div>
        </div>
    )
}
