export interface Course {
  id: string;
  name: string;
  category: "IT" | "Civil";
  duration: string;
  fees: string;
  description: string;
  syllabus: string[];
  projects: string[];
  certifications: string[];
  careerOpportunities: string[];
}

export const courses: Course[] = [
  {
    id: "java-fullstack",
    name: "Java Full Stack",
    category: "IT",
    duration: "6 Months",
    fees: "₹45,000",
    description: "Master full-stack Java development with Spring Boot, Hibernate, and modern frontend frameworks.",
    syllabus: [
      "Core Java & OOP Concepts",
      "Advanced Java (Collections, Multithreading)",
      "JDBC & Database Connectivity",
      "Servlets & JSP",
      "Spring Framework & Spring Boot",
      "Hibernate & JPA",
      "RESTful Web Services",
      "React.js Fundamentals",
      "MySQL Database"
    ],
    projects: [
      "E-commerce Platform",
      "Banking Management System",
      "Social Media Application",
      "Online Learning Portal"
    ],
    certifications: ["Java Full Stack Developer Certificate", "Industry Project Completion Certificate"],
    careerOpportunities: [
      "Java Full Stack Developer",
      "Backend Developer",
      "Software Engineer",
      "Application Developer"
    ]
  },
  {
    id: "python",
    name: "Python Programming",
    category: "IT",
    duration: "4 Months",
    fees: "₹35,000",
    description: "Learn Python from basics to advanced including Django, Flask, and data science libraries.",
    syllabus: [
      "Python Basics & Syntax",
      "Data Structures in Python",
      "Object-Oriented Programming",
      "File Handling & Exception Handling",
      "Django Framework",
      "Flask Framework",
      "Database Integration (SQLite, PostgreSQL)",
      "RESTful APIs with Python",
      "Introduction to Data Science Libraries"
    ],
    projects: [
      "Content Management System",
      "REST API Development",
      "Web Scraping Application",
      "Data Analysis Dashboard"
    ],
    certifications: ["Python Developer Certificate", "Django Framework Specialist"],
    careerOpportunities: [
      "Python Developer",
      "Backend Engineer",
      "Data Analyst",
      "Django Developer"
    ]
  },
  {
    id: "web-development",
    name: "Web Development",
    category: "IT",
    duration: "5 Months",
    fees: "₹40,000",
    description: "Complete web development training covering HTML, CSS, JavaScript, React, and Node.js.",
    syllabus: [
      "HTML5 & Semantic Markup",
      "CSS3 & Responsive Design",
      "JavaScript ES6+",
      "Bootstrap & Tailwind CSS",
      "React.js & Component Architecture",
      "State Management (Redux)",
      "Node.js & Express.js",
      "MongoDB Database",
      "Git & Version Control"
    ],
    projects: [
      "Portfolio Website",
      "E-commerce Frontend",
      "Task Management App",
      "Real-time Chat Application"
    ],
    certifications: ["Full Stack Web Developer Certificate", "React Developer Certificate"],
    careerOpportunities: [
      "Frontend Developer",
      "Full Stack Developer",
      "UI Developer",
      "Web Application Developer"
    ]
  },
  {
    id: "sql-dbms",
    name: "SQL & DBMS",
    category: "IT",
    duration: "3 Months",
    fees: "₹25,000",
    description: "Comprehensive database management training with SQL, MySQL, and database design.",
    syllabus: [
      "Database Fundamentals",
      "SQL Basics & Advanced Queries",
      "MySQL Database Administration",
      "Database Design & Normalization",
      "Stored Procedures & Triggers",
      "Indexing & Query Optimization",
      "Database Security",
      "Backup & Recovery",
      "NoSQL Introduction"
    ],
    projects: [
      "Library Management Database",
      "Hospital Management System Database",
      "Inventory Management System",
      "HR Management Database"
    ],
    certifications: ["Database Administrator Certificate", "SQL Expert Certificate"],
    careerOpportunities: [
      "Database Administrator",
      "SQL Developer",
      "Data Analyst",
      "Backend Developer"
    ]
  },
  {
    id: "computer-basics",
    name: "Computer Basics",
    category: "IT",
    duration: "2 Months",
    fees: "₹15,000",
    description: "Foundational computer skills including MS Office, internet, and digital literacy.",
    syllabus: [
      "Computer Fundamentals",
      "Operating Systems Basics",
      "MS Word (Document Creation & Formatting)",
      "MS Excel (Formulas, Charts, Pivot Tables)",
      "MS PowerPoint (Presentations)",
      "Internet & Email Usage",
      "File Management",
      "Typing Skills",
      "Digital Safety & Security"
    ],
    projects: [
      "Professional Resume Creation",
      "Data Analysis in Excel",
      "Business Presentation",
      "Document Templates Design"
    ],
    certifications: ["Computer Literacy Certificate", "MS Office Specialist"],
    careerOpportunities: [
      "Data Entry Operator",
      "Office Administrator",
      "Computer Operator",
      "Document Specialist"
    ]
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    category: "IT",
    duration: "6 Months",
    fees: "₹55,000",
    description: "Advanced course covering artificial intelligence, machine learning, and deep learning.",
    syllabus: [
      "Python for AI/ML",
      "Mathematics for ML (Linear Algebra, Statistics)",
      "Machine Learning Fundamentals",
      "Supervised & Unsupervised Learning",
      "Deep Learning & Neural Networks",
      "TensorFlow & Keras",
      "Natural Language Processing",
      "Computer Vision Basics",
      "Model Deployment"
    ],
    projects: [
      "Image Classification System",
      "Sentiment Analysis Tool",
      "Recommendation System",
      "Chatbot Development"
    ],
    certifications: ["AI/ML Professional Certificate", "Deep Learning Specialist"],
    careerOpportunities: [
      "Machine Learning Engineer",
      "AI Developer",
      "Data Scientist",
      "Research Analyst"
    ]
  },
  {
    id: "autocad",
    name: "AutoCAD 2D/3D",
    category: "Civil",
    duration: "4 Months",
    fees: "₹30,000",
    description: "Complete AutoCAD training for 2D drafting and 3D modeling in civil engineering.",
    syllabus: [
      "AutoCAD Interface & Setup",
      "2D Drawing & Editing Tools",
      "Layer Management",
      "Dimensioning & Annotations",
      "Blocks & Dynamic Blocks",
      "3D Modeling Fundamentals",
      "3D Solid Modeling",
      "Rendering & Visualization",
      "Layout & Plotting"
    ],
    projects: [
      "Building Floor Plan",
      "Site Plan Development",
      "3D House Model",
      "Construction Details Drawing"
    ],
    certifications: ["AutoCAD Professional Certificate", "Autodesk Certified User"],
    careerOpportunities: [
      "CAD Technician",
      "Draftsman",
      "Design Engineer",
      "CAD Operator"
    ]
  },
  {
    id: "staad-pro",
    name: "STAAD Pro",
    category: "Civil",
    duration: "3 Months",
    fees: "₹35,000",
    description: "Structural analysis and design software training for civil engineers.",
    syllabus: [
      "STAAD.Pro Interface",
      "Structural Modeling",
      "Load Calculations & Application",
      "Structural Analysis Techniques",
      "Steel Structure Design",
      "Concrete Structure Design",
      "Foundation Design",
      "Wind & Seismic Analysis",
      "Report Generation"
    ],
    projects: [
      "Multi-storey Building Analysis",
      "Steel Frame Structure Design",
      "Bridge Analysis",
      "Foundation Design Project"
    ],
    certifications: ["STAAD.Pro Professional Certificate", "Structural Design Specialist"],
    careerOpportunities: [
      "Structural Engineer",
      "Design Engineer",
      "Structural Analyst",
      "Civil Design Consultant"
    ]
  },
  {
    id: "revit",
    name: "Revit Architecture",
    category: "Civil",
    duration: "4 Months",
    fees: "₹40,000",
    description: "BIM software training for architectural design and building information modeling.",
    syllabus: [
      "Revit Fundamentals",
      "BIM Concepts",
      "Architectural Modeling",
      "Walls, Doors, Windows",
      "Floors, Roofs, Ceilings",
      "Stairs & Railings",
      "Families & Components",
      "Rendering & Visualization",
      "Construction Documentation"
    ],
    projects: [
      "Residential Building Model",
      "Commercial Complex Design",
      "Interior Space Design",
      "Construction Drawing Set"
    ],
    certifications: ["Revit Architecture Professional", "BIM Specialist Certificate"],
    careerOpportunities: [
      "BIM Modeler",
      "Revit Technician",
      "Architectural Designer",
      "BIM Coordinator"
    ]
  },
  {
    id: "sketchup",
    name: "SketchUp",
    category: "Civil",
    duration: "2 Months",
    fees: "₹20,000",
    description: "3D modeling software for architectural and interior design visualization.",
    syllabus: [
      "SketchUp Interface & Tools",
      "3D Modeling Basics",
      "Advanced Modeling Techniques",
      "Components & Groups",
      "Materials & Textures",
      "Plugins & Extensions",
      "V-Ray Rendering",
      "Animation Basics",
      "Layout & Presentation"
    ],
    projects: [
      "House Exterior Design",
      "Interior Space Modeling",
      "Landscape Design",
      "Urban Planning Model"
    ],
    certifications: ["SketchUp Professional Certificate", "3D Visualization Specialist"],
    careerOpportunities: [
      "3D Visualizer",
      "Architectural Designer",
      "Interior Designer",
      "Concept Artist"
    ]
  },
  {
    id: "3ds-max",
    name: "3ds Max",
    category: "Civil",
    duration: "5 Months",
    fees: "₹45,000",
    description: "Professional 3D modeling, animation, and rendering for architectural visualization.",
    syllabus: [
      "3ds Max Interface",
      "Modeling Techniques",
      "Polygon & NURBS Modeling",
      "Modifier Stack",
      "Materials & Texturing",
      "Lighting Techniques",
      "V-Ray Rendering",
      "Animation Basics",
      "Post-Production"
    ],
    projects: [
      "Photorealistic Building Visualization",
      "Interior Walkthrough",
      "Product Visualization",
      "Architectural Animation"
    ],
    certifications: ["3ds Max Professional Certificate", "Architectural Visualization Expert"],
    careerOpportunities: [
      "3D Artist",
      "Visualization Specialist",
      "Animation Artist",
      "Rendering Specialist"
    ]
  },
  {
    id: "civil-3d",
    name: "Civil 3D",
    category: "Civil",
    duration: "4 Months",
    fees: "₹38,000",
    description: "Civil engineering design software for infrastructure and site development projects.",
    syllabus: [
      "Civil 3D Fundamentals",
      "Survey Data Management",
      "Surface Creation & Analysis",
      "Alignment Design",
      "Profile & Section Design",
      "Corridor Modeling",
      "Grading & Site Design",
      "Pipe Networks",
      "Quantity Takeoff"
    ],
    projects: [
      "Highway Alignment Design",
      "Site Grading Project",
      "Drainage System Design",
      "Land Development Plan"
    ],
    certifications: ["Civil 3D Professional Certificate", "Infrastructure Design Specialist"],
    careerOpportunities: [
      "Civil Designer",
      "Infrastructure Engineer",
      "Site Development Engineer",
      "Highway Design Engineer"
    ]

  },
{
  id: "autocad-2d",
  name: "AutoCAD 2D",
  category: "Civil",
  duration: "2 Months",
  fees: "₹18,000",
  description: "Focused training on 2D drafting using AutoCAD for civil and architectural drawings.",
  syllabus: [
    "AutoCAD Interface & Setup",
    "Drawing Tools (Line, Circle, Arc)",
    "Modify Tools (Trim, Extend, Offset)",
    "Layer Management",
    "Dimensioning Techniques",
    "Text & Annotations",
    "Blocks & Symbols",
    "Layouts & Plotting",
    "Construction Drawings"
  ],
  projects: [
    "Residential Floor Plan",
    "Column Layout Plan",
    "Electrical Layout Drawing",
    "Submission Drawing Set"
  ],
  certifications: [
    "AutoCAD 2D Drafting Certificate"
  ],
  careerOpportunities: [
    "CAD Draftsman",
    "2D Design Technician",
    "Site Drafting Engineer",
    "Drawing Coordinator"
  ]
},


{
  id: "ms-excel",
  name: "MS Excel",
  category: "Civil",
  duration: "2 Months",
  fees: "₹12,000",
  description: "Comprehensive Microsoft Excel training from basics to advanced data analysis.",
  syllabus: [
    "Excel Interface & Basics",
    "Data Entry & Formatting",
    "Formulas & Functions",
    "Logical Functions (IF, VLOOKUP)",
    "Charts & Graphs",
    "Pivot Tables",
    "Conditional Formatting",
    "Data Validation",
    "Dashboard Creation"
  ],
  projects: [
    "Sales Report Dashboard",
    "Student Database System",
    "Expense Tracker",
    "Inventory Management Sheet"
  ],
  certifications: [
    "MS Excel Specialist Certificate"
  ],
  careerOpportunities: [
    "Data Entry Operator",
    "MIS Executive",
    "Office Administrator",
    "Data Analyst (Entry Level)"
  ]
},

{
  id: "estimation-costing-excel",
  name: "Estimation & Costing (Excel)",
  category: "Civil",
  duration: "3 Months",
  fees: "₹22,000",
  description: "Learn civil project estimation, BOQ preparation, and costing using Microsoft Excel.",
  syllabus: [
    "Introduction to Estimation",
    "Types of Estimates",
    "BOQ Preparation",
    "Material Quantity Calculation",
    "Rate Analysis",
    "Labour Cost Calculation",
    "Excel Formulas for Estimation",
    "Project Costing Sheets",
    "Tender Documentation"
  ],
  projects: [
    "Residential Building Estimation",
    "Road Project Costing",
    "BOQ Sheet Preparation",
    "Tender Cost Analysis"
  ],
  certifications: [
    "Estimation & Costing Professional Certificate"
  ],
  careerOpportunities: [
    "Estimation Engineer",
    "Quantity Surveyor",
    "Billing Engineer",
    "Cost Control Engineer"
  ]
},

];
