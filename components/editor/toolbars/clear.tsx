import { Eraser as EraserIcon, RemoveFormatting } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const ClearToolbar: React.FC = () => {
    const { editor } = useToolbar()

    if (!editor) return null

    const clearFormatting = () => {
        editor.commands.clearNodes()
        editor.commands.unsetAllMarks()
    }

    const resetTextFormatting = () => {
        editor.commands.unsetAllMarks()
        editor.commands.clearNodes()
    }

    return (
        <>
            <ActionButton
                icon={<RemoveFormatting className="h-4 w-4" />}
                onClick={resetTextFormatting}
                disabled={!editor?.can().unsetAllMarks?.() || !editor?.can().clearNodes?.()}
                title="Reset Text Formatting"
            />
            <ActionButton
                icon={<EraserIcon className="h-4 w-4" />}
                onClick={clearFormatting}
                disabled={!editor?.can().clearNodes?.() || !editor?.can().unsetAllMarks?.()}
                title="Clear Formatting"
            />
        </>
    )
}

export default ClearToolbar