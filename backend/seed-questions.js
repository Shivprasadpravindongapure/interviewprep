const mongoose = require('mongoose');
const Assessment = require('./models/Assessment');
require('dotenv').config();

const comprehensiveQuestions = {
  dsa: [
    {
      text: "What is the time complexity of binary search and why?",
      options: [
        "O(n) - Linear search",
        "O(log n) - Divides search space in half",
        "O(n²) - Nested loops",
        "O(1) - Constant time"
      ],
      correctAnswer: "O(log n) - Divides search space in half",
      explanation: "Binary search divides the search space in half each iteration, resulting in logarithmic time complexity.",
      difficulty: "easy",
      topic: "DSA",
      marks: 1
    },
    {
      text: "Which data structure is most suitable for implementing LIFO (Last In First Out) behavior?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: "Stack",
      explanation: "Stack is designed specifically for LIFO operations with push and pop methods.",
      difficulty: "easy",
      topic: "DSA",
      marks: 1
    },
    {
      text: "What is the difference between BFS and DFS?",
      options: [
        "BFS uses queue, DFS uses stack",
        "BFS uses stack, DFS uses queue",
        "Both use the same data structure",
        "BFS is recursive, DFS is iterative"
      ],
      correctAnswer: "BFS uses queue, DFS uses stack",
      explanation: "Breadth-First Search uses a queue to explore level by level, while Depth-First Search uses a stack (or recursion) to explore as deep as possible.",
      difficulty: "medium",
      topic: "DSA",
      marks: 2
    }
    {
      text: "What is the maximum number of nodes in a binary tree of height h?",
      options: ["2^h - 1", "2^h", "2^(h+1) - 1", "h^2"],
      correctAnswer: "2^(h+1) - 1",
      explanation: "A complete binary tree of height h has 2^(h+1) - 1 nodes (summing 2^0 + 2^1 + ... + 2^h).",
      difficulty: "medium",
      topic: "DSA",
      marks: 2
    },
    {
      text: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
      correctAnswer: "Quick Sort",
      explanation: "Quick Sort has O(n log n) average-case complexity, while the others are O(n²) in average case.",
      difficulty: "medium",
      topic: "DSA",
      marks: 2
    },
    {
      text: "What is a hash collision and how can it be resolved?",
      options: [
        "When two keys have the same hash value; resolved by chaining or open addressing",
        "When hash table is full; resolved by rehashing",
        "When hash function is slow; resolved by caching",
        "When keys are similar; resolved by sorting"
      ],
      correctAnswer: "When two keys have the same hash value; resolved by chaining or open addressing",
      explanation: "Hash collision occurs when different keys produce the same hash index. Common solutions include chaining (linked lists) and open addressing (probing).",
      difficulty: "hard",
      topic: "DSA",
      marks: 3
    }
  ],
  
  webDevelopment: [
    {
      text: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style Sheets", 
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: "Cascading Style Sheets",
      explanation: "CSS stands for Cascading Style Sheets, used for styling web pages.",
      difficulty: "easy",
      topic: "Web Development",
      marks: 1
    },
    {
      text: "Which HTML5 element is used for the main content of a document?",
      options: ["<main>", "<content>", "<body>", "<section>"],
      correctAnswer: "<main>",
      explanation: "The <main> element specifies the main content of a document, unique to the document.",
      difficulty: "easy",
      topic: "Web Development",
      marks: 1
    },
    {
      text: "What is the purpose of React.js?",
      options: [
        "Database management",
        "Server-side programming",
        "Building user interfaces",
        "Network communication"
      ],
      correctAnswer: "Building user interfaces",
      explanation: "React.js is a JavaScript library specifically designed for building user interfaces, particularly single-page applications.",
      difficulty: "medium",
      topic: "Web Development",
      marks: 2
    },
    {
      text: "What is the difference between let, const, and var in JavaScript?",
      options: [
        "let and const are block-scoped, var is function-scoped",
        "var is block-scoped, let and const are function-scoped",
        "All have the same scope",
        "let is for numbers, const for strings, var for objects"
      ],
      correctAnswer: "let and const are block-scoped, var is function-scoped",
      explanation: "let and const are block-scoped (limited to the nearest block), while var is function-scoped (limited to the nearest function).",
      difficulty: "medium",
      topic: "Web Development",
      marks: 2
    },
    {
      text: "What is the Virtual DOM in React?",
      options: [
        "A copy of the real DOM used for performance optimization",
        "A new HTML standard",
        "A database for React components",
        "A debugging tool for React"
      ],
      correctAnswer: "A copy of the real DOM used for performance optimization",
      explanation: "The Virtual DOM is a JavaScript representation of the real DOM that React uses to optimize rendering by minimizing direct DOM manipulations.",
      difficulty: "hard",
      topic: "Web Development",
      marks: 3
    }
  ],
  
  dbms: [
    {
      text: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "System Query Language"
      ],
      correctAnswer: "Structured Query Language",
      explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
      difficulty: "easy",
      topic: "DBMS",
      marks: 1
    },
    {
      text: "Which SQL command is used to retrieve data from a database?",
      options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
      correctAnswer: "SELECT",
      explanation: "The SELECT command is used to query and retrieve data from database tables.",
      difficulty: "easy",
      topic: "DBMS",
      marks: 1
    },
    {
      text: "What is a primary key in a database?",
      options: [
        "First column of a table",
        "Unique identifier for each record",
        "Most important field",
        "Foreign key reference"
      ],
      correctAnswer: "Unique identifier for each record",
      explanation: "A primary key is a constraint that uniquely identifies each record in a database table.",
      difficulty: "medium",
      topic: "DBMS",
      marks: 2
    },
    {
      text: "What is the difference between INNER JOIN and LEFT JOIN?",
      options: [
        "INNER JOIN returns matching records, LEFT JOIN returns all from left table",
        "INNER JOIN returns all records, LEFT JOIN returns matching records",
        "Both return the same results",
        "INNER JOIN is faster than LEFT JOIN"
      ],
      correctAnswer: "INNER JOIN returns matching records, LEFT JOIN returns all from left table",
      explanation: "INNER JOIN returns only rows where the join condition is met in both tables, while LEFT JOIN returns all rows from the left table and matched rows from the right table.",
      difficulty: "medium",
      topic: "DBMS",
      marks: 2
    },
    {
      text: "What is database normalization?",
      options: [
        "Process of organizing data to reduce redundancy",
        "Process of encrypting database",
        "Process of backing up database",
        "Process of compressing database"
      ],
      correctAnswer: "Process of organizing data to reduce redundancy",
      explanation: "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.",
      difficulty: "hard",
      topic: "DBMS",
      marks: 3
    }
  ],
  
  algorithms: [
    {
      text: "What is the purpose of Big O notation?",
      options: [
        "To measure exact runtime",
        "To describe algorithm complexity",
        "To count lines of code",
        "To optimize memory usage"
      ],
      correctAnswer: "To describe algorithm complexity",
      explanation: "Big O notation describes the upper bound of an algorithm's time or space complexity as input size grows.",
      difficulty: "medium",
      topic: "Algorithms",
      marks: 2
    },
    {
      text: "Which algorithm is used for finding the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra's", "Binary Search"],
      correctAnswer: "Dijkstra's",
      explanation: "Dijkstra's algorithm is specifically designed to find the shortest path between nodes in a weighted graph.",
      difficulty: "medium",
      topic: "Algorithms",
      marks: 2
    },
    {
      text: "What is dynamic programming?",
      options: [
        "Programming with variables",
        "Breaking complex problems into simpler subproblems",
        "Writing code dynamically",
        "Object-oriented programming"
      ],
      correctAnswer: "Breaking complex problems into simpler subproblems",
      explanation: "Dynamic programming is a method for solving complex problems by breaking them down into simpler overlapping subproblems.",
      difficulty: "hard",
      topic: "Algorithms",
      marks: 3
    }
  ],
  
  systemDesign: [
    {
      text: "What is a microservices architecture?",
      options: [
        "Single large application",
        "Collection of small independent services",
        "Database design pattern",
        "Frontend framework"
      ],
      correctAnswer: "Collection of small independent services",
      explanation: "Microservices architecture structures an application as a collection of small, independent services that communicate over APIs.",
      difficulty: "medium",
      topic: "System Design",
      marks: 2
    },
    {
      text: "What is the purpose of load balancing?",
      options: [
        "To encrypt data",
        "To distribute network traffic across servers",
        "To backup data",
        "To compress files"
      ],
      correctAnswer: "To distribute network traffic across servers",
      explanation: "Load balancing distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.",
      difficulty: "medium",
      topic: "System Design",
      marks: 2
    },
    {
      text: "What is CAP theorem in distributed systems?",
      options: [
        "Consistency, Availability, Partition tolerance",
        "Cache, API, Performance",
        "Code, Architecture, Protocol",
        "Client, Application, Protocol"
      ],
      correctAnswer: "Consistency, Availability, Partition tolerance",
      explanation: "CAP theorem states that a distributed system can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition tolerance.",
      difficulty: "hard",
      topic: "System Design",
      marks: 3
    }
  ]
};

const codingProblems = [
  {
    title: "Two Sum Problem",
    description: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
    difficulty: "easy",
    topic: "Algorithms",
    timeLimit: 30,
    testCases: [
      {
        input: "[2,7,11,15], 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9"
      },
      {
        input: "[3,2,4], 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6"
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
};`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
    },
    solution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
    }
  },
  {
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "medium",
    topic: "DSA",
    timeLimit: 25,
    testCases: [
      {
        input: "()",
        output: "true",
        explanation: "Valid parentheses"
      },
      {
        input: "()[]{}",
        output: "true",
        explanation: "All brackets are closed"
      },
      {
        input: "(]",
        output: "false",
        explanation: "Mismatched brackets"
      }
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your solution here
    
};`,
      python: `def is_valid(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    solution: {
      javascript: `function isValid(s) {
    const stack = [];
    const pairs = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
      python: `def is_valid(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        elif stack and pairs[stack.pop()] != char:
            return False
    
    return len(stack) == 0`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> pairs = Map.of(
            '(', ')',
            '[', ']',
            '{', '}'
        );
        
        for (char c : s.toCharArray()) {
            if (pairs.containsKey(c)) {
                stack.push(c);
            } else {
                if (stack.isEmpty() || pairs.get(stack.pop()) != c) {
                    return false;
                }
            }
        }
        
        return stack.isEmpty();
    }
}`
    }
  }
];

const interviewQuestions = [
  {
    type: "behavioral",
    question: "Tell me about a time when you faced a challenging technical problem and how you solved it.",
    followUp: [
      "What was the most difficult part?",
      "How did you approach the problem?",
      "What did you learn from this experience?"
    ],
    evaluationCriteria: [
      "Problem-solving approach",
      "Technical communication",
      "Learning mindset"
    ]
  },
  {
    type: "technical",
    question: "How would you design a URL shortening service like bit.ly?",
    followUp: [
      "What would be your database schema?",
      "How would you handle collisions?",
      "How would you ensure scalability?"
    ],
    evaluationCriteria: [
      "System design knowledge",
      "Scalability considerations",
      "Database design"
    ]
  },
  {
    type: "coding",
    question: "Can you implement a function to detect if a linked list has a cycle?",
    followUp: [
      "What's the time complexity?",
      "Can you solve it with O(1) space?",
      "What if the list is very large?"
    ],
    evaluationCriteria: [
      "Algorithm knowledge",
      "Code quality",
      "Optimization skills"
    ]
  }
];

async function seedComprehensiveDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing assessments
    await Assessment.deleteMany({});
    console.log('Cleared existing assessments');

    // Create MCQ Assessments
    const mcqAssessments = [
      {
        title: "DSA Fundamentals - Easy",
        type: "mcq",
        questions: comprehensiveQuestions.dsa.filter(q => q.difficulty === 'easy'),
        timeLimit: 15,
        difficulty: "easy",
        topics: ["DSA", "Algorithms", "Data Structures"],
        isActive: true
      },
      {
        title: "DSA Fundamentals - Medium",
        type: "mcq",
        questions: comprehensiveQuestions.dsa.filter(q => q.difficulty === 'medium'),
        timeLimit: 20,
        difficulty: "medium",
        topics: ["DSA", "Algorithms", "Data Structures"],
        isActive: true
      },
      {
        title: "DSA Fundamentals - Hard",
        type: "mcq",
        questions: comprehensiveQuestions.dsa.filter(q => q.difficulty === 'hard'),
        timeLimit: 25,
        difficulty: "hard",
        topics: ["DSA", "Algorithms", "Data Structures"],
        isActive: true
      },
      {
        title: "Web Development Essentials",
        type: "mcq",
        questions: comprehensiveQuestions.webDevelopment,
        timeLimit: 20,
        difficulty: "medium",
        topics: ["Web Development", "HTML", "CSS", "JavaScript", "React"],
        isActive: true
      },
      {
        title: "Database Management Systems",
        type: "mcq",
        questions: comprehensiveQuestions.dbms,
        timeLimit: 18,
        difficulty: "medium",
        topics: ["DBMS", "SQL", "Database Design"],
        isActive: true
      },
      {
        title: "Algorithms and Complexity",
        type: "mcq",
        questions: comprehensiveQuestions.algorithms,
        timeLimit: 22,
        difficulty: "hard",
        topics: ["Algorithms", "Complexity Analysis", "Problem Solving"],
        isActive: true
      },
      {
        title: "System Design Basics",
        type: "mcq",
        questions: comprehensiveQuestions.systemDesign,
        timeLimit: 25,
        difficulty: "hard",
        topics: ["System Design", "Architecture", "Scalability"],
        isActive: true
      },
      {
        title: "Complete Technical Assessment",
        type: "mcq",
        questions: [
          ...comprehensiveQuestions.dsa.slice(0, 4),
          ...comprehensiveQuestions.webDevelopment.slice(0, 3),
          ...comprehensiveQuestions.dbms.slice(0, 3),
          ...comprehensiveQuestions.algorithms.slice(0, 2)
        ],
        timeLimit: 45,
        difficulty: "medium",
        topics: ["DSA", "Web Development", "DBMS", "Algorithms"],
        isActive: true
      }
    ];

    // Create Coding Assessments
    const codingAssessments = codingProblems.map((problem, index) => ({
      title: problem.title,
      type: "coding",
      questions: [{
        text: problem.description,
        difficulty: problem.difficulty,
        topic: problem.topic,
        marks: problem.difficulty === 'easy' ? 10 : problem.difficulty === 'medium' ? 20 : 30,
        testCases: problem.testCases,
        starterCode: problem.starterCode,
        solution: problem.solution
      }],
      timeLimit: problem.timeLimit,
      difficulty: problem.difficulty,
      topics: [problem.topic],
      isActive: true
    }));

    // Create Interview Assessments
    const interviewAssessments = [
      {
        title: "Technical Interview - DSA Focus",
        type: "interview",
        questions: interviewQuestions.filter(q => q.type === 'coding' || q.type === 'technical'),
        timeLimit: 45,
        difficulty: "medium",
        topics: ["Technical Interview", "DSA", "Problem Solving"],
        isActive: true
      },
      {
        title: "Behavioral Interview",
        type: "interview",
        questions: interviewQuestions.filter(q => q.type === 'behavioral'),
        timeLimit: 30,
        difficulty: "easy",
        topics: ["Behavioral Interview", "Communication"],
        isActive: true
      },
      {
        title: "Complete Mock Interview",
        type: "interview",
        questions: interviewQuestions,
        timeLimit: 60,
        difficulty: "medium",
        topics: ["Technical Interview", "Behavioral Interview", "System Design"],
        isActive: true
      }
    ];

    // Insert all assessments
    await Assessment.insertMany([...mcqAssessments, ...codingAssessments, ...interviewAssessments]);
    console.log('Comprehensive assessments created successfully!');

    console.log('\n=== Database Summary ===');
    console.log(`MCQ Assessments: ${mcqAssessments.length}`);
    console.log(`Coding Assessments: ${codingAssessments.length}`);
    console.log(`Interview Assessments: ${interviewAssessments.length}`);
    console.log(`Total Questions: ${mcqAssessments.reduce((sum, a) => sum + a.questions.length, 0)}`);
    console.log('========================\n');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedComprehensiveDatabase();
