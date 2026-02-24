import { Square as SquareIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const IframeToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const addIframe = () => {
        const url = window.prompt('Enter iframe URL')
        if (url) {
            editor.commands.insertContent(`<iframe src="${url}" width="100%" height="400px" frameborder="0"></iframe>`)
        }
    }

    return (
        <ActionButton
            icon={<SquareIcon className="h-4 w-4" />}
            onClick={addIframe}
            disabled={!editor?.can().insertContent?.('<iframe src="test" width="100%" height="400px" frameborder="0"></iframe>')}
            title="Add Iframe"
        />
    )
}

export default IframeToolbar
