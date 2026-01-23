import { Superscript } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const SuperscriptToolbar: React.FC = () => {
    const { editor } = useToolbar()

    return (
        <ActionButton
            icon={<Superscript className="h-4 w-4" />}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            disabled={!editor?.can().chain().focus().toggleSuperscript().run()}
            title="Superscript"
        />
    )
}

export default SuperscriptToolbar
