import { Highlighter as HighlighterIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const HighlightToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const toggleHighlight = () => {
        editor.commands.toggleMark('highlight')
    }

    return (
        <ActionButton
            icon={<HighlighterIcon className="h-4 w-4" />}
            onClick={toggleHighlight}
            isActive={editor.isActive('highlight')}
            disabled={!editor?.can().toggleMark?.('highlight')}
            title="Highlight"
        />
    )
}

export default HighlightToolbar
