import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import React from 'react'
import { ToolbarProvider } from '../toolbar-provider'

import { EditorConfig } from '../types'

interface EditorToolbarProps {
    editor: Editor
    config?: EditorConfig
    className?: string
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, className }) => {
    return (
        <ToolbarProvider editor={editor}>
            <div className={cn('flex flex-wrap items-center gap-0.5', className)}>
           
            </div>
        </ToolbarProvider>
    )
}
