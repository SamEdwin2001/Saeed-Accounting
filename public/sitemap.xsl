<?xml version="1.0" encoding="UTF-8"?>
<!--
  Presentation layer for sitemap.xml.

  Browsers apply this when a human opens the sitemap; crawlers ignore it and
  read the underlying XML, so the file stays a valid sitemap either way.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>XML Sitemap — Saeed Accounting</title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #ffffff;
            --fg: #1f2937;
            --muted: #6b7280;
            --line: #e5e7eb;
            --stripe: #f9fafb;
            --brand: #f2701f;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #111827;
              --fg: #e5e7eb;
              --muted: #9ca3af;
              --line: #374151;
              --stripe: #1f2937;
            }
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            padding: 2rem 1.25rem 4rem;
            background: var(--bg);
            color: var(--fg);
            font: 15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif;
          }

          .wrap { max-width: 1040px; margin: 0 auto; }

          h1 {
            margin: 0 0 .35rem;
            font-size: 1.6rem;
            letter-spacing: -.01em;
          }

          .lede { margin: 0 0 1.75rem; color: var(--muted); }
          .lede a { color: var(--brand); }

          .count {
            display: inline-block;
            background: var(--brand);
            color: #fff;
            font-size: .8rem;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 20px;
            margin-left: .5rem;
            vertical-align: 2px;
          }

          /* The table is the widest thing on the page — let it scroll inside
             its own box so the body never scrolls sideways on a phone. */
          .scroll { overflow-x: auto; }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: .92rem;
          }

          th, td {
            text-align: left;
            padding: 11px 14px;
            border-bottom: 1px solid var(--line);
            white-space: nowrap;
          }

          th {
            font-size: .74rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .06em;
            color: var(--muted);
            border-bottom-width: 2px;
          }

          td.url { white-space: normal; word-break: break-word; }
          tbody tr:nth-child(odd) { background: var(--stripe); }
          a { color: var(--brand); text-decoration: none; }
          a:hover { text-decoration: underline; }

          @media (max-width: 620px) {
            body { padding: 1.25rem .9rem 3rem; }
            h1 { font-size: 1.3rem; }
            th, td { padding: 9px 10px; }
          }
        </style>
      </head>

      <body>
        <div class="wrap">
          <h1>
            XML Sitemap
            <span class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span>
          </h1>

          <p class="lede">
            This sitemap lists every public page on
            <a href="https://saeedaccounting.com/">saeedaccounting.com</a> for search
            engines. It is generated automatically at build time.
          </p>

          <div class="scroll">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Priority</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="url">
                      <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                    </td>
                    <td><xsl:value-of select="s:priority"/></td>
                    <td><xsl:value-of select="s:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
