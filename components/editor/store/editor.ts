import { Editor } from '@tiptap/react'
import { create } from 'zustand'
import { DEFAULT_EDITOR_PLACEHOLDER } from '../constants'

interface EditorState {
    editor: Editor | null
    setEditor: (editor: Editor | null) => void
    content: string
    setContent: (content: string) => void
    isEditable: boolean
    setIsEditable: (editable: boolean) => void
    isFocused: boolean
    setIsFocused: (focused: boolean) => void
    placeholder: string
    setPlaceholder: (placeholder: string) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    error: string | null
    setError: (error: string | null) => void
    history: {
        canUndo: boolean
        canRedo: boolean
    }
    setHistory: (history: { canUndo: boolean; canRedo: boolean }) => void
    selection: {
        from: number
        to: number
    }
    setSelection: (selection: { from: number; to: number }) => void
}

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
    content: '',
    setContent: (content) => set({ content }),
    isEditable: true,
    setIsEditable: (isEditable) => set({ isEditable }),
    isFocused: false,
    setIsFocused: (focused) => set({ isFocused: focused }),
    placeholder: DEFAULT_EDITOR_PLACEHOLDER,
    setPlaceholder: (placeholder) => set({ placeholder }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    error: null,
    setError: (error) => set({ error }),
    history: {
        canUndo: false,
        canRedo: false,
    },
    setHistory: (history) => set({ history }),
    selection: {
        from: 0,
        to: 0,
    },
    setSelection: (selection) => set({ selection }),
}))
