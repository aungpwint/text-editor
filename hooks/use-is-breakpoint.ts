'use client'

import { useMediaQuery } from './use-media-query'

type BreakpointMode = 'min' | 'max'

/**
 * Hook to detect whether the current viewport matches a given breakpoint rule.
 *
 * Examples:
 *   useIsBreakpoint('max', 768)   // true when width < 768
 *   useIsBreakpoint('min', 1024)  // true when width >= 1024
 */
export function useIsBreakpoint(mode: BreakpointMode = 'max', breakpoint = 768): boolean {
    const query = mode === 'min' ? `(min-width: ${breakpoint}px)` : `(max-width: ${breakpoint - 1}px)`
    return useMediaQuery(query)
}
