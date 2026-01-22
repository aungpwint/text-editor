import { Italic } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

interface ItalicToolbarProps {
    className?: string
    iconClassName?: string
}

const ItalicToolbar: React.FC<ItalicToolbarProps> = ({ className = 'h-8 w-8', iconClassName = 'h-4 w-4' }) => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<Italic className={iconClassName} />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            title="Italic"
            className={className}
        />
    )
}

export default ItalicToolbar
