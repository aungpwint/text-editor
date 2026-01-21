import { Redo2, Undo2 } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const HistoryToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const canUndo = editor.can().undo?.() || false
    const canRedo = editor.can().redo?.() || false

    return (
        <>
            <ActionButton icon={<Undo2 className="h-4 w-4" />} onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!canUndo} />
            <ActionButton icon={<Redo2 className="h-4 w-4" />} onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!canRedo} />
        </>
    )
}

export default HistoryToolbar
