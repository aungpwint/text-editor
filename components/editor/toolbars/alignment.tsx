import { Bold } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

interface BoldToolbarProps {
    className?: string
    iconClassName?: string
}

const BoldToolbar: React.FC<BoldToolbarProps> = ({ className = 'h-8 w-8', iconClassName = 'h-4 w-4' }) => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<Bold className={iconClassName} />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            title="Bold"
            className={className}
        />
    )
}

export default BoldToolbar