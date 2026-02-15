import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">🚀 EcoSense Prep</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600">Success Stories</a>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ace Your Dream Company Interview
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice with real questions, get AI feedback, and join a community of 10,000+ students 
            who landed their dream jobs at Google, Microsoft, Amazon, and more.
          </p>
          
          {/* User Type Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Journey</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Student Card */}
              <Link
                to="/login/student"
                className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold mb-3">Student</h3>
                <p className="text-blue-100 mb-6">
                  Practice MCQs, coding challenges, and mock interviews tailored for your target companies.
                </p>
                <ul className="space-y-2 text-blue-100 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    1000+ Real Interview Questions
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    AI-Powered Feedback
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Progress Tracking
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Resume Builder
                  </li>
                </ul>
                <div className="bg-white text-blue-600 rounded-lg py-3 px-6 text-center font-semibold group-hover:bg-blue-50 transition-colors">
                  Get Started Free →
                </div>
              </Link>

              {/* Admin Card */}
              <Link
                to="/login/admin"
                className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold mb-3">Admin</h3>
                <p className="text-purple-100 mb-6">
                  Manage content, track student progress, and monitor platform performance.
                </p>
                <ul className="space-y-2 text-purple-100 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Content Management
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    User Analytics
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Assessment Tools
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Security Monitoring
                  </li>
                </ul>
                <div className="bg-white text-purple-600 rounded-lg py-3 px-6 text-center font-semibold group-hover:bg-purple-50 transition-colors">
                  Admin Portal →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Succeed
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3">MCQ Practice</h3>
              <p className="text-gray-600">
                1000+ questions covering DSA, Web Development, DBMS, and more with instant feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3">Coding Challenges</h3>
              <p className="text-gray-600">
                Real coding problems from top companies with automated testing and AI review.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
              <p className="text-gray-600">
                Practice with AI interviewers that simulate real interview experiences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
              <p className="text-gray-600">
                Detailed insights into your strengths and weaknesses with personalized recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-3">Resume Builder</h3>
              <p className="text-gray-600">
                AI-powered resume builder with QR code verification for recruiters.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-gray-600">
                Connect with peers, join study groups, and get referrals from alumni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account and set your goals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Practice</h3>
              <p className="text-gray-600">Take assessments and get instant feedback</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Improve</h3>
              <p className="text-gray-600">Focus on weak areas with personalized recommendations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-bold mb-2">Succeed</h3>
              <p className="text-gray-600">Land your dream job with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold">Amit Kumar</h4>
                  <p className="text-gray-600 text-sm">Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-700">
                "EcoSense Prep helped me crack Google's interview. The AI mock interviews were game-changers!"
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  P
                </div>
                <div>
                  <h4 className="font-bold">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm">Frontend Developer at Microsoft</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The coding challenges and progress tracking kept me motivated. Landed my dream job in 3 months!"
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-bold">Rahul Verma</h4>
                  <p className="text-gray-600 text-sm">SDE at Amazon</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The community support and referral network helped me get noticed by top recruiters."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚀 EcoSense Prep</h3>
              <p className="text-gray-400">
                Your pathway to dream companies starts here.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoSense Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
