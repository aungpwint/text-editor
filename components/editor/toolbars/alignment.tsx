import {
    AlignCenter as AlignCenterIcon,
    AlignJustify as AlignJustifyIcon,
    AlignLeft as AlignLeftIcon,
    AlignRight as AlignRightIcon,
} from 'lucide-react'
import { ActionMenu } from '../components/action-menu'
import { useToolbar } from '../components/toolbar-provider'

const AlignmentToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const handleAlign = (value: string) => {
        editor.chain().focus().setTextAlign(value).run()
    }

    const currentTextAlign = () => {
        if (editor.isActive({ textAlign: 'left' })) {
            return 'left'
        }
        if (editor.isActive({ textAlign: 'center' })) {
            return 'center'
        }
        if (editor.isActive({ textAlign: 'right' })) {
            return 'right'
        }
        if (editor.isActive({ textAlign: 'justify' })) {
            return 'justify'
        }

        return 'left'
    }

    const alignmentOptions = [
        {
            name: 'Left Align',
            value: 'left',
            icon: <AlignLeftIcon className="h-4 w-4" />,
        },
        {
            name: 'Center Align',
            value: 'center',
            icon: <AlignCenterIcon className="h-4 w-4" />,
        },
        {
            name: 'Right Align',
            value: 'right',
            icon: <AlignRightIcon className="h-4 w-4" />,
        },
        {
            name: 'Justify Align',
            value: 'justify',
            icon: <AlignJustifyIcon className="h-4 w-4" />,
        },
    ]

    return (
        <ActionMenu
            options={alignmentOptions}
            currentValue={currentTextAlign()}
            onValueChange={handleAlign}
            disabled={!editor?.can().chain().focus().setTextAlign('left').run()}
            tooltipText="Text Alignment"
            label="Alignment"
        />
    )
}

export default AlignmentToolbar