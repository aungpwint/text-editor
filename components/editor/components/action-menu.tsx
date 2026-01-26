import { useMediaQuery } from '@/hooks/use-media-query'
import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { MobileToolbarGroup, MobileToolbarItem } from './mobile-toolbar-group'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Option {
    name: string
    value: string
    icon?: React.ReactNode
    style?: React.CSSProperties
}

interface ActionMenuProps {
    options: Option[]
    currentValue: string
    onValueChange: (value: string) => void
    disabled?: boolean
    tooltipText?: string
    label?: string
    icon?: LucideIcon
    showLabel?: boolean
    dropdownMenuContentClassName?: string
    dropdownMenuGroupClassName?: string
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    options,
    currentValue,
    onValueChange,
    disabled = false,
    tooltipText = 'Options',
    label = 'Options',
    icon: Icon,
    showLabel = false,
    dropdownMenuContentClassName = 'min-w-40',
    dropdownMenuGroupClassName = 'min-w-40',
}) => {
    const isMobile = useMediaQuery('(max-width: 640px)')

    const findIndex = (value: string) => {
        return options.findIndex((option) => option.value === value)
    }

    if (isMobile) {
        return (
            <MobileToolbarGroup label={options[findIndex(currentValue)]?.name ?? label}>
                {options.map((option, index) => (
                    <MobileToolbarItem key={index} onClick={() => onValueChange(option.value)} active={currentValue === option.value}>
                        <span>{option.icon}</span>
                        <span style={option.style}>{option.name}</span>
                    </MobileToolbarItem>
                ))}
            </MobileToolbarGroup>
        )
    }

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger disabled={disabled} asChild>
                        <Button variant="ghost" size="icon" className="h-8 min-w-[1rem] gap-0 px-2 py-1 text-xs font-normal has-[>svg]:px-1">
                            {options[findIndex(currentValue)]?.icon ? (
                                <span className="m-0 p-0">{options[findIndex(currentValue)]?.icon}</span>
                            ) : Icon ? (
                                <Icon className="h-4 w-4" />
                            ) : null}
                            {showLabel && <span className="hidden sm:inline">{options[findIndex(currentValue)]?.name}</span>}
                            <ChevronDown className="size-2.5" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
            <DropdownMenuContent
                loop
                onCloseAutoFocus={(e: any) => {
                    e.preventDefault()
                }}
                className={dropdownMenuContentClassName}
            >
                <DropdownMenuGroup className={dropdownMenuGroupClassName}>
                    {options.map((option, index) => (
                        <DropdownMenuItem
                            onSelect={() => {
                                onValueChange(option.value)
                            }}
                            key={index}
                        >
                            <span>{option.icon}</span>
                            <span style={option.style}>{option.name}</span>

                            {option.value === currentValue && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
