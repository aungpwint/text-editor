import { Strikethrough } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

interface StrikethroughToolbarProps {
    className?: string
    iconClassName?: string
}

const StrikethroughToolbar: React.FC<StrikethroughToolbarProps> = ({ className = 'h-8 w-8', iconClassName = 'h-4 w-4' }) => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<Strikethrough className={iconClassName} />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={!editor?.can().chain().focus().toggleStrike().run()}
            title="Strikethrough"
            className={className}
        />
    )
}

export default StrikethroughToolbar
