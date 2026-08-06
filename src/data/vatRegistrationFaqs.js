/**
 * FAQ list for /vat-registration-services.
 *
 * Its own module so App can build the page's FAQPage schema from it without
 * statically importing VatRegistrationPage, which is lazy-loaded — a static
 * import there would pull the whole page into the main bundle.
 */
export const VAT_REGISTRATION_FAQS = [
  {
    q: 'Who needs to register for VAT in the UAE?',
    a: 'UAE businesses must register for VAT once taxable supplies and imports exceed AED 375,000 in the past 12 months (or expected in the next 30 days). Voluntary registration is available above AED 187,500. Non-resident businesses must register regardless of turnover.',
  },
  {
    q: 'What is the VAT registration threshold in the UAE for 2026?',
    a: "The mandatory VAT registration threshold is AED 375,000 and the voluntary threshold is AED 187,500, both measured on taxable supplies and imports (including zero-rated supplies, which do count toward the threshold even though they're taxed at 0%).",
  },
  {
    q: 'How long does VAT registration take in the UAE?',
    a: "Straightforward VAT registration applications through the FTA's EmaraTax portal are typically approved within 5–20 business days. Applications missing documents or triggering an FTA query for clarification can take 3–4 weeks, so submitting a complete, consistent document set upfront is the biggest factor in speed.",
  },
  {
    q: "What happens if I don't register for VAT on time?",
    a: 'Missing the 30-day registration deadline after crossing the AED 375,000 threshold triggers a flat AED 10,000 late-registration penalty, and the business becomes retroactively liable for VAT on every taxable supply made from the date it should have registered — not just from the date it actually registers.',
  },
  {
    q: 'What documents are required for VAT registration in the UAE?',
    a: 'Standard requirements include the trade license, Emirates ID and passport copies of the owner(s)/authorized signatory, Memorandum of Association (MOA), proof of business address, bank account details, and financial records supporting the turnover figure (invoices, contracts, or bank statements showing taxable supplies). Free zone and group VAT applications require additional supporting documents.',
  },
  {
    q: 'Can a small business or freelancer register for VAT voluntarily?',
    a: 'Yes. Any UAE business — including freelancers and startups — with taxable supplies, imports, or expenses above AED 187,500 can opt into voluntary VAT registration. This is common for early-stage businesses with high startup costs, since it allows them to reclaim input VAT on expenses like rent, equipment, and professional fees before they hit the mandatory threshold.',
  },
  {
    q: 'How often do I need to file VAT returns after registering?',
    a: 'Most VAT-registered businesses file quarterly, with the return due within 28 days of the end of the tax period. Businesses with annual turnover above AED 150 million are required to file monthly instead. The FTA assigns your filing frequency at the point of registration.',
  },
  {
    q: 'Can I deregister from VAT if my turnover drops?',
    a: 'Yes — a business must apply for VAT deregistration within 20 business days of ceasing taxable supplies, or if turnover falls below the AED 187,500 voluntary threshold for 12 consecutive months. All outstanding returns must be filed and tax settled before the FTA approves deregistration. Missing the deregistration deadline carries a penalty of AED 1,000, rising by AED 1,000 per month to a cap of AED 10,000.',
  },
  {
    q: 'Do I need a local tax agent to register for VAT in the UAE?',
    a: "It isn't legally mandatory — you can register directly through EmaraTax — but an FTA-registered tax agent reduces the risk of rejected applications, incorrect threshold calculations, and missed retroactive liabilities, and can represent you in FTA correspondence or audits.",
  },
  {
    q: 'What is EmaraTax and do I need an account to register?',
    a: "EmaraTax is the FTA's official online portal for all UAE tax registration, filing, and payment — VAT registration in the UAE is only done through EmaraTax; there is no manual or paper-based route. You'll need to create an EmaraTax account before submitting a VAT registration application.",
  },
  {
    q: 'How to register for VAT online in the UAE?',
    a: 'To register for VAT online in the UAE, businesses need to create an account on the FTA portal and upload necessary documents such as a trade license, Emirates ID, and financial records.',
  },
  {
    q: 'What is a VAT registration number and why is it important?',
    a: "A VAT registration number (or TRN) is a unique Tax Registration Number issued by the FTA once your registration is approved. It's essential for invoicing, filing returns, and staying compliant with FTA regulations.",
  },
  {
    q: 'What is the difference between VAT registration and tax registration in the UAE?',
    a: 'VAT registration specifically relates to value-added tax, whereas tax registration in the UAE could refer to various taxes, such as corporate or excise tax.',
  },
  {
    q: 'What are the benefits of VAT registration?',
    a: 'By registering for VAT, you can issue tax invoices and collect 5% VAT from clients, plus reclaim VAT paid on purchases and expenses when filing VAT returns.',
  },
]
