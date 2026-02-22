'use client'

import { forwardRef, useCallback } from 'react'

import { ActionButton, type ActionButtonProps } from './action-button'
import { useAlign, type UseAlignConfig } from '@/components/editor/hooks/use-align'

export interface AlignButtonProps extends Omit<ActionButtonProps, 'type'>, UseAlignConfig {
    text?: string
    showShortcut?: boolean
}

export const AlignButton = forwardRef<HTMLButtonElement, AlignButtonProps>(
    (
        {
            editor,
            align,
            text: _text,
            extensionName,
            attributeName = 'data-align',
            hideWhenUnavailable = false,
            onAligned,
            showShortcut: _showShortcut = false,
            onClick,
            children: _children,
            ...props
        },
        ref,
    ) => {
        const { isVisible, handleAlign, label, canAlign } = useAlign({
            editor,
            align,
            extensionName,
            attributeName,
            hideWhenUnavailable,
            onAligned,
        })

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event)
                if (event.defaultPrevented) return
                handleAlign()
            },
            [handleAlign, onClick],
        )

        if (!isVisible) {
            return null
        }

        return <ActionButton disabled={!canAlign} title={label} onClick={handleClick} {...props} ref={ref} />
    },
)

AlignButton.displayName = 'AlignButton'
