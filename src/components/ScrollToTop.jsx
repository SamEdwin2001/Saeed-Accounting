import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router preserves scroll position across navigations, so without this
 * you land halfway down a freshly-opened page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
