const mongoose = require('mongoose');
const Assessment = require('./models/Assessment');
require('dotenv').config();

const simpleAssessments = [
  {
    title: 'JavaScript Fundamentals',
    type: 'mcq',
    questions: [
      {
        text: 'What is the output of: console.log(typeof null)',
        options: ['null', 'object', 'undefined', 'number'],
        correctAnswer: 'object',
        explanation: 'typeof null returns "object" - this is a known JavaScript quirk',
        difficulty: 'easy',
        topic: 'JavaScript',
        marks: 1
      },
      {
        text: 'Which method removes the last element from an array?',
        options: ['shift()', 'pop()', 'push()', 'unshift()'],
        correctAnswer: 'pop()',
        explanation: 'pop() removes the last element from an array',
        difficulty: 'easy',
        topic: 'JavaScript',
        marks: 1
      },
      {
        text: 'What does "===" mean in JavaScript?',
        options: ['Assignment', 'Equality with type checking', 'Equality without type checking', 'Comparison'],
        correctAnswer: 'Equality with type checking',
        explanation: '=== checks both value and type, while == checks only value',
        difficulty: 'easy',
        topic: 'JavaScript',
        marks: 1
      }
    ],
    timeLimit: 15,
    difficulty: 'easy',
    topics: ['JavaScript'],
    isActive: true
  },
  {
    title: 'React Basics',
    type: 'mcq',
    questions: [
      {
        text: 'What hook is used to manage state in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useState',
        explanation: 'useState is the hook used to add state to functional components',
        difficulty: 'easy',
        topic: 'React',
        marks: 1
      },
      {
        text: 'What is the purpose of useEffect?',
        options: ['To render components', 'To handle side effects', 'To manage state', 'To create context'],
        correctAnswer: 'To handle side effects',
        explanation: 'useEffect is used to perform side effects in functional components',
        difficulty: 'medium',
        topic: 'React',
        marks: 2
      },
      {
        text: 'How do you pass data from parent to child component?',
        options: ['Using state', 'Using props', 'Using context', 'Using hooks'],
        correctAnswer: 'Using props',
        explanation: 'Props are used to pass data from parent to child components',
        difficulty: 'easy',
        topic: 'React',
        marks: 1
      }
    ],
    timeLimit: 20,
    difficulty: 'easy',
    topics: ['React'],
    isActive: true
  },
  {
    title: 'CSS Fundamentals',
    type: 'mcq',
    questions: [
      {
        text: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
        explanation: 'CSS stands for Cascading Style Sheets',
        difficulty: 'easy',
        topic: 'CSS',
        marks: 1
      },
      {
        text: 'Which property is used to change the background color?',
        options: ['color', 'background-color', 'bgcolor', 'background'],
        correctAnswer: 'background-color',
        explanation: 'background-color property is used to set the background color of an element',
        difficulty: 'easy',
        topic: 'CSS',
        marks: 1
      },
      {
        text: 'What does "display: flex" do?',
        options: ['Makes element invisible', 'Makes element flexible container', 'Makes element inline', 'Makes element block'],
        correctAnswer: 'Makes element flexible container',
        explanation: 'display: flex makes the element a flex container',
        difficulty: 'medium',
        topic: 'CSS',
        marks: 2
      }
    ],
    timeLimit: 15,
    difficulty: 'easy',
    topics: ['CSS'],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing assessments
    await Assessment.deleteMany({});
    console.log('🗑️ Cleared existing assessments');

    // Insert sample assessments
    const result = await Assessment.insertMany(simpleAssessments);
    console.log(`✅ Seeded ${result.length} assessments`);
    console.log('📚 Available assessments:');
    result.forEach((assessment, index) => {
      console.log(`  ${index + 1}. ${assessment.title} (${assessment.questions.length} questions)`);
    });

    await mongoose.disconnect();
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
