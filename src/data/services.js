/**
 * Content for all 17 service pages, scraped from saeedaccounting.com.
 *
 * Shape — every field but `slug` and `title` is optional, because the live
 * pages are inconsistent (some have no subheading, no image, or no list):
 *
 *   slug         URL path, no slashes. Must match src/data/nav.js.
 *   title        H1 and breadcrumb label.
 *   subheading   Intro heading above the first paragraph.
 *   intro        Blocks before the diagram.
 *   imageCaption Diagram caption; omit for no diagram.
 *   body         Blocks after the diagram.
 *   listHeading  Heading above the bullet list.
 *   listItems    Bullet list.
 *
 * `intro` and `body` entries are either a plain string (a paragraph) or
 * `{ heading: '...' }` (an inline sub-heading). Several live pages run
 * sub-headings inline with their prose; this keeps them styled correctly.
 *
 * NOTE: this is the live site's copy, reproduced as-is. See README notes —
 * some of it references other firms and mentions the US IRS.
 */
export const SERVICES = [
  /* ---------------------------------------------------------- Accounting */
  {
    slug: 'accounts-receivable-services',
    title: 'Accounts receivable services',
    // Leading words of the centred heading render orange.
    titleAccent: 'Accounts receivable',
    introImage: '/images/services/accounts-receivable-1.jpg',
    listImage: '/images/services/accounts-receivable-2.jpg',
    // Must match the source casing of `listHeading`; CSS does the uppercasing.
    listHeadingAccent: 'Our Accounts Receivable Services',
    listHeadingUpper: true,
    listIntro: 'Account Receivable Services that EAS offers include:',
    subheading: 'Leading Accounts Receivable Outsourcing Firm in Dubai and UAE',
    intro: [
      'Proper management of cash flow is essential to all kinds of businesses. One of the most essential activities in the process is accounts receivable management. Accounts receivable services are where customers owe the company money from the sales of goods or services.',
      'This is the income that a company makes, which enables it to cater for expenses. As such, their management is essential and a must.',
      'Accounts receivable services may seem easy for many, but it can be complicated as it involves a lot of invoicing and sharing credit to customers. Given the scope of a business, terms of agreements, and the number of clients, it is vital to have a system that manages outstanding funds.',
    ],
    body: [
      'Accounts receivable management services provide monitor invoices, reduces collection times, track process times, increase timely payment rates, and more to improve the process.',
      'Excellence Accounting Services provides account receivable outsourcing services to companies all over UAE, to ease the accounts receivable management services. Partnering with EAS can help your company access manpower and tools to assist in the collection of outstanding payments.',
      'We not only provide top-notch quality account receivable services, but also offer lockbox services, cash applications, and access to accounting reports. EAS also sends out weekly summaries of our follow up with customers, including metrics and analysis regarding outstanding debt.',
    ],
    listHeading: 'Our Accounts Receivable Services in Dubai and UAE',
    listItems: [
      'Real estate accounts receivable services.',
      'Accounts receivable factoring services.',
      'Accounts receivable aging report Creation.',
      'Preparation of billings and mailing after customer approval.',
      'Feeding transactions into the accounting software.',
      'Preparation and delivery of periodic statements.',
      'Providing credit memos and refund customer approved checks.',
      'Conducting process modifications approved by customers.',
      'Place cash received to the accounts of the customer and handling short pays.',
    ],
  },
  {
    slug: 'accounts-payable-services',
    title: 'Accounts payable Services',
    // This page promotes its subheading to the centred heading, so there is
    // no separate `subheading` in the intro column.
    heading: 'Customized Accounts Payable Services in Dubai and UAE',
    headingAccent: 'Customized Accounts Payable',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785148321/Voluntary-VAT-Registration-The-Advantages-and-Disadvantages_aymfa0.webp',
    introImageSide: 'left',
    listHeadingAccent: 'Our Accounts Payable Services',
    listHeadingUpper: true,
    listIntro: 'EAS provides a comprehensive range of accounts payable services including the following:',
    intro: [
      'The primary goal of every business is to make profits and cut costs as much as possible. The last thing any entrepreneur would want to do is to make even the slightest mistake that would jeopardize the success of the business.',
      "That being said, it's not easy to manage your business and accounts payable at the same time- it is a tiresome job. You will have to hire a full-time employee to handle the accounts, and this in turn, may compromise your cost-saving plans.",
      'However, you can save yourself from all the account trouble by outsourcing account payable services. A proper accounts payable service can help your business manage cash flow and capital the right way.',
    ],
    // These two run full width beneath the image/copy split, as on the live page.
    body: [
      "You will also be able to establish great relationships with your business partners, consequently doing better cost-saving, and increase business agility. What's more, you will remain compliant with government policies and regulations.",
      "We do the same thing at saeedaccounting. We manage your entire accounts payable department so that you don't have to think about entering financial information manually and then tracking data- we handle all the stress for",
    ],
    listHeading: 'Our Accounts Payable Services Services in Dubai and UAE',
    // This page ends in a tab strip rather than a check-list.
    tabs: [
      {
        label: 'Matching Invoices with Purchase Orders',
        text: 'Our professionals handle things such as comparing and linking supplier invoice to data upon which the total cost is based.',
      },
      {
        label: 'Processing Purchase Orders',
        text: 'We process purchase orders. EAS experts create, approve order, dispatch, invoice, deliver and close orders. We include budget and quality checks',
      },
      {
        label: 'Processing Debit Memos',
        text: 'EAS also processes debit memos, get rid of billing blocks, perform system integration and execute billing for our clients',
      },
      {
        label: 'Processing Standard Pricing Information',
        text: 'Our accounts payable service Dubai and UAE pros can help with standard pricing data processing for any of your accounting and business needs.',
      },
    ],
  },
  {
    slug: 'accounting-bookkeeping',
    title: 'Accounting & Bookkeeping',
    heading: 'Services Dubai and UAE',
    headingAccent: 'Services',
    headingUpper: true,
    introImage: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785148512/ab_hkjywu.webp',
    introImageRatio: '7 / 5',
    listHeadingAccent: 'Our Accounting and Bookkeeping Services',
    listHeadingUpper: true,
    listIntro:
      'Excellence Accounting Services focuses on the following aspects of accounting and bookkeeping:',
    intro: [
      "Today's business environment is extremely challenging. As such, managers become distracted from handling their key objectives in a world where work is done where it can be handled most effectively and efficiently.",
      'Excellence Accounting Services takes away the grunt work and allows you to focus on the strategic role. By leveraging our expertise and talent, you can take advantage of our services into a fully-staffed, full-time accounting and bookkeeping Dubai and UAE team that is always there when you are.',
      'We ensure to take accounting out of the way of your success. This comes with innumerable benefits and deducts all the mundane work eating up your gold time which you can now spare to think of different ways to grow your business.',
    ],
    body: [
      'EAS provides inclusive accounting and bookkeeping outsource services for SMEs and corporations allowing senior management and owners sufficient time to channel their energy on business growth. We provide access to world-class accounting & bookkeeping services at a cost-effective rate.',
      'Our clients save a lot of money, as well as soft costs like spending the shortest time possible on accounting & bookkeeping.',
    ],
    listHeading: 'Our Accounting and Bookkeeping Services Dubai and UAE',
    tabs: [
      {
        label: 'Accounting Software',
        text: 'We can help you choose the ideal accounting software package and guide you on keeping your records and books, setup suppliers, reconcile banks, customers, and so on.',
      },
      {
        label: 'Accounting Software Integration',
        text: 'Our specialists use the till system, online payment systems. We review VAT on transaction transfers accurately to the accounts program and rectify VAT.',
      },
      {
        label: 'Record Keeping',
        text: 'EAS can manage your data entry, raise sales invoices, review statements of accounts and handle purchase accounts.',
      },
      {
        label: 'Reconciliations',
        text: 'We help to reconcile credit cards, PayPal, Credit Cards, and other key accounts of your business.',
      },
      {
        label: 'Correct Asset Register',
        text: 'Our bookkeeping and accounting specialists will maintain an asset register on behalf of the client.',
      },
      {
        label: 'Basic Reports Preparation',
        text: 'We prepare different reports to help companies manage their business efficiently. From Aged Debtor, Profit and Loss, and Credit Reports tailored to the business needs.',
      },
    ],
  },
  {
    slug: 'cfo-services',
    title: 'CFO Services',
    heading: 'Outsourced CFO Services – Premier Services for Companies',
    headingAccent: 'Outsourced CFO Services –',
    headingUpper: true,
    subheading: 'Across Dubai And UAE',
    subheadingAccent: 'Across Dubai',
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785148800/WhatsApp-Image-2022-09-16-at-3.22.20-PM-rhpdihuendka805lz9jd43espplosg0j74q3wfz568_iclemy.webp',
    introImageRatio: '9 / 10',
    /* Same artwork as the intro image — the page shows it twice. */
    listImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785148955/cfo_fyyvnm.webp',
    listImageRatio: '1 / 1',
    listHeadingAccent: 'Our Outsourced CFO',
    listHeadingUpper: true,
    listIntro:
      'We provide CFO services that can really help your company grow. Our CFO experts offer the following:',
    // The live page runs these two paragraphs together and breaks mid-sentence
    // into the full-width block below; reproduced as-is.
    intro: [
      'Successful CFOs are supposed to work together with businesses and help them make informed decisions. This affects the business directly. So, whether you are looking for an interim CFO Service or an Outsourced CFO Service to provide advisory services, you need a reliable partner. Excellence Accounting Services can provide leadership and the right steps to yield the positive results you desire.It is imperative for a CFO to study the goal of a business first before providing any insights on money management. CFO services in Dubai, UAE will suggest viable strategies to make the firm more profitable after analyzing all angles. For instance, a business owner who wants to attract sponsors will require a different strategy from a company that wants to expand its product range.in Dubai and across UAE are',
    ],
    body: [
      'provided by financial experts who have knowledge of the local market and best practices. Because we are approved specialists, we have the know-how of handling the complex needs of our clients.',
    ],
    listHeading: 'Our Outsourced CFO Services in Dubai and UAE',
    listItems: [
      'Formulating business strategy/policy and action plans.',
      'Guidance and monitoring accounting dept as and when required.',
      'Guidance for setting up of internal control processes.',
      'Guidance for drafting and implementing SOP.',
      'Provide regular business advice to the CEO/owners as needed.',
      'Liaison with banks and other financial institutions.',
      'MIS report preparation and analysis of financial data',
      'Cash flow and working capital management.',
      'Review of contract with customers, suppliers and more.',
      'Guidance related to UAE tax issues.',
      'Support for cost analysis in project accounting and construction contracts.',
      "Provide support for the preparation of annual budgets and it's a review regularly.",
      'Support for pre-costing and post costing analysis.',
    ],
  },

  /* ------------------------------------------------------------ VAT / TAX */
  {
    slug: 'vat-registration-services',
    title: 'FTA VAT Registration UAE',
    subheading: 'Limited Offer Running Starts @ 149',
    body: [
      { heading: 'Eligibility Criteria and Necessary Documents for VAT Registration UAE' },
      { heading: 'Voluntary VAT Registration' },
      'In the UAE, businesses are eligible for VAT registration if they have a business location in the UAE and have made taxable supplies worth over AED 187,500 to member states in the past year. Additionally, companies can apply for VAT registration online if they expect their supply value to exceed the voluntary registration threshold of AED 187,500 within the upcoming 30 days.',
      { heading: 'Mandatory VAT Registration' },
      'Businesses are obligated to register for VAT in the UAE if they have a business location within a UAE emirate and have provided goods worth over AED 375,000 to member states in the last 12 months.',
    ],
    listHeading: 'Required Documents To Register For It',
    listItems: [
      'Trade license',
      'MOA or AOA (If Sole establishment not required)',
      'Passport copy of the signatory',
      'Emirates ID of the signatory',
      'Visa Copy of the Signatory (not necessary)',
      'Invoices',
      'Bank Details (Account no/IBAN/Name/Address) (not necessary)',
      'Email Id',
      'Mobile No',
      'Office Address with PO BOX',
    ],
  },
  {
    slug: 'vat-return-filling',
    title: 'VAT Return Filling',
    heading: 'VAT Return Filling Services in Dubai and UAE',
    headingAccent: 'VAT Return Filling Services',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785150811/VAT-Return-Filing-Services-In-Oman_hb4hbi.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'Get Expert Assistance from Trusted Outsourced VAT Return Filing Professionals',
      'The UAE government requires all businesses to file VAT returns. It is a directive that companies must comply with. The VAT tax is an official tax document that is submitted to the Federal Tax Authority. The UAE taxation law requires VAT returns to be filed quarterly.',
      'Typically, the tax document contains information on tax recoverable input and tax due output, as well as the net VAT applicable. The taxable individual or a person elected by the taxable party may file VAT returns.',
      'In other words, corporation tax return specialists or legal agents can file VAT returns on behalf of the taxable party.',
    ],
    body: [
      'And because the law allows individuals and companies to hire Dubai vat filing agents, it is vital to work with VAT return services at reasonable rates and has the knowledge and expertise to manage VAT return filing based on UAE VAT laws.',
    ],
  },
  {
    slug: 'vat-de-registration',
    title: 'VAT-De-Registration',
    subheading: 'WHAT IS VAT DE-REGISTRATION',
    intro: [
      'VAT deregistration in UAE allows a taxable person or a business to cancel their VAT registration and suspend their Tax Registration Number (TRN). FTA VAT Deregistration is an online process.',
      'Only the businesses and individuals who are registered under Federal Tax Authority (FTA) can de-register from VAT. THE late VAT Deregistration penalty will be AED 10,000.',
    ],
    body: [
      'A registrant must apply for VAT deregistration within 20 business days from the occurrence of the above-mentioned events. Registrants can easily apply for VAT deregistration by accessing their FTA portals. IMPORTANT: Please note, if the date of submission of this de-registration form is more than 20 business days from the date the Taxable Person is required to de-register then you will be subject to a late de-registration penalty of AED 10,000. Companies that are getting closed must have a company liquidation letter from the government authorities to apply for VAT Deregistration.',
    ],
    listHeading: 'How to apply for FTA VAT De-registration UAE?',
    listItems: [
      'Sign in to your FTA VAT portal.',
      "On the dashboard, against the VAT registration, click on the 'De-Register' button.",
      'Taxable Person Details are pre-populated in the de-registration application',
      'Reasons for VAT de-registration. Select from the drop-down list that on what basis you are de-registering for VAT. Business no longer making taxable supplies Business making taxable supplies, but below the Voluntary Threshold Business making taxable supplies, above the Voluntary Threshold, but below the Mandatory Threshold Other – please specify the reason',
      'Effective date from which the Taxable Person is required or eligible to de-register depends based on the de-registration',
      "Upload all the relevant supporting documents by clicking on 'Choose Files'.",
      'Review and confirm the authorized signatory and declaration section of the application form before submission.',
    ],
  },
  {
    slug: 'vat-audit',
    title: 'VAT Audit',
    heading: 'VAT Audit',
    headingAccent: 'VAT',
    headingUpper: true,
    // No intro image; the whole article runs full width.
    body: [
      { heading: 'What is VAT Audit?' },
      "A VAT audit is a process of investigating the financial data & records of taxpayers in the UAE. With a VAT audit, the Federal Tax Authority (FTA) determines the accuracy of the taxpayer's VAT liability. After that, it also monitors whether the taxpayer complies with the relevant UAE VAT laws or not.",
      { heading: 'Why is VAT audit essential?' },
      "A Vat refund Dubai is essential to understand compliance with the UAE VAT laws. You will understand your internal tax procedures related to UAE's VAT law. The first step is to identify the areas of non-compliance and rectify them within the framework of UAE laws. Therefore, you must be adequately prepared to assess your compliance before the FTA conducts a VAT audit",
      { heading: 'FTA tax audit process' },
      'Before the VAT audit, FTA sends a notification to taxpayers at least five days in advance. Taxpayers must keep all VAT returns documents as well as other supporting evidence. Moreover, the employees responsible for accounting and taxation records must also be present to facilitate the audit process. These records include:',
      {
        list: [
          'Supply invoices as well as receipts',
          'Tax invoices from suppliers and related documents',
          'Tax credit notes',
          'Documents showing the proof of imports and exports',
          'Customs declarations',
          'Non-deducted input tax records',
        ],
      },
      'Tax auditors need all these documents for assessment. They keep an eye on all the discrepancies in payments, receipts, as well as documentation of all VAT-specific transactions. Therefore, any suspicious information or missing data is listed and rechecked for irregularities.',
      // The live page repeats this heading verbatim.
      { heading: 'FTA tax audit process' },
      'We have been a leading provider of VAT audit services since its implementation. With a dedicated team of tax experts & diverse experience of over 35 years, we have the right resources & expertise to provide outstanding VAT audit services in the Emirates.',
      "Along with coordinating with Tax Authorities throughout the audit, we provide the tax auditors with the relevant documents, records, data, and information about finances, stock inventory, & assets for a detailed examination. NR Doshi's VAT experts prepare a VAT audit checklist to ensure a proper review following the UAE VAT law. Lastly, we have successfully represented the client from various industry verticals, thereby complying with FTA's rules.",
    ],
  },
  {
    slug: 'vat-refund',
    title: 'VAT Refund',
    heading: 'VAT Refund',
    headingAccent: 'VAT',
    headingUpper: true,
    introImage: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785151044/VAT-REFUND_kytk3q.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'What is the VAT Return: The official document to be completed by the Taxable Person and submitted to the Federal Tax Authority ("FTA") at regular intervals detailing any output tax due and input tax recoverable and including any other information that is required to be provided. In this guide, we will refer to it as the "VAT return". All VAT Returns should be submitted online using the FTA portal. The return can be submitted by the Taxable Person, or another person who has the right to do so on the Taxable Person\'s behalf (for example, a Tax Agent or a Legal Representative).',
    ],
    body: [
      { heading: 'Tax Period' },
      'A Tax Period is a specific period of time for which the Payable Tax shall be calculated and paid. The standard Tax Period applicable to a Taxable Person shall be a period of three calendar months ending on the date that the FTA determines. The FTA may, at its discretion, assign a different Tax Period, other than the standard one, to a certain group of Taxable Persons (e.g. in some cases businesses may be required to file vat filing Dubai on a monthly basis). Where a Taxable Person is assigned the standard Tax Period, he may request that the Tax Period ends with the month as requested by him, and the FTA may accept such a request at its discretion.',
      'know here Vat return filing date in UAE, The VAT Return must be received by the FTA no later than the 28th day following the end of the Tax Period concerned or by such other date as directed by the FTA. Where a payment is due to the FTA, it must be received by the FTA by the same deadline.',
      { heading: 'Understanding tax liability' },
      "Below are some key terms with respect to the operation of VAT, and how these could impact a Taxable Person's tax liability.",
      {
        image:
          'https://res.cloudinary.com/dekhukonj/image/upload/v1785151246/vat_consultant_in_dubai_cmd22f.webp',
        caption: 'VAT Return Filing in UAE',
      },
      { heading: 'Output Tax' },
      '"Output tax" is the VAT a Taxable Person calculates and charges on its supplies of goods and services once it is registered for VAT. Output tax must generally be calculated on supplies made to other persons; however, in certain situations VAT might be required to be charged on supplies which were deemed to occur for VAT purposes or on supplies which are subject to the reverse charge provisions. The obligation to account for output tax arises at the tax point of the supply, i.e. at the date of supply. Once the date of the supply has taken place, the Taxable Person must account for the output tax in the VAT Return covering that Tax Period',
      { heading: 'Input Tax' },
      'From the recipient\'s point of view, "input tax" is the VAT added to the price by the supplier when the recipient purchases goods or services which are subject to VAT. If the recipient is registered for VAT then they may be able to recover this input tax from the FTA, subject to the conditions below: the Taxable Person has received and retained a tax invoice or other documentation evidencing the amount of VAT on the supply or import; and the amount of VAT has been paid, or is intended to be paid, in whole or in part (in which case the amount of input tax recoverable shall be limited to the equivalent amount). Once the ability to recover input tax has been confirmed, the person is able to include the amount in the relevant VAT Return as an input tax deduction.',
      { heading: 'Calculating tax liability' },
      "A registered person's tax liability is simply the difference between the output tax payable for a given Tax Period and the input tax which is recoverable for the same Tax Period. Where the output tax exceeds the input tax amount, a payment of the difference must be made to the FTA. Where the amount of input tax exceeds the amount of output tax, a Taxable Person is entitled to a refund of VAT from the FTA.",
      { heading: 'Filing VAT Returns' },
      'For each Tax Period, a Taxable Person will be required to submit a VAT Return which contains details regarding the supplies made or received by the Taxable Person. With respect to sales and other outputs, the Taxable Person will need to report: 1. supplies of goods and services made which are subject to the standard rate of VAT per Emirate; 2. tax refunds you have provided to tourists under the Tax Refunds for Tourists Scheme, if you are a retailer and provide tax refunds to tourists in the UAE under the official tourists refund scheme; 3. supplies of goods and services received by the Taxable Person which are subject to the reverse charge provisions; 4. supplies of goods and services made which are subject to the zero rate of VAT; 5. supplies made which are exempt from VAT; 6. goods imported into the UAE and have been declared through UAE customs; and 7. where applicable, adjustments to goods imported into the UAE and which have been declared through UAE Customs.',
      'With respect to purchases and other inputs, the Taxable Person should report: 1. purchases and expenses that were subject to the standard rate of VAT and for which you would like to recover VAT; and 2. any supplies which were subject to the reverse charge for which you would like to recover input tax. The amounts of VAT charged and input tax recoverable by the Taxable Person would then need to be netted off in the Tax Return. The resulting amount is the net VAT payable to, or to be refunded by, the FTA (i.e. the net VAT position).',
      'At Saeed Accounting, we are certified tax consultants committed to delivering precise, reliable, and innovative solutions for VAT and tax compliance in Dubai. Our experienced team empowers businesses to navigate challenges and seize opportunities with confidence.',
    ],
  },
  {
    slug: 'vat-amendment',
    title: 'VAT Amendment',
    heading: 'VAT Amendment',
    headingAccent: 'VAT',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785152176/VAT-AMENDMENT_kdgoxt.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'What is the VAT Return: The official document to be completed by the Taxable Person and submitted to the Federal Tax Authority ("FTA") at regular intervals detailing any output tax due and input tax recoverable and including any other information that is required to be provided. In this guide, we will refer to it as the "VAT return". All VAT Returns should be submitted online using the FTA portal. The return can be submitted by the Taxable Person, or another person who has the right to do so on the Taxable Person\'s behalf (for example, a Tax Agent or a Legal Representative).',
    ],
    body: [
      { heading: 'Common Reasons for VAT Amendments:' },
      {
        list: [
          'Incorrect figures in VAT returns',
          'Missed transactions or invoices',
          'Changes in business details',
          'Adjustments due to updated regulations',
        ],
      },
      { heading: 'How We Can Help:' },
      {
        list: [
          'Review and identify errors in submitted returns',
          'Provide guidance on the amendment process',
          'Liaise with tax authorities on your behalf',
          'Ensure timely and accurate updates',
        ],
      },
      { heading: 'VAT Amendment: What You Need to Know' },
      { heading: '1. What is a VAT Amendment?' },
      "A VAT amendment refers to the process of correcting errors or updating information in a previously submitted VAT return. Whether it's adjusting figures, updating sales or purchases, or correcting input tax claims, businesses may need to amend their VAT returns from time to time.",
      { heading: '2. When Should You Amend Your VAT Return?' },
      'You should amend your VAT return if you discover:',
      {
        list: [
          'Misreported sales or purchases.',
          'Incorrectly claimed input tax.',
          'Missed or duplicated transactions.',
        ],
      },
      "Generally, amendments can be made within a specified time window (usually 4 years), but it's crucial to check local tax authority guidelines.",
      { heading: '3. How to Amend Your VAT Return?' },
      'The amendment process may vary depending on the jurisdiction. Typically, you would:',
      {
        list: [
          "Access your VAT portal or tax authority's platform.",
          'Select the relevant VAT period.',
          'Update the figures or information that needs correction.',
          'Submit the revised return or file an adjustment form.',
        ],
      },
      { heading: '4. Penalties and Interest' },
      "Failing to amend a VAT return or declaring incorrect information can lead to penalties and interest charges. It's advisable to correct errors as soon as they're detected to avoid penalties.",
      { heading: '5. Professional Assistance' },
      "If you're unsure about the amendment process or have complex VAT situations, seeking professional advice can help ensure compliance and accuracy.",
    ],
  },

  /* -------------------------------------------------------- Corporate Tax */
  {
    slug: 'corporate-tax-registration',
    title: 'Corporate Tax Registration',
    intro: [
      'Our corporate tax registration services ensure full compliance with the latest regulations while streamlining the process for maximum efficiency.',
    ],
    body: [
      'We take care of all your tax filings whether it is a simple W-2 or complex multi-state filings. You can simply drop off or email us your tax documents and we will notify you when they are ready.',
    ],
    listHeading: 'Document Requirements for UAE Corporate Tax Registration?',
    listItems: [
      'Trade license',
      'MOA or AOA (If Sole establishment not required)',
      'Passport copy of the signatory',
      'Emirates ID of the signatory',
      'Visa Copy of the Signatory (not necessary)',
      'Bank Details (Account no/IBAN/Name/Address) (not necessary)',
      'Mobile No',
      'Email Id',
      'Office Address with PO Box.',
    ],
  },
  {
    slug: 'corporate-tax-filing',
    title: 'Corporate Tax Filing',
    subheading:
      'Our corporate tax filing services ensure complete compliance with the latest regulations while maximizing efficiency',
    intro: [
      'Corporate tax filing is the process through which businesses report their taxable income, deductions, and liabilities to the tax authorities',
    ],
    body: [
      { heading: 'Key Guidelines for Corporate Tax Compliance in UAE' },
      'Mandatory Corporate Tax Returns: Filing is required for all companies operating in the UAE.',
      'Governing Body: The Federal Tax Authority (FTA) oversees tax compliance',
      'Tax on Taxable Income: Companies must pay taxes based on their taxable income as per UAE tax laws',
      'Tax Rate for Small Businesses: Businesses with income less than AED 375,000 are subject to a 0% tax rate.',
    ],
    listHeading: 'Corporate TAX Filing Requirements',
    listItems: [
      'Company KYC details',
      'Financial Statement',
      'Income Statement (Profit and Loss Statement)',
      'Balance Sheet',
      'Cash Flow Statement',
      'Tax Returns',
      'Taxable Income Calculation',
      'Depreciation Schedules',
      'Bank Statements',
      'Receipts and Invoices',
      'Payroll Records',
    ],
  },
  {
    slug: 'corporate-tax-implementation',
    title: 'Corporate Tax Implementation',
    heading: 'Corporate Tax Implementation',
    headingAccent: 'Corporate Tax',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785152438/Implementation_ujnal7.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'Legal entities that have a permanent establishment in the UAE, are incorporated in the UAE, and are effectively managed and controlled in the UAE are all subject to UAE CT (see "Foreign persons" and "Who is considered resident for UAE CT purposes?"). Only individuals who directly, through an unincorporated partnership, or as a sole proprietor, engage in business or other operations in the UAE will be subject to CT. A Cabinet Decision with greater information on what would and would not be covered by UAE CT will be made public when the time is appropriate.',
    ],
    body: [
      { heading: 'Are UAE legal entities owned by UAE or GCC citizens subject to the UAE CT?' },
      'yes. The UAE CT is a federal tax, so it applies to all emirates.',
      { heading: 'Do I have to pay UAE CT along with emirate level taxes?' },
      'No, CT and VAT are two different types of taxes. Both still apply in the UAE.',
      { heading: 'Will the UAE CT replace the UAE excise tax?' },
      'yes. The relevant Emirati and Commonwealth Governments will continue to receive payments for applicable service fees.',
    ],
  },
  {
    slug: 'corporate-tax-advisory',
    title: 'Corporate Tax Advisory',
    heading: 'Corporate Tax Advisory Services',
    headingAccent: 'Corporate Tax',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785155094/Voluntary-VAT-Registration-The-Advantages-and-Disadvantages_1_qy0ead.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      "A competitive CT regime based on global best practices is expected to strengthen the UAE's position as a top business and investment hub and accelerate the country's growth and transformation to achieve its strategic goals. . The UAE's commitment to uphold international standards of tax transparency and to prevent unfair tax practices is also reaffirmed by the implementation of the CT regime.",
      'While conventional tax compliance consists of federal, kingdom, and nearby tax education, tax advisory offerings move past the tax go back and into the sector of tax method and optimization.',
    ],
    body: [
      'From reading monetary records to imparting forward-searching guidance, tax advisors assist their customers apprehend the influences in their monetary choices and provide recommendation on the way to maximize their tax position, all even as contemplating enterprise or private monetary goals.',
      { heading: 'When will the UAE CT regime come into effect?' },
      'The UAE CT regulations will come into force for financial years beginning after 1 June 2023. Example: If the fiscal year is from his 01.07.2023 to 30.06.2024, the company will be subject to UAE CT from his 01.07.2023. is the start date of the first fiscal year beginning after June 1, 2023). From 1 January 2024, companies with financial years from 1 January 2023 to 31 December 2023 are subject to the UAE CT (this is the first the beginning of the fiscal year).',
      { heading: 'What is the role of the Ministry of Finance?' },
      'For the purposes of bilateral/multilateral tax agreements and international exchange of information for tax purposes, the Ministry of Finance remains the "competent authority". The Ministry of Finance may issue additional guidelines and implementing regulations regarding the UAE CT and other federal taxes.',
      { heading: 'What should I do to prepare for the UAE CT?' },
      "To assess what the UAE CT system means for your business, you should take the following as a starting point: Use the information available to determine if and when your company is subject to the UAE CT. Understand business requirements under corporate tax law. For example, whether your business needs to be registered with the UAE CT. What is your business's accounting/tax period? By when your business needs to file a UAE CT return. What elections or applications can or should your business make for the purposes of the UAE CT? How UAE CT affects your business obligations and responsibilities under contracts with customers and suppliers. Financial information and records you must retain for UAE CT purposes. Please check the Ministry of Finance and Federal Tax Administration websites regularly for more information and guidance on the UAE CT regime.",
      { heading: 'Types of tax advisory services offerings include:' },
      { list: [
      'Guidance on federal, kingdom, and man or woman profits tax returns',
      'Advice on federal and kingdom company tax returns',
      'Understanding the tax results of obtaining or divesting enterprise assets',
      'Restructuring or reorganizing agencies and partnerships',
      'Estate making plans, together with education of wills and trusts',
      'Federal, kingdom, and nearby man or woman and/or company tax making plans',
      'Understanding the tax implications of actual property transactions',
      'Personal monetary making plans',
      'Income tax making plans for executives, together with worker reimbursement and gain plans',
      'Investment making plans',
      'Understanding the tax implications of present and charitable contributions',
      'Understanding the tax effect of profits and deductions, contributions, essential purchases and investments',
      'Tax perception into university saving programs',
      'Retirement making plans programs',
      'Representing customers in tax negotiations and disputes with the IRS',
      'Representing customers in IRS, kingdom, or nearby audits',
      'Property tax assessments',
      'Succession making plans',
      'Tax recommendation to executors and trustees',
      'Tax credit score evaluations to decide most allowable credits (e.g., studies and improvement credits)',
      'Trade and customs tax offerings and guidance',
      'Transfer pricing evaluation, documentation, and amendment of present policies',
      'Tax valuation offerings',
      ] },
    ],
  },

  /* ----------------------------------------------------- Support Services */
  {
    slug: 'business-formation',
    title: 'Business Formation',
    heading: 'Company Registration in Dubai - An Overview',
    headingAccent: 'Company Registration in Dubai',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785155793/RERA-certified-local-sponsor_a2ge6n.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'Dubai is one of the largest cities in the Middle East, having a multitude of opportunities to allow foreign investors to set up different forms of companies. This city has expanded its opportunities to ensure that there is constant development of trade and business in the arena. Apart from this, the Middle East is one of the largest oil exporters in the world.',
      'Dubai has accelerated the pace of its diversification and sustainable economic growth. The city issued 45,653 new business licences in the first half of the year 2022, which is significantly higher than the licenses issued in the first half of the previous year (2021), i.e. 36,647, which shows 25 % growth in the company registration. The main reason for the growth is the business-friendly government policies and programmes, tax regimes, and infrastructure to name a few.',
      'From the above discussion it is evident that Dubai is an excellent place to start a business, and registering a company in this city can be quite beneficial for the business',
    ],
    body: [
      { heading: 'Main Regulatory Authority for Company Registration in Dubai' },
      'The main regulatory authority for company formation in Dubai is the Registrar of Companies it acts as a unified authority for carrying out different forms of compliance and registrations related to companies.',
      { heading: 'Jurisdiction of Company Registration in Dubai' },
      'The following areas can be chosen for company registration in Dubai.',
      { heading: 'Mainland' },
      'This jurisdiction is most suitable for investments as the investors can reach out to multicultural audiences and expand their reach to the local markets of UAE, which can be quite beneficial for a company registered in this jurisdiction of Dubai. Here, the company can be registered as 100% expatriate-owned entities.',
      { heading: 'Free Zone' },
      'Registration of a company in this zone is comparatively easier than the company registration in the mainland. The advantages of incorporating a company in this zone are the exemption from VAT along with 100% transfer of profits, exemption from filing audit reports, and 100% ownership, etc.',
      { heading: 'Offshore Jurisdiction' },
      'Offshore jurisdiction refers to the area outside the boundaries of the particular region. Here the company is registered in Dubai, but the base of the company is situated outside the boundaries of Dubai. The main objective of company registration in this jurisdiction is the coordination of international trade.',
      { heading: 'Types of Company Structures Utilised in Dubai' },
      'The following structures would be utilized for company registration in Dubai.',
      { heading: 'Limited Liability Company' },
      'Here, the liability of the shareholders is limited to the amount of their shares. This type of company can be registered in the mainland jurisdiction and provides 100% expatriate ownership.',
      { heading: 'Professional Company' },
      'This type of company is usually formed by the professionals such as lawyers, Chartered Accountants, doctors etc. The company can be registered with the Department of Economic Development of the respective Emirate of Dubai.',
      { heading: 'Branch Office' },
      'Usually, this form of company is formed outside Dubai. However, the office is opened in Dubai to carry out operations. It is just an extension of its parent company and does not exist as a separate legal entity.',
      { heading: 'Joint Stock Companies' },
      'A joint stock company is a type of company which is collectively owned by its shareholders There are two types of Joint Stock Companies, i.e. Public and Private. Here the liability of the partners is only limited to their share in the company.',
      { heading: 'Benefits of Company Registration in Dubai' },
      'Following are the benefits of company registration in Dubai.',
      { heading: 'Regulatory Environment' },
      'The courts in Dubai follow the common law system. However, precedents from court cases are handled by lawyers in Dubai with US and UK legal qualifications. In Dubai there is a unique way of regulation.',
      { heading: '100% Foreign Ownership' },
      'A company registered in Dubai can avail the benefit of 100% Foreign Ownership. Hence a foreign investor or shareholder can have 100 % equity ownership of the company, which makes Dubai an ideal place to start a business.',
      { heading: 'Ease of Compliance' },
      'Compliance is easier in Dubai as compared to other cities, the reason for this being the relaxed business laws and authorities approach to promote business and trade in the region.',
      { heading: 'Tax Benefit' },
      'The value-added tax is charged at the rate of 5% on the amount of goods and services which are provided in Dubai. There is no form of individual income tax levied on the employees working in Dubai.',
      { heading: 'Developing Financial and Services Sector' },
      'Dubai has been an upcoming hub of the international financial and services sector, where the government of Dubai has been diversifying its economy into a major international financial and service sector.',
      { heading: 'Developed Infrastructure' },
      "Dubai is the third largest re-exporter in the world, the reason for which can be derived from the level of infrastructure the city has maintained. Dubai's infrastructure is world-class which makes it a preferable option for investors worldwide.",
      { heading: 'Procedure for Company Registration in Dubai' },
      'An applicant opting for company registration in Dubai has to follow the below-prescribed procedure',
      { heading: 'Filing Application for Name Reservation' },
      "The next step is reserving the company's name with the Department of Economic Development. The name reservation can be made by filing an application and paying the requisite fees for a name reservation.",
      { heading: 'Preparation and Notarization of Documents' },
      'Further, the applicant needs to draft the memorandum of association and articles of association along with a lease agreement of the company, followed by the notarization of the same.',
      { heading: 'Submission and Verification of Documents' },
      'After the notarization of the documents, the applicant is required to submit the documents to the Department of Economic Development and Dubai Commercial for verification.',
      { heading: 'Grant of Incorporation Certificate' },
      'The authority grants the certificate of incorporation after the verification of the application and documents submitted by the applicant.',
      { heading: 'Filing an Application for Obtaining Business License' },
      'The applicant must file an application for obtaining the business licence as per the requirement of the business operations of the company.',
      { heading: 'Appointment of Managerial Personal' },
      'The applicant must file an application for obtaining the business licence as per the requirement of the business operations of the company.',
      { heading: 'Opening a Bank Account' },
      'After completing the above-mentioned formalities, the business owner needs to open a Bank Account in the name of the business.',
      { heading: 'Eligibility Criteria for Company Registration in Dubai' },
      'The applicant should have all the necessary licenses before initiating the company registration process in Dubai. The indicative list of required licenses is as follows.',
      {
        list: [
          'Commercial licences covering all kinds of trading activity;',
          'Professional licences covering professions, services, craftsmen and artisans;',
          'Industrial licences for establishing industrial or manufacturing.',
        ],
      },
      'Usually, an individual would enter into some form of profit-sharing arrangement with the local profits and agree on some sharing ratio which has to be decided by the parties.',
    ],
    faqHeading: 'Frequently Asked Questions',
    faqHeadingAccent: 'Asked',
    faqs: [
      {
        q: 'What are the benefits of company registration in Dubai?',
        a: 'Some of the benefits of company registration in Dubai are: No Income tax levied on professionals, Great Talent pool, Diverse Location, One of the Largest Financial Centres in the world.',
      },
      {
        q: 'What are the types of companies in Dubai?',
        a: 'An applicant can go for the following types of companies: Company which is limited by shares, Limited Liability Company, Branch office, Limited Liability Partnership, Professional Companies, Joint Stock Companies',
      },
      {
        q: 'What is DIFC?',
        a: 'DIFC stands for Dubai International Financial Centre, is one of the financial centres started in Dubai to carry out activities.',
      },
      {
        q: 'Do I require a sponsor for the process of company registration in Dubai?',
        a: 'No, the requirement of a local sponsor is not mandatory for the process of company registration in Dubai.',
      },
      {
        q: 'Is it only the public joint stock companies that can invest funds on behalf of a third party?',
        a: 'No, this requirement has been abolished as per the new amendment.',
      },
      {
        q: 'Which authority is responsible for granting the Trade licence in Dubai?',
        a: 'The Trade / Business license is provided by the Department of Economic Development (DED)',
      },
      {
        q: 'Is there a need to pay taxes in Dubai?',
        a: "The taxes in Dubai are quite negligible. Most companies registered in Dubai don't need to pay taxes except for some companies that are required to pay a 5 % tax based on the business activity.",
      },
    ],
    listHeading: 'Documents required for Company Registration in Dubai',
    listHeadingAccent: 'Documents required',
    listHeadingUpper: true,
    listItems: [
      'Application form of the Business',
      'MOA and AOA which are duly notarised by the authority',
      'Passports copy of the Managers of the Business.',
      'Passport copy of the Sponsor to prove that the sponsor is a UAE National',
      'NOC from the Sponsor',
      'Bank Reference Letter for Each Shareholder',
      'Copy of the Feasibility Study',
      'Existing Company Profile',
      'Information related to the Investor',
      'Attested Copy related to the Certificate of Incorporation, MOA and AOA',
      'Board Resolution of the Company',
      'Three months bank statement related to the parent company',
      'Passport Copy And',
      'Original Power of Attorney',
    ],
  },
  {
    slug: 'local-sponsor',
    title: 'Local Sponsor',
    heading: 'Local sponsor in Dubai Everything you need to know',
    headingAccent: 'Local sponsor in Dubai',
    headingUpper: true,
    introImage:
      'https://res.cloudinary.com/dekhukonj/image/upload/v1785214527/RERA-certified-local-sponsor_1_wyuopb.webp',
    introImageSide: 'left',
    introImageRatio: '3 / 2',
    intro: [
      'There was a time when any non-GCC national wishing to start a business in the Dubai mainland would require the services of a local sponsor. However, things have changed in recent years meaning that 100% foreign ownership of UAE mainland business is permitted in many cases.',
      'That said, this is not possible in all industries. And even in those where it is allowed, permission is required – and it can be denied.',
      "The good news is, if you do require a local sponsor, with the right help, finding one can be fast and straightforward. In this article, we'll explore the key factors you need to consider along the way,",
    ],
    body: [
      { heading: 'Local sponsor in Dubai – what does it mean?' },
      'A local sponsor is appointed by an overseas investor to hold a 51% stake in a UAE business. While the sponsor holds a controlling stake, they have no decision making power and do not interfere with day-to-day operations.',
      'They also do not take 51% of the profits. Instead, sponsors are paid an annual fee for their services. Sponsors can be individuals or corporate entities.',
      { heading: 'Finding a local sponsor in Dubai' },
      'Finding and appointing a local sponsor should not be taken lightly, as you will need a strong and trusting relationship with your sponsor.',
      { heading: 'Types of local sponsors' },
      'There are three sponsor categories: individuals (UAE citizens over 21), corporate entities (government-licensed businesses), and local service agents for professional services businesses.',
      { heading: 'Duties of a local sponsor' },
      'The primary duty of a local sponsor is to act as your representative in all dealings with government and official bodies.',
      { heading: 'How to change local sponsor in Dubai' },
      'The process involves notifying your current sponsor, gathering documentation, and attending court to dissolve the sponsorship.',
      { heading: 'Getting a Dubai trade license without a local sponsor' },
      'Alternatives include professional services businesses, mainland businesses outside regulated industries, or setting up in a free zone.',
    ],
    listHeading: 'Do I need a local sponsor in Dubai?',
    listHeadingAccent: 'Do I need a local sponsor',
    listHeadingUpper: true,
    listIntro:
      'If you are setting up in Dubai or any other part of the UAE mainland in the following industries, you will require a local sponsor',
    listImage: '/images/services/local-sponsor-2.jpg',
    listImageRatio: '1 / 1',
    listItems: [
      'Oil exploration and production',
      'Security and military services',
      'Banking, financing and insurance activities',
      'Pilgrimage and Umrah services',
      'Water and electricity provision',
      'Fishing and related services',
      'Post and telecoms services',
      'Road and air transport',
      'Printing and publishing',
      'Commercial agency',
      'Medical retail (including pharmacies)',
    ],
  },
  {
    slug: 'pro-services',
    title: 'Pro Services',
    heading: 'Outsourcing Corporate PRO Services in Dubai, Abu Dhabi and rest of the UAE',
    headingAccent: 'Outsourcing Corporate PRO Services',
    headingUpper: true,
    headingLeft: true,
    lead: "By outsourcing your company's Corporate PRO services in Dubai, Abu Dhabi, Sharjah, and the rest of the UAE, you avail the following benefits",
    introImage: '/images/services/pro-services-1.jpg',
    introImageSide: 'left',
    introImageRatio: '11 / 9',
    // The benefits render as an orange check-list beside the image.
    introChecks: [
      'Knowledgeable Partner',
      'Reduce your exposure to risk',
      'Save Time and Money',
      'Increase data security and protection',
      'Dedicated Accounts Manager',
      'Reduce Costs of Running/operating a department',
      'Bank account setup',
      'CRM Managed',
      'No More Fines or Delays',
      'Focus on your core business',
      '100% transparency',
      'Access to up to date legal regulatory requirements and',
    ],
    body: [
      { bigHeading: 'Our responsibility as a Corporate PRO Services provider' },
      'We understand the market and keep ourselves updated on the ever-changing process and information for setting up and running a business. Additionally, it is our responsibility to provide accurate and up-to-date information to our clients based on their needs. Hence, we develop a completely tailored solution for all government pro services in Abu Dhabi, Dubai, Sharjah, and other parts of the UAE. Our goal is to manage the requirements of our clients while ensuring complete compliance, information, and transparency on all outsourced pro services provided.',
      "Our clients can not only save time and money but also avail free Corporate Sponsorship and Service agent services when outsourcing their Corporate PRO services in Abu Dhabi, Dubai, Sharjah, and the rest of UAE. We design our tailored packages to remove day-to-day complexities and delays linked to the government process for your companies. As one of the professional pro companies in Dubai, we ensure to review our client's corporate structure. Likewise, we provide our clients with corporate sponsorship and corporate service agent services. Coupled with, ensuring our clients are up to date with all local requirements linked to their company and employees. Outsourcing your Corporate PRO services in UAE to professional PRO companies in Dubai, Abu Dhabi, Sharjah helps in reducing risks, saving money, reduces fines, delays, and time. Let us provide you with total peace of mind so that you can focus on your core business.",
    ],
    tabsUpper: true,
    tabs: [
      {
        label: 'How do we design our Corporate PRO services?',
        paragraphs: [
          'Unlike general PRO companies in Dubai, Abu Dhabi, Sharjah, we design our PRO services contracts based on the following criteria;',
          'Number of trade licenses',
          'Jurisdiction of the trade licenses',
          'The complexity of the activity on the trade license and compliance linked to the regulatory bodies',
          'The number of visas held under each trade license',
          'Any additional special services required by a company',
          'Owing to which, each PRO Services contract allows easy growth and flexibility. While, maintaining a competitive and cost-effective edge as an outsource partner',
        ],
      },
      {
        label: 'Seasoned team of experts at your service',
        // Only the opening sentence of each paragraph could be extracted —
        // the source blocked full reproduction. See README note.
        paragraphs: [
          'As a professional pro service provider in UAE, we at ACT PRO and Business Services LLC are a team of disciplined industry experts.',
          'All in all, our trained staff have in-depth knowledge about the legalities of any company setup and formation.',
          'More than their skills, they are trustworthy and professional in all their dealings.',
        ],
      },
      {
        label: 'Services included in our Corporate PRO services package',
        items: [
          'Renewal of trade license',
          'Offer Letters',
          'Regulatory body support and liaison services',
          'New employment visa process',
          'Company immigration card renewal',
          'Renewal of employment visas',
          'Company Establishment card update',
          'Cancellation of employment visas',
          'Quota applications and modifications',
          'Medical typing and applications',
          'Labour card updates',
          'New emirates ID processing',
          'Labour card renewals',
          'Renewal of emirates ID',
          'Visa alters and weekly updates',
          'Labour and Immigration support services',
          'PO Box renewals',
          'Additional services tailored fort the client',
        ],
      },
    ],
  },
]
