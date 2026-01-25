import { Quote as QuoteIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const QuoteToolbar: React.FC = () => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<QuoteIcon className="h-4 w-4" />}
            onClick={() => editor.commands.toggleBlockquote()}
            isActive={editor.isActive('blockquote')}
            disabled={!editor?.can().toggleBlockquote?.()}
            title="Blockquote"
        />
    )
}

export default QuoteToolbar
