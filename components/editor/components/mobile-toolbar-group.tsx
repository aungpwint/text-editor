import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface MobileToolbarGroupProps {
    label: string
    children: React.ReactNode
}

export const MobileToolbarGroup: React.FC<MobileToolbarGroupProps> = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <Button variant="outline" size="sm" className="h-8 w-full justify-between" onClick={() => setIsOpen(!isOpen)}>
                {label}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="bg-popover absolute top-full left-0 z-50 mt-1 w-full rounded-md border p-2 shadow-md">
                    <div className="flex flex-col gap-1">{children}</div>
                </div>
            )}
        </div>
    )
}

interface MobileToolbarItemProps {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
}

export const MobileToolbarItem: React.FC<MobileToolbarItemProps> = ({ onClick, active = false, children }) => {
    return (
        <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="h-8 w-full justify-start" onClick={onClick}>
            {children}
        </Button>
    )
}
