import { Palette as PaletteIcon } from 'lucide-react'
import ActionButton from '../components/action-button'
import { useToolbar } from '../components/toolbar-provider'

const ColorToolbar: React.FC = () => {
    const { editor } = useToolbar()
    const toggleColor = () => {
        const color = window.prompt('Enter color (e.g., #ff0000 or red)')
        if (color) {
            editor.commands.setMark('textStyle', { color: color })
        }
    }

    return (
        <ActionButton
            icon={<PaletteIcon className="h-4 w-4" />}
            onClick={toggleColor}
            disabled={!editor?.can().setMark?.('textStyle', { color: 'red' })}
            title="Text Color"
        />
    )
}

export default ColorToolbar
