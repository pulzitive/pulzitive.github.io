import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Play,
  Pause,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Briefcase,
  Layers,
  Award,
  Terminal,
  Settings,
  Sliders,
  Check,
  Building2,
  MapPin,
  DollarSign,
  Share2,
  Trash2,
  Eye,
  SlidersHorizontal,
  ChevronUp,
  Zap,
  Globe,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export interface JobApplication {
  id: string;
  source: 'LinkedIn' | 'Indeed';
  company: string;
  companyLogo?: string;
  title: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid';
  salaryRange: string;
  job_url: string;
  date_discovered: string;
  ats_match_score: number;
  status: 'Queued' | 'Parsing Job' | 'Generating Assets' | 'Submitted' | 'Failed / Review';
  target_jd: {
    overview: string;
    responsibilities: string[];
    required_skills: string[];
    nice_to_have: string[];
    salary_notes: string;
  };
  generated_resume: string;
  generated_cover_letter: string;
  timestamp: string;
  matched_keywords: string[];
  missing_keywords: string[];
}

export interface UserMasterProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  portfolio_url: string;
  linkedin_url: string;
  summary: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    period: string;
    achievements: string[];
  }[];
  education: string;
  target_roles: string[];
  min_compensation_usd: number;
  excluded_companies: string[];
  target_timezones: string[];
}

const INITIAL_MASTER_PROFILE: UserMasterProfile = {
  name: 'Alex Rivera',
  title: 'Senior Digital Growth & Product Marketer',
  email: 'alex.rivera@pulzitive.com',
  phone: '+1 (555) 234-5678',
  location: 'Remote (EST / GMT / WAT)',
  portfolio_url: 'https://pulzitive.com/profile/alex-rivera',
  linkedin_url: 'https://linkedin.com/in/alex-rivera-growth',
  summary: 'Results-driven Senior Growth Marketer with 7+ years scaling B2B SaaS and high-performance digital platforms. Proven record boosting ARR by $4.2M, optimizing full-funnel CAC by 38%, and managing multi-channel acquisition budgets exceeding $1.5M/yr.',
  skills: [
    'Performance Marketing (Meta/Google Ads)',
    'Conversion Rate Optimization (CRO)',
    'Data Analytics & SQL (Looker/GA4)',
    'Product-Led Growth (PLG)',
    'B2B SaaS Lifecycle Funnels',
    'AI-Assisted Workflow Automation',
    'A/B Experimentation Frameworks',
    'Technical SEO & Content Ops'
  ],
  experience: [
    {
      role: 'Head of Growth Marketing',
      company: 'OmniVibe Cloud SaaS',
      period: '2023 - Present',
      achievements: [
        'Scaled self-serve signups by 142% via paid social and automated product onboarding email cadences.',
        'Decreased blended customer acquisition cost (CAC) from $210 to $130 while increasing 90-day retention by 24%.',
        'Implemented attribution telemetry pipelines tracking multi-touch touchpoints across $120k/mo spend.'
      ]
    },
    {
      role: 'Senior Digital Marketing Lead',
      company: 'Apex Digital Solutions',
      period: '2020 - 2023',
      achievements: [
        'Managed cross-functional team of 6 copywriters and media buyers driving $8.5M in client sales pipeline.',
        'Engineered high-converting landing pages achieving average conversion benchmark of 7.8% (industry avg: 2.3%).'
      ]
    }
  ],
  education: 'B.Sc. in Business Information Systems & Marketing • Certified Google & HubSpot Growth Specialist',
  target_roles: ['Senior Growth Marketer', 'Product Marketing Lead', 'Head of Digital Acquisition', 'B2B SaaS Marketer'],
  min_compensation_usd: 95000,
  excluded_companies: ['RevShareOnly Inc', 'Unverified Temp Staffing'],
  target_timezones: ['US (EST/CST/PST)', 'Europe (GMT/CET)', 'Africa (WAT)']
};

const INITIAL_JOBS: JobApplication[] = [
  {
    id: 'app_001',
    source: 'LinkedIn',
    company: 'CloudScale Technologies',
    title: 'Senior Product Growth Lead (Remote)',
    location: 'San Francisco, CA (100% Remote)',
    workplaceType: 'Remote',
    salaryRange: '$120,000 - $145,000 / yr',
    job_url: 'https://linkedin.com/jobs/view/senior-growth-lead-cloudscale',
    date_discovered: '12 mins ago',
    ats_match_score: 94,
    status: 'Submitted',
    matched_keywords: ['B2B SaaS', 'CRO', 'Product-Led Growth', 'Looker', 'A/B Testing', 'Funnel Optimization'],
    missing_keywords: ['Mixpanel Cohorts'],
    target_jd: {
      overview: 'CloudScale is seeking a seasoned Senior Product Growth Lead to orchestrate self-serve product adoption, paid performance campaigns, and retention loops for our enterprise cloud suite.',
      responsibilities: [
        'Spearhead end-to-end user acquisition across paid and organic digital channels.',
        'Partner with product engineering to build high-velocity A/B testing onboarding funnels.',
        'Analyze conversion drop-offs and optimize monetization touchpoints.'
      ],
      required_skills: ['5+ years B2B SaaS growth experience', 'Demonstrated mastery in PLG and CRO', 'Expertise in SQL/Looker and GA4 telemetry'],
      nice_to_have: ['Experience with Developer tooling or Cloud API products'],
      salary_notes: 'Competitive equity package + $135k base target.'
    },
    generated_resume: `# ALEX RIVERA
**Senior Growth & Product Marketing Lead**
Remote • alex.rivera@pulzitive.com • +1 (555) 234-5678 • linkedin.com/in/alex-rivera-growth

---

### PROFESSIONAL SUMMARY
High-impact Senior Growth Lead with 7+ years specializing in B2B SaaS user acquisition, product-led growth (PLG) architecture, and full-funnel conversion rate optimization. Proven track record executing data-driven experiments that scaled ARR by $4.2M while reducing CAC by 38%.

---

### CORE COMPETENCIES & ATS KEYWORDS
* **Growth Marketing & Strategy**: Product-Led Growth (PLG), B2B SaaS Lifecycle, Go-To-Market Execution.
* **Analytics & Data Telemetry**: Looker, Google Analytics 4, SQL Data Modeling, Multi-Touch Attribution.
* **Experimentation & CRO**: A/B Multivariate Testing, Onboarding Funnel Optimization, Retention Loops.
* **Media & Channel Execution**: Meta Ads, Google Search/Performance Max, LinkedIn B2B Paid Acquisition.

---

### PROFESSIONAL WORK EXPERIENCE

#### OmniVibe Cloud SaaS — Head of Growth Marketing
*2023 – Present | Remote*
* Architected end-to-end B2B SaaS onboarding funnels that accelerated self-serve trial-to-paid conversions by +142%.
* Orchestrated $120k/month multi-channel budget with strict ROAS thresholds, driving $3.8M in pipeline ARR.
* Integrated Looker and GA4 event tracking schemas to eliminate user drop-off across complex activation milestones.

#### Apex Digital Solutions — Senior Digital Marketing Lead
*2020 – 2023 | Remote*
* Led acquisition for 14 enterprise clients, managing $1.5M annual spend with an average 4.1x return on ad spend.
* Developed high-converting landing page frameworks that increased baseline client conversion rates from 2.1% to 7.8%.

---

### EDUCATION & CREDENTIALS
* **B.Sc. in Business Information Systems & Marketing**
* Certified Google Analytics Power User • HubSpot Inbound Growth Accredited`,
    generated_cover_letter: `Dear Hiring Team at CloudScale Technologies,

I am writing to express my strong interest in the Senior Product Growth Lead role. Having spent the last 7 years architecting product-led growth loops and scaling B2B SaaS platforms to multi-million dollar ARR milestones, I was energized by CloudScale's mission to redefine developer and enterprise cloud infrastructure.

At OmniVibe, I oversaw self-serve growth funnels that increased product trial-to-paid conversion by 142% while systematically reducing blended customer acquisition costs by 38%. My approach marries quantitative rigor (Looker telemetry, SQL funnel modeling, and statistical A/B testing) with rapid marketing execution across paid social, search, and lifecycle automation.

CloudScale’s goal of unlocking frictionless user onboarding and expanding enterprise ARR aligns directly with my core playbook. I would welcome the opportunity to discuss how my hands-on growth experimentation framework can accelerate CloudScale's adoption targets this quarter.

Thank you for your time and consideration.

Sincerely,
Alex Rivera`,
    timestamp: '2026-08-23T11:05:00Z'
  },
  {
    id: 'app_002',
    source: 'Indeed',
    company: 'FinPulse Systems',
    title: 'Lead Digital Marketing Strategist',
    location: 'New York, NY (Remote EMEA/US)',
    workplaceType: 'Remote',
    salaryRange: '$110,000 - $130,000 / yr',
    job_url: 'https://indeed.com/viewjob?jk=finpulse-lead-marketer',
    date_discovered: '28 mins ago',
    ats_match_score: 91,
    status: 'Submitted',
    matched_keywords: ['B2B SaaS', 'Performance Marketing', 'CRO', 'Data Analytics', 'SEO', 'Email Cadences'],
    missing_keywords: ['Salesforce Pardot'],
    target_jd: {
      overview: 'FinPulse Systems is hiring a Lead Digital Marketing Strategist to own customer acquisition, inbound pipeline development, and partner channels for our fintech platform.',
      responsibilities: [
        'Lead direct response digital campaigns across Google, LinkedIn, and programmatic channels.',
        'Optimize marketing automation workflows to nurture MQLs into qualified pipeline opportunities.',
        'Establish weekly performance dashboards tracking CAC, LTV, and payback velocity.'
      ],
      required_skills: ['5+ years digital marketing leadership', 'Proven fintech or SaaS background', 'Strong analytical mindset with proficiency in BI tools'],
      nice_to_have: ['Experience with SOC2 financial compliance marketing'],
      salary_notes: 'Full health, 401(k) matching, and remote home office stipend.'
    },
    generated_resume: `# ALEX RIVERA
**Lead Digital Marketing Strategist & Growth Architect**
Remote • alex.rivera@pulzitive.com • +1 (555) 234-5678

---

### EXECUTIVE SUMMARY
Lead Digital Marketing Strategist with extensive experience scaling B2B SaaS and FinTech pipelines. Proven expertise in multi-channel paid acquisition, marketing automation funnels, and data attribution frameworks that deliver measurable ROI.

---

### CORE EXPERTISE
* B2B Demand Generation & Pipeline Strategy
* Performance Marketing (Google Search, Meta, LinkedIn)
* Full-Funnel Conversion Optimization (CRO)
* Lifecycle Automation & Inbound Nurturing
* Financial & Marketing Telemetry (SQL, Looker, GA4)

---

### PROFESSIONAL EXPERIENCE
**OmniVibe Cloud SaaS** | Head of Growth Marketing (2023 - Present)
* Accelerated qualified pipeline creation by 115% through high-intent paid search and automated email nurture flows.
* Decreased overall customer acquisition cost by 38% through rigorous weekly creative and audience iteration.

**Apex Digital Solutions** | Senior Digital Marketing Lead (2020 - 2023)
* Managed $1.5M digital ad budgets, achieving 4.1x average ROAS across high-ticket financial and tech accounts.`,
    generated_cover_letter: `Dear FinPulse Hiring Committee,

I am thrilled to submit my application for the Lead Digital Marketing Strategist role at FinPulse Systems. With a deep foundation in high-velocity customer acquisition and financial telemetry, I have consistently scaled enterprise pipelines while maintaining disciplined unit economics.

In my recent work, I built data-driven acquisition engines that scaled inbound leads by 115% and cut customer acquisition costs by 38% through conversion rate optimization and precision targeting. FinPulse's innovative fintech platform presents an exciting opportunity where my demand generation expertise can deliver immediate pipeline lift.

I look forward to discussing how my experience can contribute to FinPulse's next phase of market expansion.

Best regards,
Alex Rivera`,
    timestamp: '2026-08-23T10:48:00Z'
  },
  {
    id: 'app_003',
    source: 'LinkedIn',
    company: 'Apex AI Labs',
    title: 'Product Marketing Manager (AI & Automation)',
    location: 'Austin, TX (Remote Worldwide)',
    workplaceType: 'Remote',
    salaryRange: '$125,000 - $150,000 / yr',
    job_url: 'https://linkedin.com/jobs/view/apex-ai-pmm',
    date_discovered: '45 mins ago',
    ats_match_score: 89,
    status: 'Generating Assets',
    matched_keywords: ['AI-Assisted Workflow', 'B2B SaaS', 'Product-Led Growth', 'Go-To-Market', 'CRO'],
    missing_keywords: ['Python Scripting'],
    target_jd: {
      overview: 'Apex AI Labs builds next-generation generative automation tools for enterprise teams. We are seeking a Product Marketing Manager to craft positioning, launch new AI capabilities, and drive user adoption.',
      responsibilities: [
        'Define product messaging, value propositions, and battle cards for AI workflow features.',
        'Collaborate with Product & Sales to execute launch campaigns with high engagement.',
        'Author case studies, interactive product walkthroughs, and technical whitepapers.'
      ],
      required_skills: ['3+ years in Product Marketing or Technical Growth', 'Understanding of AI/ML software workflows', 'Exceptional written communication and positioning skills'],
      nice_to_have: ['Familiarity with prompt engineering and LLM integrations'],
      salary_notes: '$130k-$145k + equity options + unlimited PTO.'
    },
    generated_resume: `# ALEX RIVERA
**Product Marketing Manager — AI & Enterprise Automation**
Remote • alex.rivera@pulzitive.com

---

### PROFESSIONAL PROFILE
Strategic Product Marketer combining 7+ years of digital growth experience with hands-on expertise in AI workflow automation and B2B SaaS positioning. Adept at turning complex technical capabilities into clear, high-converting value propositions that accelerate market adoption.

---

### KEY COMPETENCIES
* Product Positioning & Go-To-Market (GTM) Strategy
* AI & Automation Workflow Adoption
* Customer Journey Mapping & Value Proposition Design
* Cross-Functional Launch Management
* Competitive Intelligence & Sales Enablement`,
    generated_cover_letter: `Dear Apex AI Labs Team,

I am writing to apply for the Product Marketing Manager role at Apex AI Labs. As someone who actively implements AI-assisted automation into daily growth workflows, I am fascinated by Apex's cutting-edge enterprise automation stack.

Throughout my career, I have translated complex technical infrastructure into clear, high-converting product positioning that drives user acquisition. My background in orchestrating multi-channel GTM campaigns and analyzing behavioral telemetry positions me to help Apex AI Labs dominate the emerging automation landscape.

I would love to share specific strategies for positioning your upcoming releases.

Warmly,
Alex Rivera`,
    timestamp: '2026-08-23T10:30:00Z'
  },
  {
    id: 'app_004',
    source: 'Indeed',
    company: 'HyperGrowth Media Group',
    title: 'Full-Stack Growth Engineer / Marketer',
    location: 'Chicago, IL (Remote)',
    workplaceType: 'Remote',
    salaryRange: '$95,000 - $115,000 / yr',
    job_url: 'https://indeed.com/viewjob?jk=hypergrowth-growth-eng',
    date_discovered: '1 hour ago',
    ats_match_score: 86,
    status: 'Parsing Job',
    matched_keywords: ['CRO', 'A/B Experimentation', 'Analytics', 'Conversion Funnels'],
    missing_keywords: ['Next.js App Router', 'Tailwind Frontend'],
    target_jd: {
      overview: 'HyperGrowth is looking for a hybrid growth practitioner who can design, code, and execute landing page experiments, tracking pixels, and conversion rate optimizations.',
      responsibilities: [
        'Build and ship weekly multivariate landing page tests.',
        'Setup server-side Google Tag Manager and Facebook CAPI tracking.',
        'Optimize website performance and Core Web Vitals for maximum ad conversion.'
      ],
      required_skills: ['Strong analytical foundation with hands-on HTML/CSS/JS or React knowledge', 'Demonstrated understanding of CRO principles and ad tracking'],
      nice_to_have: ['Webflow or Headless CMS experience'],
      salary_notes: 'Flexible hours, remote stipend, quarterly performance bonuses.'
    },
    generated_resume: `# ALEX RIVERA
**Growth Specialist & CRO Strategist**
Remote • alex.rivera@pulzitive.com

---

### PROFESSIONAL SUMMARY
Conversion-focused Growth Marketer with deep technical competency in frontend experimentation, server-side attribution telemetry, and rapid landing page development. Proven ability to boost page conversion rates by 270% across competitive digital categories.`,
    generated_cover_letter: `Dear HyperGrowth Hiring Team,

I am excited to apply for the Full-Stack Growth Engineer / Marketer opening at HyperGrowth Media Group. Having bridged the gap between creative marketing strategy and technical frontend experimentation, I specialize in building, testing, and optimizing high-converting web experiences.

I look forward to discussing how my testing frameworks can elevate HyperGrowth's client conversion benchmarks.

Sincerely,
Alex Rivera`,
    timestamp: '2026-08-23T10:15:00Z'
  },
  {
    id: 'app_005',
    source: 'LinkedIn',
    company: 'Nexus Scale B2B',
    title: 'Demand Generation & Acquisition Lead',
    location: 'Seattle, WA (Remote)',
    workplaceType: 'Remote',
    salaryRange: '$115,000 - $140,000 / yr',
    job_url: 'https://linkedin.com/jobs/view/nexus-demand-gen',
    date_discovered: '2 hours ago',
    ats_match_score: 92,
    status: 'Queued',
    matched_keywords: ['B2B SaaS', 'Performance Marketing', 'CAC Optimization', 'Looker', 'CRO'],
    missing_keywords: ['Marketo Certification'],
    target_jd: {
      overview: 'Nexus Scale is looking for an experienced Demand Generation Lead to scale our enterprise pipeline and optimize multi-channel inbound engines.',
      responsibilities: [
        'Manage full-funnel paid and organic demand generation programs.',
        'Work closely with sales development reps to ensure high lead-to-opportunity conversion.',
        'Design automated retargeting cadences across LinkedIn and Google Display.'
      ],
      required_skills: ['4+ years in B2B demand gen', 'Proven track record scaling enterprise pipeline', 'Strong command of marketing analytics'],
      nice_to_have: ['Account-Based Marketing (ABM) experience'],
      salary_notes: 'Generous bonus structure + equity.'
    },
    generated_resume: `# ALEX RIVERA
**Demand Generation & Acquisition Lead**
Remote • alex.rivera@pulzitive.com

---

### SUMMARY
High-performing B2B Demand Generation Lead with a record of driving $8.5M+ in sales pipeline. Expert in multi-channel paid acquisition, ABM nurture sequences, and marketing analytics.`,
    generated_cover_letter: `Dear Nexus Scale Team,

I am writing to express my enthusiasm for the Demand Generation & Acquisition Lead role. With over 7 years scaling B2B demand engines, I have consistently driven predictable, qualified pipeline growth.

I welcome the chance to discuss how my acquisition frameworks can scale Nexus Scale’s pipeline this year.

Best regards,
Alex Rivera`,
    timestamp: '2026-08-23T09:30:00Z'
  },
  {
    id: 'app_006',
    source: 'Indeed',
    company: 'Vanguard Health Tech',
    title: 'Digital Marketing & Growth Manager',
    location: 'Boston, MA (Remote)',
    workplaceType: 'Remote',
    salaryRange: '$100,000 - $125,000 / yr',
    job_url: 'https://indeed.com/viewjob?jk=vanguard-health-tech',
    date_discovered: '3 hours ago',
    ats_match_score: 79,
    status: 'Failed / Review',
    matched_keywords: ['Performance Marketing', 'CRO', 'Data Analytics'],
    missing_keywords: ['HIPAA Compliance', 'Healthcare Ad Regulations'],
    target_jd: {
      overview: 'Vanguard Health Tech provides compliance and telemedicine software. We need a Growth Manager to lead digital acquisition while navigating healthcare privacy standards.',
      responsibilities: [
        'Develop compliant paid campaigns across Google Search and industry publishers.',
        'Improve website onboarding and demo scheduling rates.',
        'Coordinate with legal and compliance teams on ad messaging.'
      ],
      required_skills: ['3+ years growth marketing', 'Healthcare or compliance SaaS background required', 'Strong analytical tracking experience'],
      nice_to_have: ['Experience with HITRUST or HIPAA compliant marketing tools'],
      salary_notes: 'Health, Dental, Vision + 401k + remote budget.'
    },
    generated_resume: `# ALEX RIVERA
**Digital Marketing & Growth Manager**
Remote • alex.rivera@pulzitive.com

---

### SUMMARY
Strategic Digital Marketing Manager experienced in high-compliance SaaS acquisition and conversion optimization.`,
    generated_cover_letter: `Dear Vanguard Health Tech Team,

I am writing to apply for the Digital Marketing & Growth Manager position. With a strong track record in data-driven user acquisition and strict funnel optimization, I look forward to supporting Vanguard's mission.

Sincerely,
Alex Rivera`,
    timestamp: '2026-08-23T08:15:00Z'
  }
];

const INITIAL_LOGS = [
  '[11:15:02] Autopilot Engine v4.2 initialized. Connection established with LinkedIn API & Indeed Sourcing Gateway.',
  '[11:15:08] Scanning query: "Senior Growth Marketer", "Product Marketing Lead" (Location: Remote, Min: $95k/yr).',
  '[11:15:15] Scraped LinkedIn: Senior Product Growth Lead at CloudScale Technologies (ID: app_001).',
  '[11:15:18] Extracting JD semantic requirements: B2B SaaS, PLG, Looker, CRO, Attribution modeling.',
  '[11:15:22] ATS Parser scoring completed. Match Score: 94% (Target baseline: >85%).',
  '[11:15:25] AI Dynamic ATS Resume generated with clean ATS markdown formatting.',
  '[11:15:28] Contextual Cover Letter aligned with CloudScale enterprise pain points compiled.',
  '[11:15:33] Auto-Submit executed via LinkedIn Easy Apply gateway. Status: SUBMITTED (App ID: app_001).',
  '[11:16:01] Scraped Indeed: Lead Digital Marketing Strategist at FinPulse Systems (ID: app_002).',
  '[11:16:05] ATS Match Score calculated: 91%. Tailored assets compiled.',
  '[11:16:10] Auto-Submit verified. Application transmitted successfully to FinPulse HR portal.',
  '[11:16:30] Scraped LinkedIn: Product Marketing Manager at Apex AI Labs. Generating assets (Current Match: 89%)...'
];

interface AIJobAutopilotProps {
  onTriggerNotification?: (msg: string) => void;
  className?: string;
  defaultOpen?: boolean;
}

export const AIJobAutopilot: React.FC<AIJobAutopilotProps> = ({
  onTriggerNotification,
  className = '',
  defaultOpen = true
}) => {
  // State variables
  const [isAutopilotActive, setIsAutopilotActive] = useState<boolean>(true);
  const [submissionMode, setSubmissionMode] = useState<'auto' | 'manual'>('auto');
  const [dailyQuotaSent, setDailyQuotaSent] = useState<number>(74);
  const [dailyQuotaLimit] = useState<number>(100);
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'resume' | 'cover_letter' | 'match_analysis'>('resume');
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [isLogExpanded, setIsLogExpanded] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [channelFilter, setChannelFilter] = useState<'all' | 'LinkedIn' | 'Indeed'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Submitted' | 'Queued' | 'Generating Assets' | 'Failed / Review'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [masterProfile, setMasterProfile] = useState<UserMasterProfile>(INITIAL_MASTER_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(true);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const notify = (text: string) => {
    if (onTriggerNotification) {
      onTriggerNotification(text);
    }
  };

  // Auto-scroll terminal logs when expanded
  useEffect(() => {
    if (isLogExpanded && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLogExpanded]);

  // Periodic log simulator when autopilot is active
  useEffect(() => {
    if (!isAutopilotActive || !isSimulatingStream) return;

    const interval = setInterval(() => {
      const randomCompany = ['Stripe', 'Figma', 'Datadog', 'Notion', 'Supabase', 'Linear', 'Vercel'][Math.floor(Math.random() * 7)];
      const randomRole = ['Senior Growth Lead', 'Product Marketer', 'Acquisition Specialist', 'Growth Engineer'][Math.floor(Math.random() * 4)];
      const randomScore = Math.floor(Math.random() * 12) + 85;
      const timeStr = new Date().toTimeString().split(' ')[0];

      const simulatedLogs = [
        `[${timeStr}] Scraped LinkedIn Remote: ${randomRole} at ${randomCompany}...`,
        `[${timeStr}] Analyzing JD semantic requirements for ${randomCompany}. Extracted 8 key requirements.`,
        `[${timeStr}] AI ATS Match Score: ${randomScore}%. Building tailored resume & pain-point cover letter.`,
        `[${timeStr}] Assets compiled with high-score formatting. ${submissionMode === 'auto' ? 'Auto-Submitting via gateway...' : 'Queued for 1-Click Manual Approval.'}`
      ];

      setLogs(prev => [...prev.slice(-30), simulatedLogs[Math.floor(Math.random() * simulatedLogs.length)]]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isAutopilotActive, isSimulatingStream, submissionMode]);

  // Trigger instant manual scan
  const handleTriggerScan = () => {
    setIsScanning(true);
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev,
      `[${timeStr}] MANUAL SCAN INITIATED: Crawling LinkedIn Remote & Indeed Remote gateways...`,
      `[${timeStr}] Query parameters: Roles=[${masterProfile.target_roles.join(', ')}], MinComp=$${masterProfile.min_compensation_usd.toLocaleString()}/yr.`
    ]);

    setTimeout(() => {
      setIsScanning(false);
      const newJobId = `app_${Date.now()}`;
      const newJob: JobApplication = {
        id: newJobId,
        source: Math.random() > 0.5 ? 'LinkedIn' : 'Indeed',
        company: 'Vercel Growth Ecosystem',
        title: 'Senior Developer Growth & Community Lead',
        location: 'San Francisco / Remote Worldwide',
        workplaceType: 'Remote',
        salaryRange: '$130,000 - $160,000 / yr',
        job_url: 'https://linkedin.com/jobs/view/vercel-growth-lead',
        date_discovered: 'Just now',
        ats_match_score: 95,
        status: submissionMode === 'auto' ? 'Submitted' : 'Queued',
        matched_keywords: ['Product-Led Growth', 'B2B SaaS', 'CRO', 'Data Analytics', 'Next.js', 'AI Automation'],
        missing_keywords: [],
        target_jd: {
          overview: 'Vercel is seeking a Developer Growth Lead to expand self-serve developer activation, optimize documentation conversion funnels, and lead viral technical marketing campaigns.',
          responsibilities: [
            'Own full-funnel developer acquisition across organic and paid channels.',
            'Build interactive onboarding playbooks and product feature launches.',
            'Instrument product telemetry to measure user journey activation milestones.'
          ],
          required_skills: ['5+ years growth or technical marketing', 'Deep passion for developer tools', 'Proven data analytics capability'],
          nice_to_have: ['Experience with AI models and SDK tooling'],
          salary_notes: '$140k-$160k base + generous RSUs + healthcare.'
        },
        generated_resume: `# ALEX RIVERA
**Senior Developer Growth & Product Marketer**
Remote • alex.rivera@pulzitive.com • +1 (555) 234-5678

---

### PROFESSIONAL PROFILE
Senior Growth Marketer with 7+ years accelerating adoption of developer platforms, AI tools, and B2B SaaS software. Proven record executing PLG onboarding loops that increased trial-to-paid conversions by 142% and scaled pipeline ARR by $4.2M.

---

### TECHNICAL SKILLS & ATS KEYWORDS
* Product-Led Growth (PLG), Developer Marketing, Self-Serve Funnels
* SQL, Looker, Google Analytics 4, Multi-Touch Attribution
* A/B Experimentation, Conversion Rate Optimization (CRO), Landing Page Arch`,
        generated_cover_letter: `Dear Vercel Hiring Team,

I am writing to express my strong enthusiasm for the Senior Developer Growth & Community Lead role at Vercel. Having actively built, deployed, and scaled applications on Vercel's platform, I have experienced firsthand the power of frictionless developer experience.

In my recent roles, I led product-led growth initiatives that boosted user activation by 142% and architected high-converting funnel telemetry. Vercel’s commitment to web performance and developer delight aligns precisely with my growth philosophy.

I would love to discuss how I can help accelerate Vercel's self-serve developer adoption this year.

Sincerely,
Alex Rivera`,
        timestamp: new Date().toISOString()
      };

      setJobs(prev => [newJob, ...prev]);
      if (submissionMode === 'auto') {
        setDailyQuotaSent(prev => Math.min(dailyQuotaLimit, prev + 1));
      }
      setLogs(prev => [
        ...prev,
        `[${timeStr}] Found high-match posting: Senior Developer Growth Lead at Vercel (Match: 95%).`,
        `[${timeStr}] ${submissionMode === 'auto' ? 'Auto-Submitted successfully!' : 'Ready in queue for 1-click review.'}`
      ]);
      notify(`Sourcing complete! Found Vercel Senior Growth Lead (95% Match Score).`);
    }, 1800);
  };

  // Copy handler
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(label);
    notify(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedState(null), 2500);
  };

  // Download Markdown Handler
  const handleDownloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Downloaded ${filename}.md`);
  };

  // 1-Click Manual Submit
  const handleManualSubmit = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'Submitted' } : j))
    );
    setDailyQuotaSent(prev => Math.min(dailyQuotaLimit, prev + 1));
    const target = jobs.find(j => j.id === jobId);
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev,
      `[${timeStr}] MANUAL SUBMIT CONFIRMED: Application for "${target?.title}" at ${target?.company} submitted via ${target?.source} gateway.`
    ]);
    notify(`Application for ${target?.company} submitted! Daily count: ${dailyQuotaSent + 1}/${dailyQuotaLimit}`);
  };

  // Filtered jobs list
  const filteredJobs = jobs.filter(job => {
    const matchesChannel = channelFilter === 'all' || job.source === channelFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matched_keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesChannel && matchesStatus && matchesSearch;
  });

  const avgAtsScore = Math.round(
    jobs.reduce((acc, curr) => acc + curr.ats_match_score, 0) / (jobs.length || 1)
  );

  const pendingApprovalsCount = jobs.filter(j => j.status === 'Queued' || j.status === 'Failed / Review').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. HEADER & AUTOPILOT MASTER CONTROL BAR */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-900 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isAutopilotActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAutopilotActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                {isAutopilotActive ? 'Autopilot Active • LinkedIn & Indeed Sourcing' : 'Autopilot Paused / Standby'}
              </span>

              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Dynamic ATS Engine v4.2</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI Job Autopilot & ATS Customizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Automates remote job discovery, synthesizes 90%+ ATS-matched resumes & contextual cover letters per posting, and manages high-volume applications across LinkedIn & Indeed.
            </p>
          </div>

          {/* Controls: Daily Gauge & Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Daily Limit Gauge */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1.5 min-w-[200px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-500 uppercase text-[10px]">Daily Application Limit</span>
                <span className="font-black text-slate-900">{dailyQuotaSent} / {dailyQuotaLimit}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(dailyQuotaSent / dailyQuotaLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold text-right">Resets in 12h 45m</p>
            </div>

            {/* Mode Switch & Trigger Scan */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newMode = submissionMode === 'auto' ? 'manual' : 'auto';
                  setSubmissionMode(newMode);
                  notify(`Submission mode switched to ${newMode === 'auto' ? 'Full Autopilot (Auto-Submit)' : 'Review Mode (1-Click Approval)'}.`);
                }}
                className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  submissionMode === 'auto'
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                    : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                }`}
                title="Toggle between Auto-Submit and Manual 1-Click Review Mode"
              >
                <Zap className="w-4 h-4" />
                <span>{submissionMode === 'auto' ? 'Auto-Submit Mode' : 'Review Mode'}</span>
              </button>

              <button
                onClick={handleTriggerScan}
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Sourcing...' : 'Run Scan'}</span>
              </button>

              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs p-3 rounded-2xl cursor-pointer transition-all"
                title="Configure Sourcing Filters & Keywords"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs p-3 rounded-2xl cursor-pointer transition-all"
                title="Edit Master Resume & User Profile"
              >
                <UserCheck className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP METRICS STATS BAR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono uppercase font-bold">Applications Sent</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{dailyQuotaSent}</span>
            <span className="text-[10px] text-emerald-600 font-black">+18 today</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Weekly Total: 412 Applications</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono uppercase font-bold">Avg ATS Match Rate</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{avgAtsScore}%</span>
            <span className="text-[10px] text-blue-600 font-black">Tier 1 ATS Ready</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${avgAtsScore}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono uppercase font-bold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{pendingApprovalsCount}</span>
            <span className="text-[10px] text-amber-600 font-black">Needs Approval</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">1-Click Submissions ready</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono uppercase font-bold">Interview Response Rate</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">19.2%</span>
            <span className="text-[10px] text-emerald-600 font-black">+4.5% vs avg</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">14 Recruiter Screenings active</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE JOB QUEUE TABLE WITH FILTERING & CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Table Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Automated Job Sourcing & Application Queue</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live queue from LinkedIn & Indeed with real-time semantic ATS scoring and tailored asset generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter roles, keywords..."
                className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-56"
              />
            </div>

            {/* Channel Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  channelFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChannelFilter('LinkedIn')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  channelFilter === 'LinkedIn' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => setChannelFilter('Indeed')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  channelFilter === 'Indeed' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Indeed
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Company & Role</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Discovered</th>
                <th className="py-3 px-3 text-center">ATS Match</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="font-bold">No jobs matching current filters.</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your search or clicking "Run Scan" above.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => {
                  const isHighMatch = job.ats_match_score >= 85;
                  const isMediumMatch = job.ats_match_score >= 70 && job.ats_match_score < 85;

                  return (
                    <tr
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Company & Role */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="font-bold text-slate-700">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">{job.salaryRange}</span>
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md border ${
                          job.source === 'LinkedIn'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          <Globe className="w-3 h-3" />
                          {job.source} Remote
                        </span>
                      </td>

                      {/* Discovered */}
                      <td className="py-3.5 px-3 text-[11px] text-slate-500 font-mono">
                        {job.date_discovered}
                      </td>

                      {/* ATS Match Score */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-full font-mono border ${
                          isHighMatch
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isMediumMatch
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}>
                          {job.ats_match_score}%
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          job.status === 'Submitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'Generating Assets'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : job.status === 'Parsing Job'
                            ? 'bg-indigo-100 text-indigo-800'
                            : job.status === 'Queued'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {job.status === 'Submitted' && <CheckCircle2 className="w-3 h-3" />}
                          {job.status === 'Queued' && <Clock className="w-3 h-3" />}
                          {job.status === 'Generating Assets' && <Sparkles className="w-3 h-3" />}
                          {job.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                            title="View Split-View Editor"
                          >
                            <Eye className="w-3 h-3 text-blue-600" />
                            <span>View Asset</span>
                          </button>

                          {job.status !== 'Submitted' && (
                            <button
                              onClick={() => handleManualSubmit(job.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="1-Click Approve & Submit"
                            >
                              <Send className="w-3 h-3" />
                              <span>Submit</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CONSOLE / LIVE LOGS ACTIVITY FEED (BOTTOM COLLAPSIBLE TERMINAL) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md text-slate-800 font-mono text-xs">
        {/* Terminal Top Bar */}
        <div className="bg-slate-50 px-5 py-3.5 flex items-center justify-between border-b border-slate-200 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-900 font-bold tracking-wide">Live Autopilot Execution Console</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Streaming Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulatingStream(!isSimulatingStream)}
              className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isSimulatingStream ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isSimulatingStream ? 'Pause Stream' : 'Resume'}</span>
            </button>

            <button
              onClick={() => setLogs([`[${new Date().toTimeString().split(' ')[0]}] Console cleared. Listening for autopilot socket triggers...`])}
              className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear Logs
            </button>

            <button
              onClick={() => setIsLogExpanded(!isLogExpanded)}
              className="text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title={isLogExpanded ? 'Collapse Console' : 'Expand Console'}
            >
              {isLogExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {isLogExpanded && (
          <div className="p-4 sm:p-5 max-h-56 overflow-y-auto space-y-2 text-[11px] leading-relaxed select-text bg-white">
            {logs.map((log, idx) => {
              const isMatch = log.includes('Match Score') || log.includes('SUBMITTED');
              const isScan = log.includes('Scraped') || log.includes('MANUAL SCAN');
              const isAi = log.includes('AI') || log.includes('Dynamic ATS');

              return (
                <div
                  key={idx}
                  className={`font-mono flex items-start gap-2 ${
                    isMatch
                      ? 'text-emerald-800 font-bold bg-emerald-50/80 border border-emerald-200/60 px-2 py-1 rounded-lg'
                      : isScan
                      ? 'text-blue-700 font-semibold'
                      : isAi
                      ? 'text-indigo-700 font-semibold'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="text-slate-400 font-bold select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. SLIDE-OVER DRAWER / SPLIT-VIEW PANEL FOR TARGET JD + TAILORED ASSETS */}
      {/* ========================================================================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col overflow-hidden text-slate-900 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="bg-white text-slate-900 p-5 sm:p-6 flex items-start justify-between border-b border-slate-200 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedJob.source === 'LinkedIn' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {selectedJob.source} Remote
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    ATS Match: {selectedJob.ats_match_score}%
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{selectedJob.salaryRange}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{selectedJob.title}</h2>
                <p className="text-xs text-slate-600">
                  Target Company: <span className="text-slate-900 font-bold">{selectedJob.company}</span> • Location: {selectedJob.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split View Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
              {/* LEFT PANE: TARGET JOB DESCRIPTION */}
              <div className="border-b lg:border-b-0 lg:border-r border-slate-200 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Scraped Target Job Description</span>
                  </h3>
                  <a
                    href={selectedJob.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Original Posting</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">Role Overview</h4>
                    <p className="bg-white p-3.5 rounded-xl border border-slate-200">
                      {selectedJob.target_jd.overview}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs">Extracted Key Responsibilities</h4>
                    <ul className="space-y-1.5">
                      {selectedJob.target_jd.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs">Required Competencies & Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.target_jd.required_skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded-md text-[11px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs">Compensation & Benefits Notes</h4>
                    <p className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-xl font-medium">
                      {selectedJob.target_jd.salary_notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: AI-GENERATED TAILORED RESUME + COVER LETTER */}
              <div className="p-6 overflow-y-auto space-y-5 flex flex-col bg-white">
                {/* Asset Tabs & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 shrink-0">
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
                    <button
                      onClick={() => setActiveDrawerTab('resume')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeDrawerTab === 'resume'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ATS Resume</span>
                    </button>

                    <button
                      onClick={() => setActiveDrawerTab('cover_letter')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeDrawerTab === 'cover_letter'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Cover Letter</span>
                    </button>

                    <button
                      onClick={() => setActiveDrawerTab('match_analysis')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeDrawerTab === 'match_analysis'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Match Analysis</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCopy(
                          activeDrawerTab === 'resume' ? selectedJob.generated_resume : selectedJob.generated_cover_letter,
                          activeDrawerTab === 'resume' ? 'ATS Resume' : 'Cover Letter'
                        )
                      }
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy content"
                    >
                      {copiedState ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadMarkdown(
                          activeDrawerTab === 'resume' ? selectedJob.generated_resume : selectedJob.generated_cover_letter,
                          `${selectedJob.company.toLowerCase().replace(/\s+/g, '-')}-${activeDrawerTab}`
                        )
                      }
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Download Markdown file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .md</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: ATS Resume */}
                {activeDrawerTab === 'resume' && (
                  <div className="space-y-4 flex-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text max-h-[500px] overflow-y-auto">
                      {selectedJob.generated_resume}
                    </div>
                  </div>
                )}

                {/* Tab 2: Contextual Cover Letter */}
                {activeDrawerTab === 'cover_letter' && (
                  <div className="space-y-4 flex-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text max-h-[500px] overflow-y-auto">
                      {selectedJob.generated_cover_letter}
                    </div>
                  </div>
                )}

                {/* Tab 3: Match Analysis */}
                {activeDrawerTab === 'match_analysis' && (
                  <div className="space-y-5 flex-1 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">Semantic ATS Parser Score</span>
                        <span className="text-xl font-black text-emerald-800">{selectedJob.ats_match_score}%</span>
                      </div>
                      <p className="text-emerald-700 text-[11px]">
                        This tailored resume contains 94% of the exact semantic keywords and hard technical skills extracted from {selectedJob.company}'s target posting.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900">Matched ATS Keywords</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.matched_keywords.map((kw, i) => (
                          <span key={i} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedJob.missing_keywords.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900">Suggested Secondary Keywords</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedJob.missing_keywords.map((kw, i) => (
                            <span key={i} className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500">
                <span>Application Status: </span>
                <span className="font-bold text-slate-900">{selectedJob.status}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>

                {selectedJob.status !== 'Submitted' ? (
                  <button
                    onClick={() => {
                      handleManualSubmit(selectedJob.id);
                      setSelectedJob(null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Approve & Submit Application</span>
                  </button>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Already Submitted</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MASTER USER PROFILE EDITOR MODAL */}
      {/* ========================================================================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Master Profile & Ingestion Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  The AI Dynamic ATS Generator ingests this baseline profile to tailor resumes and cover letters.
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={masterProfile.name}
                    onChange={e => setMasterProfile({ ...masterProfile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Primary Professional Title</label>
                  <input
                    type="text"
                    value={masterProfile.title}
                    onChange={e => setMasterProfile({ ...masterProfile, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Executive Summary / Career Overview</label>
                <textarea
                  rows={3}
                  value={masterProfile.summary}
                  onChange={e => setMasterProfile({ ...masterProfile, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  value={masterProfile.skills.join(', ')}
                  onChange={e =>
                    setMasterProfile({
                      ...masterProfile,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Minimum Compensation (USD/yr)</label>
                  <input
                    type="number"
                    value={masterProfile.min_compensation_usd}
                    onChange={e => setMasterProfile({ ...masterProfile, min_compensation_usd: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Location & Timezones</label>
                  <input
                    type="text"
                    value={masterProfile.location}
                    onChange={e => setMasterProfile({ ...masterProfile, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  notify('Master Profile updated successfully! All new applications will ingest these credentials.');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                Save Master Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FILTERING & SOURCING PREFERENCES MODAL */}
      {/* ========================================================================= */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  <span>Sourcing & Sieve Controls</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Configure real-time filter gates for LinkedIn & Indeed automated scraping.
                </p>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Target Job Titles / Roles</label>
                <input
                  type="text"
                  value={masterProfile.target_roles.join(', ')}
                  onChange={e =>
                    setMasterProfile({
                      ...masterProfile,
                      target_roles: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Excluded Companies (Auto-Skip)</label>
                <input
                  type="text"
                  value={masterProfile.excluded_companies.join(', ')}
                  onChange={e =>
                    setMasterProfile({
                      ...masterProfile,
                      excluded_companies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Minimum Compensation Threshold ($ USD / yr)</label>
                <input
                  type="number"
                  value={masterProfile.min_compensation_usd}
                  onChange={e => setMasterProfile({ ...masterProfile, min_compensation_usd: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  notify('Sourcing filters updated! Next scan cycle will use these constraints.');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIJobAutopilot;
