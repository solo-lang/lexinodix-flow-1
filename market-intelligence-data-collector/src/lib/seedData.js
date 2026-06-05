/**
 * Lexinodix Intelligence Engine - Market Collector
 * Demo seed data for local mode
 */

export const SEED_JOBS = [
  {
    title: 'Senior Data Analyst',
    company: 'Saudi Aramco',
    industry: 'Energy',
    location: 'Dhahran, Saudi Arabia',
    salary: 'SAR 25,000 - 35,000 / month',
    description: 'Lead data analysis initiatives across business units, develop dashboards and reporting infrastructure, support strategic decision-making with market intelligence.',
    responsibilities: 'Analyze large datasets from multiple sources\nDevelop KPI dashboards using BI tools\nPresent findings to senior management\nCollaborate with cross-functional teams',
    requirements: 'Bachelor in Data Science or related field\n5+ years experience in analytics\nProficiency in SQL, Python, Tableau\nExperience with energy sector data',
    source: 'LinkedIn',
    date_collected: '2024-01-15',
    original_url: 'https://linkedin.com/jobs/view/123456',
    raw_text: 'Senior Data Analyst - Saudi Aramco - Dhahran, KSA. Lead data analysis initiatives across business units.',
  },
  {
    title: 'Market Intelligence Manager',
    company: 'McKinsey & Company',
    industry: 'Consulting',
    location: 'Dubai, UAE',
    salary: 'AED 45,000 - 60,000 / month',
    description: 'Drive market intelligence function across MENA region. Collect, synthesize and present competitive insights to support client engagements.',
    responsibilities: 'Lead market research projects\nManage team of 5 analysts\nPresent to C-suite executives\nDevelop proprietary research frameworks',
    requirements: 'MBA or Master degree required\n8+ years consulting experience\nMENA market expertise\nFluency in English and Arabic',
    source: 'Company Website',
    date_collected: '2024-01-18',
    original_url: 'https://mckinsey.com/careers/search-jobs/123',
    raw_text: 'Market Intelligence Manager position at McKinsey & Company, Dubai UAE. Drive MI function across MENA.',
  },
  {
    title: 'Business Intelligence Developer',
    company: 'stc Group',
    industry: 'Telecommunications',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 18,000 - 28,000 / month',
    description: 'Develop and maintain BI solutions supporting business operations and strategic planning across STC Group entities.',
    responsibilities: 'Build Power BI dashboards\nDevelop ETL pipelines\nMaintain data warehouse\nSupport business units with ad-hoc analysis',
    requirements: '3+ years BI development experience\nExpert-level Power BI\nSQL and Python proficiency\nExperience with Azure data services',
    source: 'Bayt',
    date_collected: '2024-01-20',
    original_url: 'https://bayt.com/jobs/789',
    raw_text: 'BI Developer at stc Group. Riyadh, Saudi Arabia. Full-time position. Build and maintain BI solutions.',
  },
  {
    title: 'Financial Research Analyst',
    company: 'HSBC Saudi Arabia',
    industry: 'Finance',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 20,000 - 30,000 / month',
    description: 'Conduct in-depth financial research on MENA markets, produce research reports and investment recommendations.',
    responsibilities: 'Produce equity research reports\nModel financial forecasts\nTrack market developments\nBrief institutional investors',
    requirements: 'CFA Level 2 or above\nBachelor in Finance\n4+ years sell-side research experience\nFluent Arabic and English',
    source: 'Indeed',
    date_collected: '2024-01-22',
    original_url: 'https://indeed.com/viewjob?jk=abc123',
    raw_text: 'Financial Research Analyst at HSBC Saudi Arabia. Equity research focused role. Riyadh based.',
  },
];

export const SEED_COMPANIES = [
  {
    name: 'Saudi Aramco',
    industry: 'Energy',
    website: 'https://www.aramco.com',
    description: 'Saudi Aramco is one of the largest oil and gas companies in the world, headquartered in Dhahran, Saudi Arabia. It is the largest oil producer globally and holds the second-largest proven crude oil reserves.',
    services: 'Crude oil exploration and production, Refining, Chemicals, Distribution, Shipping, Pipeline operations',
    location: 'Dhahran, Eastern Province, Saudi Arabia',
    notes: 'Key employer for analytics and data science roles in the Eastern Province. Significant Vision 2030 investments in digital transformation.',
    source_url: 'https://www.aramco.com/en/careers',
    raw_text: 'Saudi Aramco - Worlds largest energy company. HQ Dhahran KSA. Listed on Tadawul stock exchange.',
  },
  {
    name: 'NEOM',
    industry: 'Real Estate',
    website: 'https://www.neom.com',
    description: 'NEOM is a USD 500 billion flagship project of Saudi Arabia Vision 2030, a planned smart city and special economic zone being built in northwestern Saudi Arabia in Tabuk Province.',
    services: 'Smart city development, Technology infrastructure, Tourism, Renewable energy, Advanced manufacturing',
    location: 'Tabuk Province, Saudi Arabia',
    notes: 'Massive hiring pipeline expected through 2030. Strong demand for tech, data, and sustainability roles. Key Vision 2030 indicator project.',
    source_url: 'https://www.neom.com/en-us/careers',
    raw_text: 'NEOM - The Line, Sindalah, Oxagon. USD 500bn investment. Smart city project. Tabuk KSA.',
  },
  {
    name: 'Accenture Middle East',
    industry: 'Consulting',
    website: 'https://www.accenture.com/ae-en',
    description: 'Accenture is a global professional services company with leading capabilities in digital, cloud, and security. In MENA, it has a strong presence in UAE, Saudi Arabia, and Egypt.',
    services: 'Strategy & Consulting, Technology, Operations, Industry X, Marketing (Song)',
    location: 'Dubai, UAE / Riyadh, Saudi Arabia',
    notes: 'Major growth in Saudi Arabia driven by Vision 2030 projects. Significant recruitment for Saudi nationals (Saudization). Key competitor to McKinsey in the region.',
    source_url: 'https://www.accenture.com/sa-en/careers',
    raw_text: 'Accenture Middle East - Dubai and Riyadh offices. Strategy & consulting services. 3,500+ employees MENA.',
  },
];

export const SEED_NEWS = [
  {
    headline: 'Saudi Arabia Labor Market Records Highest Employment Rate in a Decade',
    source: 'Arab News',
    date: '2024-01-15',
    summary: 'Saudi Arabia overall employment rate reached 60.4% in Q3 2023, with Saudi national employment rising to 50.1%, the highest in over 10 years, driven by Vision 2030 economic diversification efforts.',
    full_content: 'Saudi Arabia recorded its highest employment rate in over a decade as Vision 2030 economic diversification continues to bear fruit. The General Authority for Statistics reported an overall employment rate of 60.4% in Q3 2023. Saudi national employment grew to 50.1%, surpassing targets set under the National Transformation Program. The private sector accounted for 72% of the employment growth, with technology, tourism, and entertainment sectors leading job creation.',
    url: 'https://www.arabnews.com/node/2438231',
    industry: 'General',
    raw_text: 'Saudi Arabia Labor Market Q3 2023 Statistics GAS Report Employment Rate 60.4%. Vision 2030 employment targets exceeded.',
  },
  {
    headline: 'UAE Introduces New AI Strategy to Attract Global Talent',
    source: 'Gulf News',
    date: '2024-01-18',
    summary: 'The UAE government unveiled a comprehensive AI strategy aimed at attracting top global AI talent, with new visa categories and research grants worth AED 5 billion.',
    full_content: 'The United Arab Emirates has launched an ambitious AI talent attraction strategy, offering streamlined golden visa pathways for AI specialists, data scientists, and machine learning engineers. The AED 5 billion fund will support research at UAE universities and corporate R&D centers. The initiative targets making UAE a top-5 global AI hub by 2031.',
    url: 'https://www.gulfnews.com/uae/technology/uae-ai-strategy',
    industry: 'Technology',
    raw_text: 'UAE AI Strategy launch. Golden visa for AI professionals. AED 5bn fund announced. Ministry of AI statement January 2024.',
  },
  {
    headline: 'MENA Fintech Investment Reaches $1.2 Billion in 2023',
    source: 'Reuters',
    date: '2024-01-10',
    summary: 'Fintech investment across the MENA region reached a record $1.2 billion in 2023, with Saudi Arabia and UAE attracting 78% of total deal value, according to a new MAGNiTT report.',
    full_content: 'The MENA fintech sector attracted USD 1.2 billion in venture capital investment throughout 2023, marking a 34% increase from 2022. Saudi Arabia led with $680 million in deals, driven by government digital payment initiatives and Vision 2030 financial sector development goals. UAE followed with $256 million, while Egypt attracted $156 million. Payment infrastructure, lending platforms, and Islamic fintech were the top investment categories.',
    url: 'https://reuters.com/mena-fintech-2023',
    industry: 'Finance',
    raw_text: 'MENA Fintech Investment Report 2023 MAGNiTT. $1.2B total. KSA leads with $680M. UAE $256M. Egypt $156M.',
  },
];

export const SEED_NOTES = [
  {
    title: 'Vision 2030 Talent Demand Signals',
    category: 'Market Trend',
    observation: 'Saudi Vision 2030 is creating substantial demand across data science, digital transformation, tourism, and entertainment sectors.\n\nKey indicators:\n1. Government entities like NEOM, PIF, and Saudi Tourism are aggressively hiring internationally\n2. Saudization (Nitaqat) quotas are creating demand for Saudi nationals in tech roles\n3. Remote work policies are expanding the candidate pool internationally\n4. Salary benchmarks are rising 15-25% YoY for tech roles in KSA',
    tags: ['Vision 2030', 'Saudi Arabia', 'talent', 'digital transformation'],
    date: '2024-01-20',
    raw_text: 'Field observation from LinkedIn job postings analysis. 1,847 new tech roles posted in KSA in January 2024. Based on scraping 45 company career pages.',
  },
  {
    title: 'MENA Analytics Market Competitive Landscape',
    category: 'Competitive Intelligence',
    observation: 'The analytics and market intelligence consulting market in MENA is dominated by 4-5 global firms but has significant gaps in:\n\n- Arabic language capabilities\n- Sector-specific data (halal, Islamic finance, Vision 2030)\n- Real-time local market data\n- SME-targeted intelligence products\n\nOpportunity exists for specialized intelligence solutions tailored to Arabic-speaking decision makers.',
    tags: ['analytics', 'MENA', 'competition', 'opportunity', 'market gap'],
    date: '2024-01-22',
    raw_text: 'Competitive landscape analysis based on research across McKinsey, BCG, PwC, Deloitte ME presence. Desk research + 12 interviews with regional analysts.',
  },
];

export async function seedDemoData(dbs) {
  const { JobsDB, CompaniesDB, NewsDB, NotesDB } = dbs;

  // Check if already seeded
  const check = await JobsDB.select({ pageSize: 1, page: 0 });
  if ((check.total || 0) > 0) return false; // Already has data

  await Promise.all([
    JobsDB.bulkInsert(SEED_JOBS),
    CompaniesDB.bulkInsert(SEED_COMPANIES),
    NewsDB.bulkInsert(SEED_NEWS),
    NotesDB.bulkInsert(SEED_NOTES),
  ]);

  return true;
}
