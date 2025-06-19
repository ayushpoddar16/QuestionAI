import { useState, useEffect } from "react";
import {
  Brain,
  Users,
  FileText,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Upload,
  Search,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Zap,
  Database,
  Bot,
  Menu,
  X,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Globe,
  BookMarked,
} from "lucide-react";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle protected route clicks
  const handleProtectedRoute = (route) => {
    if (!isAuthenticated) {
      // Store the intended destination
      localStorage.setItem("redirectAfterLogin", route);
      window.location.href = "/login";
    } else {
      window.location.href = route;
    }
  };

  // Handle authentication-aware navigation
  const handleAuthNavigation = (route) => {
    if (
      route === "/text-extractor" ||
      route === "/ai-assistant" ||
      route === "/dashboard"
    ) {
      handleProtectedRoute(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QuestionAI</h1>
                <p className="text-xs text-gray-500">Smart Question Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {user?.name || "User"}
                  </span>
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="px-3 py-2 rounded-md text-md bg-gray-200 font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setIsAuthenticated(false);
                      setUser(null);
                      window.location.reload();
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Upload Question Papers,
            <span className="block text-blue-700 to-blue-600">
              Ask AI Anything
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your study experience with AI-powered question analysis.
            Upload question papers from any branch and get instant answers,
            explanations, and practice questions tailored to your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() =>
                handleAuthNavigation(isAuthenticated ? "/dashboard" : "/login")
              }
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isAuthenticated ? "Start Using AI" : "Start Learning with AI"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => handleAuthNavigation("/text-extractor")}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
            >
              <Upload className="mr-2 w-5 h-5" />
              Upload Question Paper
            </button>
          </div>

          {/* Auth Status Alert */}
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> You need to sign in to access the AI
                features and upload question papers.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Question Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary platform that combines question paper management
              with advanced AI to enhance your learning experience.
            </p>
          </div>

          {/* Centered grid with only 2 cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {/* Multi-Branch Support */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  Multi-Branch Coverage
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  Upload question papers from different branches Computer
                  Science, Mechanical, Civil, Electronics, and 20+ other
                  academic branches.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Engineering (CSE, ECE, Mechanical, Civil, and more)
                  </li>
                </ul>
              </div>

              {/* AI Question Analysis */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  AI Question Assistant
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  Ask our AI anything about uploaded question papers and get
                  instant, detailed explanations and solutions.
                </p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Upload</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Ask AI</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Get Answer</span>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => handleAuthNavigation("/dashboard")}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Try AI Assistant
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Experience AI-Powered Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how QuestionAI transforms traditional question papers into
              interactive learning experiences.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Features Side */}
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  What you can ask AI:
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        "Explain this question in detail"
                      </h4>
                      <p className="text-gray-600">
                        Get comprehensive explanations for any question
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        "Show similar questions"
                      </h4>
                      <p className="text-gray-600">
                        Find related questions for better practice
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        "Generate practice questions"
                      </h4>
                      <p className="text-gray-600">
                        Create custom questions based on topics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        "What's the difficulty level?"
                      </h4>
                      <p className="text-gray-600">
                        Analyze question complexity and requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() =>
                      handleAuthNavigation(
                        isAuthenticated ? "/dashboard" : "/login"
                      )
                    }
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    {isAuthenticated ? "Try QuestionAI Now" : "Sign In to Try"}
                  </button>
                </div>
              </div>

              {/* Demo Chat Interface */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        <Bot className="w-6 h-6" />
                        <div>
                          <h4 className="font-semibold">
                            QuestionAI Assistant
                          </h4>
                          <p className="text-sm opacity-90">
                            {isAuthenticated
                              ? "Ready to help with your questions"
                              : "Sign in to start chatting"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-4 h-64 overflow-y-auto">
                      {isAuthenticated ? (
                        <>
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                              <p className="text-sm text-gray-800">
                                Hello! I've analyzed your uploaded question
                                paper. What would you like to know?
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <div className="bg-purple-600 text-white rounded-lg p-3 max-w-xs">
                              <p className="text-sm">
                                Explain question 5 from the calculus section
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                              <p className="text-sm text-gray-800">
                                Question 5 involves integration by parts. Here's
                                the step-by-step solution...
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Bot className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">
                              Sign in to start using AI
                            </p>
                            <button
                              onClick={() => (window.location.href = "/login")}
                              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Sign In Now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder={
                            isAuthenticated
                              ? "Ask about any question..."
                              : "Sign in to chat with AI"
                          }
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          disabled={!isAuthenticated}
                          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Supported Academic Branches
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QuestionAI supports question papers from all major academic
              disciplines and universities.
            </p>
          </div>

          {/* Centered grid container */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
              {[
                { name: "Computer Science", icon: "💻", count: "12,500+" },
                { name: "Electronics", icon: "⚡", count: "8,200+" },
                { name: "Mechanical", icon: "⚙️", count: "9,800+" },
                { name: "Civil", icon: "🏗️", count: "7,600+" },
              ].map((branch, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
                >
                  <div className="text-3xl mb-3">{branch.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-center">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {branch.count} papers
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Revolutionize Your Study Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already using QuestionAI to master their
            subjects with AI-powered assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                handleAuthNavigation(isAuthenticated ? "/dashboard" : "/login")
              }
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Brain className="mr-2 w-5 h-5" />
              {isAuthenticated ? "Go to Dashboard" : "Start Learning with AI"}
            </button>
            <button
              onClick={() => handleAuthNavigation("/text-extractor")}
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              <Upload className="mr-2 w-5 h-5" />
              {isAuthenticated
                ? "Upload Your First Paper"
                : "Sign In to Upload"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">QuestionAI</h3>
                  <p className="text-xs text-gray-400">
                    Smart Question Platform
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming education with AI-powered question analysis and
                intelligent learning assistance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => handleAuthNavigation("/text-extractor")}
                    className="hover:text-white transition-colors"
                  >
                    Upload Questions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthNavigation("/dashboard")}
                    className="hover:text-white transition-colors"
                  >
                    AI Assistant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAuthNavigation("/dashboard")}
                    className="hover:text-white transition-colors"
                  >
                    Question Bank
                  </button>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    All Branches
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {isAuthenticated ? (
                  <>
                    <li>
                      <button
                        onClick={() => handleAuthNavigation("/dashboard")}
                        className="hover:text-white transition-colors"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleAuthNavigation("/profile")}
                        className="hover:text-white transition-colors"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          window.location.reload();
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a
                        href="/login"
                        className="hover:text-white transition-colors"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href="/signup"
                        className="hover:text-white transition-colors"
                      >
                        Sign Up
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/api-docs"
                    className="hover:text-white transition-colors"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2025 Ayush Poddar. All rights reserved. Powered by Advanced
              AI Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
