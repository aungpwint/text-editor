import { Underline } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

interface UnderlineToolbarProps {
    className?: string
    iconClassName?: string
}

const UnderlineToolbar: React.FC<UnderlineToolbarProps> = ({ className = 'h-8 w-8', iconClassName = 'h-4 w-4' }) => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<Underline className={iconClassName} />}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={!editor?.can().chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
            className={className}
        />
    )
}

export default UnderlineToolbar
