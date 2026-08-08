import { ServiceInfo, Course, WorkProject, Testimonial, SiteSettings, AdminCredentials, PageContent } from '../types';

export const SERVICES: Record<string, ServiceInfo> = {
  'data-science': {
    id: 'data-science',
    title: 'Data Analytics & Data Science',
    tagline: 'MAKE THE NUMBERS USEFUL',
    description: 'Clean analysis, sharp insights, and reporting that helps you decide what to do next without second-guessing.',
    features: [
      'Advanced statistics & machine learning modeling',
      'SQL, Python automation & data pipeline design',
      'Interactive dashboards & decision-ready reporting'
    ],
    iconName: 'BarChart3',
    badge: 'Analytics & ML',
    heroHeadline: 'Transform Raw Data into Decisive Strategic Action',
    capabilities: [
      'Predictive Analytics & Forecasting Models',
      'Exploratory Data Analysis (EDA) & Cleaning',
      'Custom Tableau, Power BI & Streamlit Dashboards',
      'SQL Query Optimization & Database Architecture',
      'Automated ETL Data Pipelines with Python'
    ],
    outcomes: [
      'Confidently query and analyze enterprise datasets',
      'Build machine learning models that generate business value',
      'Deliver executive-ready data visual dashboards',
      'Automate weekly/monthly data reporting workflows'
    ],
    faqs: [
      {
        question: 'Do I need prior coding experience for Data Science training?',
        answer: 'No prior coding experience is required for our beginner track. We start from foundational Python and SQL and build up to advanced machine learning.'
      },
      {
        question: 'What tools will I learn during the consultation and courses?',
        answer: 'You will work with Python (Pandas, NumPy, Scikit-Learn), SQL, Jupyter, Tableau, and Streamlit.'
      },
      {
        question: 'Can you help us build custom predictive models for our business?',
        answer: 'Yes! Our 1-on-1 consultations cover both personal career mentoring and business pipeline architecture.'
      }
    ]
  },
  'coding': {
    id: 'coding',
    title: 'Development & Coding',
    tagline: 'REMOVE THE REPETITIVE',
    description: 'Practical full-stack development, Python automation, and API design that turns manual work into dependable systems.',
    features: [
      'Full-Stack Web & Mobile App Architecture',
      'Backend APIs, Microservices & Serverless Functions',
      'Database Modeling, PostgreSQL & Cloud Infrastructure'
    ],
    iconName: 'Code2',
    badge: 'Full-Stack & APIs',
    heroHeadline: 'Build Scalable Software Systems That Power Modern Products',
    capabilities: [
      'React, TypeScript & Next.js Frontend Development',
      'Express, Node.js & Python RESTful API Design',
      'Relational Database Architecture & ORM Optimization',
      'CI/CD Deployment & Cloud Container Hosting',
      'Web Scraping & Workflow Process Automation'
    ],
    outcomes: [
      'Ship production-ready full-stack applications',
      'Architect robust APIs and microservice endpoints',
      'Implement authentication, state management, and cloud storage',
      'Automate repetitive manual business processes'
    ],
    faqs: [
      {
        question: 'Which tech stack is taught in the Development track?',
        answer: 'We focus heavily on modern TypeScript, React, Node.js/Express, Python, PostgreSQL, and Cloud Deployment.'
      },
      {
        question: 'Is the training project-based?',
        answer: '100% yes! Every module culminates in a live, deployed portfolio project that demonstrates your capability.'
      }
    ]
  },
  'designing': {
    id: 'designing',
    title: 'Design & UI/UX',
    tagline: 'SEE THE SIGNAL',
    description: 'Figma designs, interactive prototypes, and design systems built to be understood in seconds, not explained for hours.',
    features: [
      'UI/UX Design, Wireframing & Interactive Prototypes',
      'Comprehensive Design Systems & Component Libraries',
      'User Research, Usability Testing & Interface Audit'
    ],
    iconName: 'Palette',
    badge: 'UI/UX & Systems',
    heroHeadline: 'Craft Intuitive Visual Experiences Users Love to Use',
    capabilities: [
      'Figma High-Fidelity UI Layouts & Auto-Layout',
      'Design Token Systems & Scalable Component Kits',
      'Information Architecture & User Flow Mapping',
      'Interactive Micro-Animations & Prototyping',
      'Accessibility (WCAG AA) & Responsive Breakpoints'
    ],
    outcomes: [
      'Design polished digital products from concept to final spec',
      'Create production-ready design systems for developer handoff',
      'Conduct user interviews and usability testing',
      'Master visual hierarchy, typography scales, and color math'
    ],
    faqs: [
      {
        question: 'Do I need design software subscriptions beforehand?',
        answer: 'We use Figma, which offers a free plan that is fully sufficient for all coursework and consultation prototyping.'
      },
      {
        question: 'Will I learn developer handoff practices?',
        answer: 'Yes! We teach exact design-to-code translation, tokens, auto-layout, and component documentation.'
      }
    ]
  },
  'qa': {
    id: 'qa',
    title: 'Quality Assurance & Testing',
    tagline: 'LEARN BY BUILDING',
    description: 'Structured QA training, testing automation, and testing frameworks with clear explanations at every step.',
    features: [
      'Manual Testing Methodology & Test Case Design',
      'Automation Testing with Playwright, Selenium & Cypress',
      'API Testing, Postman & CI/CD Pipeline Quality Gates'
    ],
    iconName: 'ShieldCheck',
    badge: 'Automation & QA',
    heroHeadline: 'Guarantee Flawless Application Performance & Reliability',
    capabilities: [
      'End-to-End Automation Frameworks (Playwright & Cypress)',
      'API Validation, Load Testing & Postman Suites',
      'Cross-Browser & Cross-Device Compatibility Verification',
      'Bug Lifecycle Management & Regression Testing',
      'CI/CD Integration with GitHub Actions'
    ],
    outcomes: [
      'Write robust automated test suites for web & mobile apps',
      'Identify critical edge cases before users ever see them',
      'Perform security and API validation testing',
      'Build scalable QA test infrastructure from scratch'
    ],
    faqs: [
      {
        question: 'Is QA Automation suitable for beginners?',
        answer: 'Yes! We begin with fundamental manual test principles and progress logically into JavaScript/Python automation.'
      },
      {
        question: 'Do you cover modern frameworks like Playwright?',
        answer: 'Yes, Playwright and Cypress are core pillars of our modern Quality Assurance curriculum.'
      }
    ]
  }
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'ds-101',
    title: 'Python for Data Science & Predictive Analytics',
    slug: 'python-data-science-analytics',
    category: 'data-science',
    description: 'Master Python, Pandas, NumPy, and machine learning models to analyze complex business datasets and generate actionable insights.',
    longDescription: 'This comprehensive course takes you from Python fundamentals to advanced predictive modeling. Learn to clean dirty data, execute statistical tests, build interactive visual dashboards, and deploy machine learning models in real-world scenarios.',
    instructor: {
      name: 'Dr. Ananya Sharma',
      role: 'Lead Data Scientist & Ex-Google Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Over 12 years building analytics infrastructure and training over 3,000 engineers worldwide.'
    },
    level: 'Beginner',
    duration: '14 Hours',
    rating: 4.9,
    reviewCount: 184,
    price: 0, // Free course
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    featured: true,
    learningOutcomes: [
      'Master core Python syntax and data structures',
      'Clean and transform complex datasets with Pandas',
      'Build machine learning classification and regression models',
      'Create executive reports and Tableau / Streamlit dashboards'
    ],
    prerequisites: ['Basic computer literacy', 'No programming required'],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Python & Data Setup',
        description: 'Variables, loops, functions, and Jupyter notebook environment.',
        lessons: [
          {
            id: 'l1-1',
            title: '1.1 Introduction to Python Data Ecosystem',
            duration: '15 min',
            videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
            description: 'Overview of Python libraries for analytics and setting up your local environment.'
          },
          {
            id: 'l1-2',
            title: '1.2 Working with Data Frames in Pandas',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
            description: 'Filtering, sorting, and aggregating data with Pandas.'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Exploratory Data Analysis & Machine Learning',
        description: 'Feature engineering, Scikit-Learn algorithms, and evaluation.',
        lessons: [
          {
            id: 'l2-1',
            title: '2.1 Building your First Machine Learning Model',
            duration: '30 min',
            videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
            description: 'Train/test splits, Linear Regression, and Decision Trees in Python.'
          }
        ]
      }
    ]
  },
  {
    id: 'code-201',
    title: 'Full-Stack Web Development with React, TypeScript & Node',
    slug: 'fullstack-react-typescript-node',
    category: 'coding',
    description: 'Build production-ready, dynamic web applications with React 19, TypeScript, Express backend, and database integration.',
    longDescription: 'Learn complete full-stack web engineering. From responsive Tailwind CSS layouts to RESTful API server development, authentication, state management, and Cloud deployment.',
    instructor: {
      name: 'Rohan Mehta',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Full-stack lead with 10+ years engineering high-scale SaaS applications.'
    },
    level: 'Intermediate',
    duration: '22 Hours',
    rating: 4.95,
    reviewCount: 312,
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    featured: true,
    learningOutcomes: [
      'Architect full-stack React + Node TypeScript apps',
      'Build secure RESTful APIs with Express and Firestore / SQL',
      'Implement modern state management and hooks',
      'Deploy full-stack web platforms to Cloud Run and Vercel'
    ],
    prerequisites: ['Basic HTML, CSS, and JavaScript understanding'],
    curriculum: [
      {
        id: 'c-mod-1',
        title: 'Module 1: React 19 & TypeScript Core',
        description: 'Component architecture, props, state, and type safety.',
        lessons: [
          {
            id: 'cl1-1',
            title: '1.1 Modern React & TypeScript Setup',
            duration: '18 min',
            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            description: 'Building modern interfaces with React 19 and Vite.'
          },
          {
            id: 'cl1-2',
            title: '1.2 Building Scalable Components with Tailwind CSS',
            duration: '25 min',
            videoUrl: 'https://www.youtube.com/embed/b-xrR29d-48',
            description: 'Utility-first styling, grid layouts, and dark mode toggles.'
          }
        ]
      },
      {
        id: 'c-mod-2',
        title: 'Module 2: Node.js Backend & API Design',
        description: 'Express servers, routing, middleware, and database connections.',
        lessons: [
          {
            id: 'cl2-1',
            title: '2.1 Express Routing & Middleware Architecture',
            duration: '28 min',
            videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE',
            description: 'Designing clean REST APIs with Express and Node.js.'
          }
        ]
      }
    ]
  },
  {
    id: 'ux-102',
    title: 'Figma UI/UX & Design Systems Masterclass',
    slug: 'figma-uiux-design-systems',
    category: 'designing',
    description: 'Design intuitive interfaces, interactive prototypes, and scalable design component systems from scratch.',
    longDescription: 'Learn professional UI/UX design workflow in Figma. Master auto-layout, design tokens, responsive grids, micro-interactions, and flawless developer handoff.',
    instructor: {
      name: 'Maya Lin',
      role: 'Staff Product Designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      bio: 'Award-winning UX lead designer with product designs used by millions.'
    },
    level: 'All Levels',
    duration: '16 Hours',
    rating: 4.88,
    reviewCount: 145,
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
    featured: true,
    learningOutcomes: [
      'Master Figma auto-layout, components, and variables',
      'Create responsive web and mobile application UI kits',
      'Conduct user research and build wireframe prototypes',
      'Prepare seamless design specs for developer handoff'
    ],
    prerequisites: ['None! Free Figma account required'],
    curriculum: [
      {
        id: 'd-mod-1',
        title: 'Module 1: Figma Essentials & Auto-Layout',
        description: 'Grids, typography scales, spacing tokens, and auto-layout.',
        lessons: [
          {
            id: 'dl1-1',
            title: '1.1 Figma Auto-Layout 5.0 Deep Dive',
            duration: '20 min',
            videoUrl: 'https://www.youtube.com/embed/3q3FV65Zrhk',
            description: 'Mastering flexbox-like layouts in Figma.'
          }
        ]
      }
    ]
  },
  {
    id: 'qa-202',
    title: 'Automated QA Testing with Playwright & Cypress',
    slug: 'qa-automation-playwright-cypress',
    category: 'qa',
    description: 'Build end-to-end automated testing frameworks, API tests, and continuous integration pipeline checks.',
    longDescription: 'Eliminate manual regression testing! Learn modern web test automation with Playwright and Cypress. Write automated test scripts, validate API endpoints, and plug test runners into GitHub Actions.',
    instructor: {
      name: 'Vikram Sengupta',
      role: 'Head of Quality Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'Specialist in test automation frameworks and zero-bug releases.'
    },
    level: 'Intermediate',
    duration: '12 Hours',
    rating: 4.92,
    reviewCount: 98,
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    featured: false,
    learningOutcomes: [
      'Write robust Playwright and Cypress test suites',
      'Perform API endpoint automated validation with Postman & Jest',
      'Integrate automated tests into GitHub CI/CD pipelines',
      'Generate clear bug reports and test execution metrics'
    ],
    prerequisites: ['Basic JavaScript or Python fundamentals'],
    curriculum: [
      {
        id: 'q-mod-1',
        title: 'Module 1: Modern Test Automation Principles',
        description: 'End-to-end testing strategies and selector strategies.',
        lessons: [
          {
            id: 'ql1-1',
            title: '1.1 Getting Started with Playwright Automation',
            duration: '22 min',
            videoUrl: 'https://www.youtube.com/embed/Xz6lhEzgI5I',
            description: 'Installation, test runner setup, and assertions.'
          }
        ]
      }
    ]
  }
];

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: 'proj-1',
    title: 'FinTech Predictive Customer Churn Engine',
    category: 'data-science',
    client: 'Apex Global Financial',
    tagline: 'Predicting user churn 60 days before cancellation with 92% accuracy.',
    summary: 'Built an end-to-end automated machine learning pipeline analyzing 2M+ transaction records.',
    impact: 'Reduced customer churn by 24% and saved $1.2M in annual recurring revenue.',
    tags: ['Python', 'Pandas', 'Scikit-Learn', 'Streamlit', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    caseStudy: {
      challenge: 'High customer churn in premium accounts without early warning indicators.',
      solution: 'Engineered a Random Forest & XGBoost model integrated with automated weekly email alerts.',
      results: [
        '92.4% prediction accuracy on 60-day window',
        'Automated real-time customer health score dashboard',
        'Seamless integration with Salesforce CRM'
      ]
    }
  },
  {
    id: 'proj-2',
    title: 'HealthCare Patient Telehealth Platform',
    category: 'coding',
    client: 'CarePulse Health',
    tagline: 'Full-stack HIPAA compliant portal serving 50k+ monthly consultations.',
    summary: 'Architected a responsive React + Node.js application with WebRTC video room integration.',
    impact: 'Cut appointment setup time by 70% and enabled instant digital prescriptions.',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    caseStudy: {
      challenge: 'Legacy system crashed under high traffic during peak consultation hours.',
      solution: 'Re-built platform with microservices architecture and cloud load-balancing.',
      results: [
        '99.99% server uptime during peak loads',
        'Sub-100ms API response time',
        'End-to-end encrypted medical data transmission'
      ]
    }
  },
  {
    id: 'proj-3',
    title: 'Enterprise Design System for Cloud SaaS',
    category: 'designing',
    client: 'CloudScale Analytics',
    tagline: 'Standardizing 200+ UI components for a global engineering team.',
    summary: 'Designed a unified Figma token system and React Tailwind component library.',
    impact: 'Accelerated frontend feature delivery speed by 3x across 4 product squads.',
    tags: ['Figma', 'Design Systems', 'UI/UX', 'Accessibility', 'Tokens'],
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
    caseStudy: {
      challenge: 'Inconsistent UI styling and slow developer handoffs causing product friction.',
      solution: 'Created a comprehensive Figma component kit mapped directly to Tailwind CSS classes.',
      results: [
        '100% WCAG AA color accessibility compliance',
        'Reduced designer-to-developer handoff time by 60%',
        'Adopted across 5 core company applications'
      ]
    }
  },
  {
    id: 'proj-4',
    title: 'E-Commerce Microservices Automation QA Suite',
    category: 'qa',
    client: 'Velox Retail',
    tagline: 'Automating 1,200+ test scenarios running on every pull request.',
    summary: 'Designed a parallel Playwright test infrastructure running in GitHub Actions.',
    impact: 'Reduced release cycle regression testing from 3 days to 14 minutes.',
    tags: ['Playwright', 'API Testing', 'GitHub Actions', 'CI/CD', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    caseStudy: {
      challenge: 'Manual checkout testing caused delayed releases and occasional checkout bugs.',
      solution: 'Built automated cross-browser Playwright test suite covering payments, inventory, and cart.',
      results: [
        '1,200+ tests executed in under 15 minutes',
        'Zero critical checkout bugs in production over 12 months',
        'Instant Slack alerts for broken pipeline builds'
      ]
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    role: 'Senior Product Manager',
    company: 'TechFlow Inc.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    quote: 'The 1-on-1 consultation completely transformed how our team approaches data analytics. No jargon, just pure practical execution.',
    service: 'data-science',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'David Patel',
    role: 'Full-Stack Software Engineer',
    company: 'Innovate Labs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    quote: 'Shringaara Academy’s full-stack course gave me the exact skills needed to transition into a senior engineering role within 3 months.',
    service: 'coding',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Lead UX Designer',
    company: 'Nexus Creative',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    quote: 'The design systems module is standard-setting. My Figma prototypes are now developer-friendly and production-ready.',
    service: 'designing',
    rating: 5
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Shringaara Academy',
  tagline: 'Technical Excellence & Service',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'contact@shringaaraacademy.com',
  contactPhone: '+1 (800) 555-SHRINGAARA',
  address: '100 Innovation Way, Suite 400, Tech City, CA 94016',
  footerText: 'Technical training and professional service without the translation tax. Built with care, precise execution, and zero unnecessary jargon.'
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  adminId: 'admin',
  password: 'admin123'
};

export const DEFAULT_PAGE_CONTENT: PageContent = {
  home: {
    heroTitle: 'Technical Training & Execution Without the Translation Tax',
    heroSubtitle: 'Master Data Science, Full-Stack Development, UI/UX Systems, and QA Automation through hands-on LMS courses and direct 1-on-1 strategy consultations.',
    ctaText: 'Start a Conversation'
  },
  about: {
    title: 'About Shringaara Academy',
    subtitle: 'Bridging the gap between complex technical theory and real-world execution.',
    missionText: 'Our mission is to empower professionals and organizations with sharp technical skills, zero fluff, and direct access to expert guidance.',
    visionText: 'To build a global community of confident engineers, data analysts, designers, and QA specialists who build high-impact digital products.',
    storyText: 'Founded in 2024, Shringaara Academy was born out of frustration with surface-level tutorials. We designed an interactive LMS portal backed by direct 1-on-1 strategy sessions.'
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'August 7, 2026',
    content: `Shringaara Academy ("we", "our", or "us") is committed to protecting your privacy and ensuring transparency in how your personal information is collected, used, and safeguarded.

1. Information We Collect
We collect personal information that you voluntarily provide to us when you register on the portal, book a consultation, enroll in a course, or communicate with us. This includes your name, email address, phone number, consultation scheduling preferences, and course progress data.

2. How We Use Your Information
We use your information to:
- Provide, maintain, and improve our courses, consultation bookings, and student portal.
- Schedule Zoom consultation meetings and generate direct calendar invites.
- Process course enrollments and issue verified completion certificates.
- Communicate with you regarding course updates, student support, and account security.

3. Data Security & Persistence
Your consultation records and course progress are securely managed via cloud-hosted database infrastructure (Firebase Firestore). We do not sell, rent, or lease your personal information to third parties.

4. Your Rights
You may request access to, correction of, or deletion of your personal account information at any time by contacting contact@shringaaraacademy.com.`
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'August 7, 2026',
    content: `Welcome to Shringaara Academy. By accessing or using our website, student LMS portal, and consultation booking services, you agree to be bound by these Terms of Service.

1. Consultation Bookings & Attendance
- Consultation slots are subject to availability and maximum active scheduling rules (up to 2 active sessions per user).
- Meeting details, including Zoom URLs and passcodes, are provided for individual consultation use. Sensitive meeting metadata is purged post-session for privacy.

2. LMS Content & Intellectual Property
- All course curriculum, video materials, source code templates, and downloadable slides are the exclusive property of Shringaara Academy.
- Enrolled students receive a non-transferable, personal license to access and view course materials for individual educational purposes.

3. Verified Certificates
- Verified Completion Certificates are awarded automatically upon reaching 100% curriculum completion in eligible courses. Certificates are linked to a unique verification code.

4. Account Responsibility
- You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.`
  },
  faq: {
    title: 'Frequently Asked Questions & Help Center',
    subtitle: 'Find quick answers regarding our courses, 1-on-1 consultations, certificates, and student portal.',
    items: [
      {
        id: 'faq-1',
        question: 'How do 1-on-1 strategy consultations work?',
        answer: 'When you book a consultation, you select a date and 60-minute time slot. You instantly receive a Zoom link and calendar sync invite. During the session, we review your code, project roadmap, or career goals.',
        category: 'Consultation'
      },
      {
        id: 'faq-2',
        question: 'Are the LMS courses self-paced or live?',
        answer: 'Our LMS courses are self-paced interactive video modules. You can watch HD video lessons, take personal study notes, download source code, and track your progress at any time.',
        category: 'Courses'
      },
      {
        id: 'faq-3',
        question: 'How do I earn a verified completion certificate?',
        answer: 'Once you mark 100% of the lessons in a course as complete in your Student Portal, a verified certificate with a unique certificate ID is generated automatically.',
        category: 'Certificates'
      },
      {
        id: 'faq-4',
        question: 'Is there a limit on how many consultation bookings I can schedule?',
        answer: 'To ensure fair access for all students, users can hold up to 2 active scheduled consultations at a time. Once a session is completed, you may schedule a new one.',
        category: 'Booking Policy'
      }
    ]
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Have questions or need assistance with your learning roadmap? Reach out to our team.',
    email: 'contact@shringaaraacademy.com',
    phone: '+1 (800) 555-SHRINGAARA',
    address: '100 Innovation Way, Suite 400, Tech City, CA 94016',
    workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM PST',
    mapEmbedUrl: 'https://maps.google.com'
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    lastUpdated: 'August 7, 2026',
    content: `At Shringaara Academy, we strive to deliver standard-setting education and consulting experiences.

1. Consultation Rescheduling & Cancellation
- You may cancel or reschedule a consultation meeting at least 12 hours prior to the scheduled time slot without penalty.
- Cancelled sessions immediately free up your active booking slot allowance.

2. Course Refunds
- Paid courses come with a 7-day money-back guarantee, provided less than 30% of the course curriculum has been viewed and no certificate has been generated.
- Free access courses incur no fee and require no refund processing.

3. Processing Refunds
- To request a refund, please contact contact@shringaaraacademy.com with your enrollment details and student email. Approved refunds will be processed within 3-5 business days.`
  }
};

