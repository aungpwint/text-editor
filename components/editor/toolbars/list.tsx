import { List as ListIcon, ListOrdered as ListOrderedIcon, ListTodoIcon } from 'lucide-react'
import { ActionMenu } from '../components/action-menu'
import { useToolbar } from '../components/toolbar-provider'

const ListToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const listOptions = [
        { name: 'Bullet List', value: 'bullet', icon: <ListIcon className="size-4" /> },
        { name: 'Ordered List', value: 'ordered', icon: <ListOrderedIcon className="size-4" /> },
        { name: 'Task List', value: 'task', icon: <ListTodoIcon className="size-4" /> },
    ]

    const getCurrentListType = () => {
        if (!editor) return ''
        if (editor.isActive('bulletList')) return 'bullet'
        if (editor.isActive('orderedList')) return 'ordered'
        if (editor.isActive('taskList')) return 'task'
        return ''
    }

    const toggleList = (value: string) => {
        if (!editor) return
        if (value === 'bullet') {
            editor.chain().focus().toggleBulletList().run()
        } else if (value === 'ordered') {
            editor.chain().focus().toggleOrderedList().run()
        } else if (value === 'task') {
            editor.chain().focus().toggleTaskList().run()
        }
    }

    return (
        <ActionMenu
            options={listOptions}
            currentValue={getCurrentListType()}
            onValueChange={toggleList}
            disabled={!editor}
            tooltipText="List Type"
            label="List"
            icon={ListIcon}
        />
    )
}

export default ListToolbar