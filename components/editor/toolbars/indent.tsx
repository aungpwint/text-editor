import { IndentDecrease as IndentDecreaseIcon, IndentIncrease as IndentIncreaseIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const IndentToolbar: React.FC = () => {
    const { editor } = useToolbar()

    return (
        <>
            <ActionButton
                icon={<IndentIncreaseIcon className="h-4 w-4" />}
                onClick={() => {
                    editor.commands.setParagraph()
                    const node = editor.state.selection.$head.parent
                    if (node) {
                        editor.commands.updateAttributes('paragraph', { style: 'margin-left: 20px;' })
                    }
                }}
                disabled={!editor?.can().setParagraph?.() || !editor?.can().updateAttributes?.('paragraph', { style: 'margin-left: 20px;' })}
                title="Increase Indent"
            />
            <ActionButton
                icon={<IndentDecreaseIcon className="h-4 w-4" />}
                onClick={() => {
                    editor.commands.setParagraph()
                    editor.commands.updateAttributes('paragraph', { style: 'margin-left: 0;' })
                }}
                disabled={!editor?.can().setParagraph?.() || !editor?.can().updateAttributes?.('paragraph', { style: 'margin-left: 0;' })}
                title="Decrease Indent"
            />
        </>
    )
}

export default IndentToolbar
