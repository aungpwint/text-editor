import { Type as FontFamilyIcon } from 'lucide-react'
import { ActionMenu } from '../components/action-menu'
import { useToolbar } from '../components/toolbar-provider'
import { FONT_FAMILIES } from '../constants'

const FontFamilyToolbar: React.FC = () => {
    const { editor } = useToolbar()

    const getCurrentFontFamily = () => {
        if (!editor) return 'Arial, sans-serif'
        const currentStyle = editor.getAttributes('textStyle')
        return currentStyle.fontFamily || 'Arial, sans-serif'
    }

    const setFontFamily = (family: string) => {
        editor?.commands.setFontFamily(family)
    }

    return (
        <ActionMenu
            options={FONT_FAMILIES}
            currentValue={getCurrentFontFamily()}
            onValueChange={setFontFamily}
            disabled={!editor}
            tooltipText="Font Family"
            label="Font"
            icon={FontFamilyIcon}
            showLabel={false}
        />
    )
}

export default FontFamilyToolbar
