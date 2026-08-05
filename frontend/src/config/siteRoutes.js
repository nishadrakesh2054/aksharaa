export const siteName = "Aksharaa School";

export const routeSeo = [
  {
    path: "/",
    label: "Home",
    title: "Best School in Kathmandu, Nepal | Admissions Open",
    description:
      "Aksharaa School is a premier progressive co-educational school in Kathmandu (PG to Grade 10), offering child-centric learning, modern infrastructure, and the LRPA framework.",
    keywords:
      "Aksharaa School, Best School in Kathmandu, Top School in Nepal, Admissions Open Kathmandu, LRPA Education",
  },
  {
    path: "/about",
    label: "Introduction",
    title: "About Aksharaa School | Highlights & History",
    description:
      "Learn about Aksharaa School in Kathmandu, our history, philosophy, progressive education approach, and value-based learning environment.",
  },
  {
    path: "/infrastructure",
    label: "Aksharaa Infrastructure",
    title: "Infrastructure & Facilities",
    description:
      "Explore Aksharaa School's modern classrooms, laboratories, library, cafeteria, play areas, transportation, and learning spaces.",
  },
  {
    path: "/about-lrpa",
    label: "LRPA Approach",
    title: "LRPA Pedagogy | Learning Approach",
    description:
      "Explore Aksharaa School's Learning, Reinforcement, Practice, and Application framework for child-centered education.",
  },
  {
    path: "/about-chairman",
    label: "Message From Executive",
    title: "Chairman & Principal Message",
    description:
      "Read messages from Aksharaa School leadership about our vision, learning culture, and commitment to holistic education.",
  },
  {
    path: "/about-team",
    label: "Team",
    title: "Our Team | Faculty & Administration",
    description:
      "Meet the faculty, administration, and operations team at Aksharaa School Kathmandu.",
    keywords:
      "team, staff, Aksharaa School, educators, administration",
  },
  {
    path: "/academics-kindergarten",
    label: "Kindergarten",
    title: "Kindergarten Program",
    description:
      "Learn about Aksharaa School's kindergarten program for early childhood learning and holistic development.",
  },
  {
    path: "/academics-elementary",
    label: "Elementary School",
    title: "Elementary School Program",
    description:
      "Explore Aksharaa School's elementary academic program, learning centers, co-curricular activities, and student-centered approach.",
  },
  {
    path: "/academics-middle",
    label: "Middle School",
    title: "Middle School Program",
    description:
      "Explore Aksharaa School's middle school program focused on academic growth, confidence, values, and practical learning.",
  },
  {
    path: "/academics-high",
    label: "Senior School",
    title: "High School Program",
    description:
      "Explore Aksharaa School's high school program for academic excellence, leadership, and future-ready learning.",
  },
  {
    path: "/admission-policy",
    label: "Admission Policy",
    title: "Admission Rules & Policy",
    description:
      "Review Aksharaa School admission rules, priority criteria, documentation requirements, and selection process.",
  },
  {
    path: "/admission-procedure",
    label: "Admission Procedure",
    title: "Admission Procedure",
    description:
      "Follow the step-by-step admission procedure for Aksharaa School Kathmandu, from campus visit to registration.",
  },
  {
    path: "/newsactivity",
    label: "News & Activities",
    title: "Aksharaa Highlights",
    description:
      "Explore Aksharaa Highlights, school activities, upcoming events, academic calendar, and long-term projects.",
  },
  {
    path: "/blog",
    label: "Blogs",
    title: "School Blogs",
    description:
      "Read Aksharaa School blog articles, education updates, school stories, and learning insights.",
  },
  {
    path: "/akshara-mun",
    label: "Aksharaa MUN",
    title: "Aksharaa MUN | Model United Nations",
    description:
      "Discover Aksharaa Model United Nations, a student leadership platform for diplomacy, debate, and global awareness.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact Us | Location, Phone & Inquiry",
    description:
      "Get in touch with Aksharaa School in Kandaghari, Kageshwori 9, Kathmandu. Call or send an inquiry online.",
  },
  {
    path: "/gallery",
    label: "Gallery",
    title: "Photo Gallery",
    description:
      "Browse Aksharaa School photo galleries featuring campus moments, events, activities, and student life.",
  },
  {
    path: "/downloads",
    label: "Download",
    title: "Downloads | Resources & Notices",
    description:
      "Download official Aksharaa School notices, forms, documents, and resources.",
  },
  {
    path: "/apply-online",
    label: "Apply Online",
    title: "Apply Online | Digital Admission Application Form",
    description:
      "Apply online for admission to Aksharaa School Kathmandu (Kindergarten to Grade 10). Complete your digital application form.",
    keywords:
      "Apply Online Aksharaa School, Aksharaa Admission Form, Online School Admission Kathmandu",
  },
  {
    path: "/getinquiry",
    label: "Get Enquiry",
    title: "Inquiry Form | Admission Inquiry & Fee Information",
    description:
      "Submit an admission enquiry to Aksharaa School Kathmandu. Learn more about our LRPA curriculum, facilities, transportation, and school fee structure.",
    keywords:
      "Aksharaa School Inquiry, School Admission Inquiry Kathmandu, Aksharaa Fee Structure",
  },
];

export const dynamicRouteSeo = [
  {
    match: (path) => path.startsWith("/infrastructure/"),
    title: "Infrastructure Details",
    description:
      "View details of Aksharaa School infrastructure and campus facilities.",
  },
  {
    match: (path) => path.startsWith("/newsactivity/longterm-project/"),
    title: "Long Term Project",
    description:
      "Read about Aksharaa School long-term student projects and experiential learning activities.",
  },
  {
    match: (path) => path.startsWith("/newsactivity/") || path.startsWith("/newsactivitycategory/"),
    title: "News & Activities",
    description:
      "Read the latest Aksharaa School news, activities, events, and learning updates.",
  },
  {
    match: (path) => path.startsWith("/gallery/"),
    title: "Gallery Album",
    description:
      "View an Aksharaa School gallery album with photos from school events, activities, and campus life.",
  },
  {
    match: (path) => path.startsWith("/blog/") || path.startsWith("/category/"),
    title: "School Blog",
    description:
      "Read Aksharaa School blog articles, education updates, and school stories.",
  },
];

export const navItems = [
  { type: "link", key: "home", path: "/", label: "Home" },
  {
    type: "dropdown",
    key: "about",
    label: "About Us",
    items: [
      { path: "/about", icon: "fa-solid fa-circle-info", label: "Introduction" },
      { path: "/infrastructure", icon: "fa-solid fa-building-columns", label: "Aksharaa Infrastructure" },
      { path: "/about-lrpa", icon: "fa-solid fa-lightbulb", label: "LRPA Approach" },
      { path: "/about-chairman", icon: "fa-solid fa-user-tie", label: "Message From Executive" },
      { path: "/about-team", icon: "fa-solid fa-users", label: "Team" },
    ],
  },
  {
    type: "dropdown",
    key: "academic",
    label: "Academic",
    items: [
      { path: "/academics-kindergarten", icon: "fa-solid fa-child", label: "Kindergarten" },
      { path: "/academics-elementary", icon: "fa-solid fa-school", label: "Elementary School" },
      { path: "/academics-middle", icon: "fa-solid fa-graduation-cap", label: "Middle School" },
      { path: "/academics-high", icon: "fa-solid fa-user-graduate", label: "Senior School" },
      { path: "/admission-policy", icon: "fa-solid fa-file-shield", label: "Admission Policy" },
      { path: "/admission-procedure", icon: "fa-solid fa-clipboard-list", label: "Admission Procedure" },
    ],
  },
  { type: "link", key: "newsactivity", path: "/newsactivity", label: "News & Activities" },
  { type: "link", key: "akshara-mun", path: "/akshara-mun", label: "Aksharaa MUN" },
  { type: "link", key: "contact", path: "/contact", label: "Contact" },
  {
    type: "dropdown",
    key: "more",
    label: "More Links",
    icon: "fa-solid fa-bars",
    items: [
      { path: "/gallery", icon: "fa-solid fa-photo-film", label: "Gallery" },
      { path: "/downloads", icon: "fa-solid fa-file-arrow-down", label: "Download" },
      { path: "/apply-online", icon: "fa-solid fa-pen-to-square", label: "Apply Online" },
    ],
  },
];

export function getRouteMeta(pathname) {
  return (
    routeSeo.find((route) => route.path === pathname) ||
    dynamicRouteSeo.find((route) => route.match(pathname)) ||
    null
  );
}
