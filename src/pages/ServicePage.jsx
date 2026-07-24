import PageBanner from '../components/PageBanner.jsx'
import Seo from '../components/Seo.jsx'
import Img from '../components/Img.jsx'
import Tabs from '../components/Tabs.jsx'
import Accordion from '../components/Accordion.jsx'
import { Check } from '../components/Icons.jsx'

/**
 * A content block is one of:
 *   'text'                  → paragraph
 *   { heading }             → sub-heading
 *   { list: [...] }         → bulleted list
 *   { image, caption }      → inline figure
 */
function Block({ block }) {
  if (typeof block === 'string') return <p className="page__text">{block}</p>

  if (block.list) {
    return (
      <ul className="page__list">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.image) {
    return (
      <figure className="page__inline-figure">
        <Img src={block.image} alt={block.caption || ''} label="Image" />
        {block.caption && <figcaption className="page__caption">{block.caption}</figcaption>}
      </figure>
    )
  }

  // A full-width orange section heading in the middle of an article.
  if (block.bigHeading) {
    return (
      <h2 className="page__title page__title--left page__title--upper">
        <span className="accent">{block.bigHeading}</span>
      </h2>
    )
  }

  return <h3 className="page__heading">{block.heading}</h3>
}

export { Accented }

/**
 * Colours the first occurrence of `accent` inside `text` orange. It need not
 * be a prefix — several headings accent a middle word ("Corporate TAX Filing").
 * Must match the source casing; any uppercasing is done in CSS.
 */
function Accented({ text, accent }) {
  if (!accent) return text
  const at = text.indexOf(accent)
  if (at === -1) return text

  return (
    <>
      {text.slice(0, at)}
      <span className="accent">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  )
}

/** Section heading — centred by default, optionally two-tone, upper, left. */
function SplitHeading({ text, accent, upper, left }) {
  if (!text) return null
  return (
    <h2
      className={`page__title ${upper ? 'page__title--upper' : ''} ${
        left ? 'page__title--left' : ''
      }`}
    >
      <Accented text={text} accent={accent} />
    </h2>
  )
}

/**
 * Template for all 17 service pages. Content comes from src/data/services.js.
 * Almost every field is optional, because the live pages are inconsistent.
 * The layout degrades: without `introImage` the intro runs full width, and a
 * page ends with tabs, a check-list, or a plain bullet list depending on which
 * of `tabs` / `listImage` / `listItems` it supplies.
 */
/**
 * First real sentence of the page's own copy, trimmed to a sensible meta
 * length. `intro`/`body` entries are either a string (paragraph) or an object
 * (inline heading / list / image), so only strings are usable here.
 */
function metaDescription({ lead, intro = [], body = [], title }) {
  const source =
    lead || [...intro, ...body].find((b) => typeof b === 'string' && b.length > 40)

  if (!source) return `${title} in the UAE from Saeed Accounting.`
  return source.length > 158 ? `${source.slice(0, 155).trimEnd()}…` : source
}

export default function ServicePage({ service }) {
  const {
    title,
    heading,
    headingAccent,
    headingUpper,
    headingLeft,
    lead,
    subheading,
    subheadingAccent,
    intro = [],
    introChecks,
    introImage,
    introImageSide = 'right',
    introImageRatio,
    imageCaption,
    body = [],
    listHeading,
    listHeadingAccent,
    listHeadingUpper,
    listIntro,
    listImage,
    listImageRatio,
    listItems = [],
    tabs,
    tabsUpper,
    faqs,
    faqHeading,
    faqHeadingAccent,
  } = service

  const hasIntroCol = intro.length > 0 || subheading || introChecks
  const imageFirst = introImageSide === 'left'

  const media = introImage && (
    <figure
      className="page__media"
      style={{ '--ratio': introImageRatio || (imageFirst ? '7 / 5' : '9 / 10') }}
    >
      <Img src={introImage} alt={imageCaption || title} label="Service image" />
      {imageCaption && <figcaption className="page__caption">{imageCaption}</figcaption>}
    </figure>
  )

  const copy = hasIntroCol && (
    <div className="page__col">
      {subheading && (
        <h3 className="page__subheading">
          <Accented text={subheading} accent={subheadingAccent} />
        </h3>
      )}
      {intro.map((block, i) => (
        <Block block={block} key={`intro-${i}`} />
      ))}

      {introChecks && (
        <ul className="check-list">
          {introChecks.map((item) => (
            <li key={item}>
              <Check className="check-list__icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <>
      <Seo title={title} description={metaDescription(service)} />
      <PageBanner title={title} />

      <article className="page">
        <div className="container">
          <SplitHeading
            text={heading || title}
            accent={headingAccent}
            upper={headingUpper}
            left={headingLeft}
          />

          {lead && <p className="page__lead page__lead--left">{lead}</p>}

          <div className={`page__split ${introImage ? '' : 'page__split--single'}`}>
            {imageFirst ? media : copy}
            {imageFirst ? copy : media}
          </div>

          {/* Body runs the full width, as on the live site */}
          {body.map((block, i) => (
            <Block block={block} key={`body-${i}`} />
          ))}
        </div>
      </article>

      {(tabs || listItems.length > 0) && (
        <section className="page-list">
          <div className="container">
            <SplitHeading
              text={listHeading}
              accent={listHeadingAccent}
              upper={listHeadingUpper}
            />
            {listIntro && <p className="page__lead">{listIntro}</p>}

            {tabs ? (
              <Tabs tabs={tabs} upper={tabsUpper} />
            ) : (
              <div className={`page__split ${listImage ? '' : 'page__split--single'}`}>
                {listImage && (
                  <figure className="page__media" style={{ '--ratio': listImageRatio || '7 / 6' }}>
                    <Img src={listImage} alt={listHeading} label="Service image" />
                  </figure>
                )}

                <ul className="check-list">
                  {listItems.map((item) => (
                    <li key={item}>
                      <Check className="check-list__icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {faqs && (
        <section className="section section--tight">
          <div className="container">
            <SplitHeading text={faqHeading} accent={faqHeadingAccent} />
            <Accordion items={faqs} />
          </div>
        </section>
      )}
    </>
  )
}
