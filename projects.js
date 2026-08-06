const projects = [
  {
    id: "growthlog",
    title: "Growth Log",
    subtitle: "Pediatric growth & health tracker",
    category: "web",
    date: "July 2026 – Present",
    tagline: "Track child growth curves, vaccines, and checkups with clinical precision.",
    description: "A pediatric health tracking web application built to help parents and clinicians log child measurements, monitor WHO & CDC growth curves, and export medical reports.",
    highlights: [
      "Calculates z-scores and percentiles against official WHO (0–2 yrs) and CDC (2–20 yrs) reference data using Chart.js.",
      "Exports custom medical report summaries to PDF using jsPDF.",
      "Currently piloting with pediatric clinics across the Greater Houston area."
    ],
    tags: ["JavaScript", "Chart.js", "jsPDF", "HTML/CSS"],
    liveUrl: "https://usegrowthlog.com/",
    githubUrl: "https://github.com/michaelguo07/healthy_human",
    featured: true
  },
  {
    id: "utliving",
    title: "UT Living",
    subtitle: "Student housing platform for UT Austin",
    category: "web",
    date: "Feb 2026 – Present",
    tagline: "Aggregates 1,500+ apartment listings across campus communities.",
    description: "Co-founded a student housing search platform for UT Austin students to compare apartments, floor plans, and pricing in one place.",
    highlights: [
      "Built an automated Python web scraper refreshing availability and pricing for 2,000+ units every 12 hours.",
      "Designed side-by-side comparison tools, cutting apartment evaluation time by 40%."
    ],
    tags: ["Python", "Web Scraping", "JavaScript", "HTML/CSS"],
    liveUrl: "https://ut-living-fixed.vercel.app/",
    githubUrl: "https://github.com/michaelguo07/ut_living_fixed",
    featured: true
  },
  {
    id: "better-usatt",
    title: "Better USATT",
    subtitle: "Table tennis analytics Chrome extension",
    category: "tools",
    date: "Nov 2025 – Jan 2026",
    tagline: "Enhances official USATT player profiles with match analytics and rating trends.",
    description: "A Chrome extension built for table tennis players to view detailed rating history, match logs, and statistical insights directly on official USATT profile pages.",
    highlights: [
      "Analyzes match records across 8,000+ players and 150,000+ total matches.",
      "Parses tournament logs with Papa Parse to render 4 rating-trend visualizations and match statistics."
    ],
    tags: ["JavaScript", "Chrome Extension", "Papa Parse", "CSS"],
    liveUrl: "https://chromewebstore.google.com/detail/better-usatt/nmhbnaoogekkgihaeboacjomjdopehje?hl=en",
    githubUrl: null,
    featured: true
  },
  {
    id: "dippd",
    title: "Dippd",
    subtitle: "Chocolate snack brand",
    category: "web",
    date: "2026",
    tagline: "Houston-local snack business crafting freeze-dried fruit dipped in chocolate.",
    description: "Co-founded Dippd to produce freeze-dried fruits dipped in artisanal chocolate, built a clean web store interface to handle local orders.",
    highlights: [
      "Custom product menu showcasing freeze-dried strawberries, blueberries, bananas, and mangos.",
      "Lightweight order workflow built with Tailwind CSS."
    ],
    tags: ["Web Design", "Tailwind CSS", "E-commerce"],
    liveUrl: "https://eatdippd.com/",
    githubUrl: null,
    featured: true
  },
  {
    id: "mltt",
    title: "MLTT Stock Exchange",
    subtitle: "Fantasy trading platform for table tennis fans",
    category: "tools",
    date: "Dec 2025 – Mar 2026",
    tagline: "Trade simulated shares of Major League Table Tennis athletes based on live performance.",
    description: "A fantasy stock market platform where fans buy and sell player shares tied to real-time MLTT match outcomes.",
    highlights: [
      "Created a pricing algorithm that updates share prices based on match wins, streaks, and player rating differentials.",
      "Integrated live MLTT API endpoints to automate score updates for 50+ professional athletes."
    ],
    tags: ["JavaScript", "Pricing Algorithms", "REST API"],
    liveUrl: null,
    githubUrl: null,
    featured: false
  }
];
