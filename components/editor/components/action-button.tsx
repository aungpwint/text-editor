import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

interface ActionButtonProps {
    icon?: React.ReactNode
    children?: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    isActive?: boolean
    disabled?: boolean
    title?: string
    variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    label?: string
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ icon, children, onClick, isActive = false, disabled = false, title, variant = 'ghost', size = 'icon', className = 'h-8 w-8', label }, ref) => {
        const button = (
            <Button
                ref={ref}
                type="button"
                role="button"
                tabIndex={-1}
                data-style={isActive ? 'secondary' : variant}
                data-active-state={isActive ? 'on' : 'off'}
                data-disabled={disabled}
                variant={isActive ? 'secondary' : variant}
                size={size}
                onClick={onClick}
                onMouseDown={(e) => e.preventDefault()}
                disabled={disabled}
                className={cn(isActive && 'bg-secondary', className)}
                aria-label={label || title}
                aria-pressed={isActive}
            >
                {children ?? icon}
            </Button>
        )

        if (title) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent>
                            <p>{title}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }

        return button
    },
)

ActionButton.displayName = 'ActionButton'

export default ActionButton
