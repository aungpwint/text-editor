import { Code as CodeIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const CodeToolbar: React.FC = () => {
    const { editor } = useToolbar()
    return (
        <ActionButton
            icon={<CodeIcon className="h-4 w-4" />}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={!editor?.can().chain().focus().toggleCode().run()}
            title="Code"
        />
    )
}

export default CodeToolbar
