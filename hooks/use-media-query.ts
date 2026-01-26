import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
    const getMatches = (q: string): boolean => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(q).matches
        }
        return false // Default for SSR
    }

    const [matches, setMatches] = useState(() => getMatches(query))

    useEffect(() => {
        if (typeof window === 'undefined') return

        const media = window.matchMedia(query)

        setMatches(media.matches)

        const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
        media.addEventListener('change', handler)
        return () => media.removeEventListener('change', handler)
    }, [query])

    return matches
}
