import { useState } from 'react'

const placeholder = (label) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
       <rect width="100%" height="100%" fill="#dcdcdc"/>
       <text x="50%" y="50%" font-family="Poppins,Arial,sans-serif" font-size="30"
             fill="#8d8d8d" text-anchor="middle" dominant-baseline="middle">${label}</text>
     </svg>`
  )

/**
 * Drop-in <img> that falls back to a neutral grey placeholder of the
 * identical box size when the real asset is missing.
 *
 * `alt` has no default: a decorative image must opt in with alt="" explicitly,
 * so omitting it stays visible to a11y linters instead of silently shipping a
 * content image no screen reader can describe.
 */
export default function Img({ src, alt, label = 'Replace image', ...rest }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? placeholder(label) : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
