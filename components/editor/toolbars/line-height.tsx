import { ArrowUpZA as LineHeightIcon } from 'lucide-react'
import { ActionMenu } from '../components/action-menu'
import { useToolbar } from '../components/toolbar-provider'

const LineHeightToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const lineHeightOptions = [
        { name: 'Default', value: 'normal' },
        { name: '1.0', value: '1' },
        { name: '1.25', value: '1.25' },
        { name: '1.5', value: '1.5' },
        { name: '1.75', value: '1.75' },
        { name: '2.0', value: '2' },
        { name: '2.5', value: '2.5' },
        { name: '3.0', value: '3' },
        { name: '3.5', value: '3.5' },
        { name: '4.0', value: '4' },
    ]

    const getCurrentLineHeight = () => {
        if (editor) {
            for (const option of lineHeightOptions) {
                if (option.value !== 'normal') {
                    if (editor.isActive('textStyle', { lineHeight: option.value })) {
                        return option.value
                    }
                }
            }
        }
        return 'normal'
    }

    const currentLineHeight = getCurrentLineHeight()

    const handleLineHeightChange = (value: string) => {
        if (value === 'normal' || value === '') {
            editor?.chain().focus().unsetLineHeight().run()
        } else {
            editor?.chain().focus().setLineHeight(value).run()
        }
    }

    return (
        <ActionMenu
            options={lineHeightOptions.map((option) => ({
                ...option,
                name: option.name,
                value: option.value,
            }))}
            currentValue={currentLineHeight}
            onValueChange={handleLineHeightChange}
            disabled={!editor}
            tooltipText="Line Height"
            label="Line Height"
            icon={LineHeightIcon}
            showLabel={false}
            dropdownMenuContentClassName="w-12"
            dropdownMenuGroupClassName="min-w-4"
        />
    )
}

export default LineHeightToolbar
