import { Dirham } from './Icons.jsx'

/**
 * Renders a price string, swapping the `Ð` stand-in the content files use for
 * the real dirham mark. The symbol has no glyph in the site's font, so it has
 * to come in as an inline SVG rather than a character.
 *
 * Content keeps the `Ð` so the strings stay readable and greppable; only the
 * rendering changes.
 */
export default function Price({ children }) {
  if (typeof children !== 'string' || !children.includes('Ð')) return children

  /* split keeps the surrounding text, so "Starts @ Ð 149 Only" round-trips
     with the mark dropped in where the placeholder was. */
  const parts = children.split('Ð')

  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <Dirham />}
    </span>
  ))
}
