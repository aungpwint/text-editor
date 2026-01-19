import { Heading, Heading1, Heading2, Heading3, Heading4 } from 'lucide-react'
import { ActionMenu } from '../components/action-menu'
import { useToolbar } from '../components/toolbar-provider'

const HeadingToolbar: React.FC = () => {
    const { editor } = useToolbar()
    const activeLevel = editor.isActive('heading', { level: 1 })
        ? 1
        : editor.isActive('heading', { level: 2 })
          ? 2
          : editor.isActive('heading', { level: 3 })
            ? 3
            : editor.isActive('heading', { level: 4 })
              ? 4
              : 0

    const handleHeadingChange = (value: string) => {
        const level = parseInt(value)
        if (level === 0) {
            editor.chain().focus().setParagraph().run()
        } else {
            editor
                .chain()
                .focus()
                .toggleHeading({ level: level as any })
                .run()
        }
    }

    const headingOptions = [
        {
            name: 'Paragraph',
            value: '0',
            icon: <Heading className="h-4 w-4" />,
        },
        {
            name: 'Heading 1',
            value: '1',
            icon: <Heading1 className="h-4 w-4" />,
        },
        {
            name: 'Heading 2',
            value: '2',
            icon: <Heading2 className="h-4 w-4" />,
        },
        {
            name: 'Heading 3',
            value: '3',
            icon: <Heading3 className="h-4 w-4" />,
        },
        {
            name: 'Heading 4',
            value: '4',
            icon: <Heading4 className="h-4 w-4" />,
        },
    ]

    return (
        <ActionMenu
            options={headingOptions}
            currentValue={activeLevel.toString()}
            onValueChange={handleHeadingChange}
            tooltipText="Text Format"
            label="Format"
            icon={Heading}
        />
    )
}

export default HeadingToolbar