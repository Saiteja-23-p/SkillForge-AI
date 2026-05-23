export const learningTracks = [
  {
    id: 'fundamentals',
    title: 'Programming Fundamentals',
    description: 'Master the basics of coding with core programming concepts and problem-solving techniques.',
    icon: 'Terminal',
    color: '#0ea5e9',
    modules: [
      'Introduction to Programming', 'Variables and Data Types', 'Conditional Statements', 
      'Loops and Iterations', 'Functions and Modular Programming', 'Arrays and Strings', 
      'Recursion Basics', 'Debugging and Problem Solving'
    ]
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Learn to write efficient and optimized code using advanced data structures and algorithm design.',
    icon: 'Network',
    color: '#8b5cf6',
    modules: [
      'Time and Space Complexity', 'Arrays and Strings', 'Linked Lists', 'Stacks and Queues',
      'Hash Tables', 'Recursion', 'Trees and Binary Trees', 'Binary Search Trees', 'Graphs',
      'Sorting Algorithms', 'Searching Algorithms', 'Dynamic Programming', 'Greedy Algorithms',
      'Backtracking', 'Sliding Window Technique', 'Two Pointer Technique'
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Web Development',
    description: 'Build modern, responsive, and interactive user interfaces with HTML, CSS, JavaScript, and React.',
    icon: 'Layout',
    color: '#f43f5e',
    modules: [
      'HTML Fundamentals', 'CSS Basics', 'Flexbox and Grid', 'Responsive Design', 
      'JavaScript Fundamentals', 'DOM Manipulation', 'ES6 Features', 'Asynchronous JavaScript', 
      'API Integration', 'React Basics', 'React Hooks', 'State Management', 'Next.js Basics', 'Tailwind CSS'
    ]
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Create robust server-side applications and APIs using Node.js and Express.',
    icon: 'Server',
    color: '#10b981',
    modules: [
      'Backend Fundamentals', 'Node.js Basics', 'Express.js', 'REST API Development', 
      'Authentication and Authorization', 'Middleware', 'Error Handling', 'API Security', 
      'Microservices Basics', 'GraphQL APIs'
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Store and manage data efficiently using relational and non-relational database systems.',
    icon: 'Database',
    color: '#f59e0b',
    modules: [
      'Database Fundamentals', 'SQL Basics', 'Joins and Relationships', 'Indexing and Optimization', 
      'Transactions', 'MongoDB', 'NoSQL Databases', 'Data Modeling', 'ORM Tools'
    ]
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Architect scalable and highly available distributed systems for massive user bases.',
    icon: 'Cpu',
    color: '#6366f1',
    modules: [
      'System Design Fundamentals', 'Scalability Concepts', 'Load Balancing', 'Caching Strategies', 
      'Database Scaling', 'Microservices Architecture', 'Message Queues', 'Rate Limiting', 
      'Designing Large Systems (Instagram, WhatsApp, Netflix)'
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Deployment',
    description: 'Automate deployments, manage infrastructure, and ensure application reliability.',
    icon: 'Cloud',
    color: '#ec4899',
    modules: [
      'Git and GitHub', 'Version Control Workflows', 'CI/CD Pipelines', 'Docker Containers', 
      'Kubernetes Basics', 'Cloud Computing (AWS / GCP / Azure)', 'Application Deployment', 'Monitoring and Logging'
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Dive into the world of artificial intelligence to build smart, predictive systems.',
    icon: 'Brain',
    color: '#14b8a6',
    modules: [
      'AI Fundamentals', 'Machine Learning Basics', 'Supervised Learning', 'Unsupervised Learning', 
      'Neural Networks', 'Deep Learning Basics', 'Natural Language Processing', 'AI APIs and Integrations', 'AI Mini Projects'
    ]
  },
  {
    id: 'projects',
    title: 'Project-Based Learning',
    description: 'Apply your skills by building complete, real-world full-stack applications.',
    icon: 'Briefcase',
    color: '#eab308',
    modules: [
      'Personal Portfolio Website', 'Blog Platform', 'Chat Application', 'Task Manager App', 
      'E-commerce Website', 'AI Chatbot', 'Social Media Mini App', 'URL Shortener', 'Full Stack SaaS Application'
    ]
  },
  {
    id: 'interview',
    title: 'Interview Preparation',
    description: 'Ace your technical and behavioral interviews with structured preparation.',
    icon: 'Users',
    color: '#8b5cf6',
    modules: [
      'Resume Building', 'Behavioral Interview Questions', 'Data Structures Interview Questions', 
      'System Design Interviews', 'Coding Interview Practice', 'HR Interview Preparation', 'Company Specific Questions'
    ]
  }
];

// Helper to generate generic steps for any given module
export const generateModuleSteps = (moduleTitle, isProject = false) => {
  if (isProject) {
    return [
      { id: 1, title: 'Project Overview', duration: '10 mins', content: { type: 'article', description: `Overview of building the ${moduleTitle}. We will define the scope and features.` } },
      { id: 2, title: 'Architecture Explanation', duration: '15 mins', content: { type: 'video', description: 'System design and component breakdown.', videoTitle: 'Architecture Overview' } },
      { id: 3, title: 'Development Steps', duration: '60 mins', content: { type: 'practice', description: 'Step-by-step implementation guide.' } },
      { id: 4, title: 'AI Mentor Guidance', duration: '20 mins', content: { type: 'article', description: 'Best practices and code review tips from the AI.' } },
      { id: 5, title: 'Deployment Instructions', duration: '15 mins', content: { type: 'article', description: 'How to deploy the application to production.' } }
    ];
  }

  return [
    { id: 1, title: 'Introduction', duration: '5 mins', content: { type: 'video', description: `Introduction to ${moduleTitle}.`, videoTitle: `Understanding ${moduleTitle}` } },
    { id: 2, title: 'Concept Explanation', duration: '15 mins', content: { type: 'article', description: `Deep dive into the core concepts of ${moduleTitle}.`, codeSnippet: '// Concept example code here' } },
    { id: 3, title: 'Code Examples', duration: '10 mins', content: { type: 'article', description: 'Practical examples and use cases.', codeSnippet: 'function example() { return true; }' } },
    { id: 4, title: 'Interactive Practice', duration: '20 mins', content: { type: 'practice', description: 'Use the AI chatbot to practice what you learned.' } },
    { id: 5, title: 'Mini Project', duration: '30 mins', content: { type: 'practice', description: `Build a small feature using ${moduleTitle} concepts.` } },
    { id: 6, title: 'Module Quiz', duration: '10 mins', content: { type: 'quiz', description: 'Test your understanding with a quick quiz.' } }
  ];
};
