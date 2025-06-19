
import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  MessageCircle,
  BookOpen,
  User,
  LogOut,
  AlertCircle,
  Search,
  Calendar,
} from "lucide-react";
import ChatWithAI from "./ChatWithAI";

const MainDashboard = () => {
  // Add these state variables with your existing useState declarations
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatContext, setChatContext] = useState(null);

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      // User not logged in, redirect to login
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchSubjects(token);
      fetchQuestionPapers(token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      handleLogout();
    }
  }, []);

  const handleViewDetails = (subjectGroup) => {
    // Get all papers of this subject
    const subjectPapers = subjectGroup.papers;

    // Combine all extracted text from papers of this subject
    const combinedText = subjectPapers
      .filter((p) => p.extractedText && p.extractedText.trim())
      .sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt)) // Sort by upload date
      .map((p, index) => {
        return p.extractedText.trim();
      })
      .join("\n\n" + "─".repeat(60) + "\n\n");

    // Create a combined paper object
    const combinedPaper = {
      subject: subjectGroup.subject,
      year: `${Math.min(
        ...subjectPapers.map((p) => parseInt(p.year))
      )} - ${Math.max(...subjectPapers.map((p) => parseInt(p.year)))}`,
      extractedText: combinedText,
      combinedCount: subjectPapers.filter(
        (p) => p.extractedText && p.extractedText.trim()
      ).length,
      totalPapers: subjectPapers.length,
      availableYears: Array.from(subjectGroup.availableYears).sort(),
    };

    setSelectedPaper(combinedPaper);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  // Check authentication and get user data

  const fetchSubjects = async (token) => {
    try {
      const response = await fetch("https://questionai-backend.onrender.com/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setMessage({ type: "error", text: "Failed to load subjects" });
    }
  };

  const fetchQuestionPapers = async (token) => {
    try {
      const response = await fetch(
        "https://questionai-backend.onrender.com/api/question-papers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuestionPapers(data.questionPapers || []);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching question papers:", error);
      setMessage({ type: "error", text: "Failed to load question papers" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleUploadClick = () => {
    // Redirect to text extractor page
    window.location.href = "/text-extractor";
  };

  // Replace the handleChatWithAI function with this:
  const handleChatWithAI = (context = null) => {
    setChatContext(context);
    setShowChatModal(true);
  };

  // Add this function to handle chat with specific subject context
  const handleChatWithSubject = (subjectGroup) => {
    // Prepare context from the subject's question papers
    const subjectContext = subjectGroup.papers
      .filter((p) => p.extractedText && p.extractedText.trim())
      .map((p) => p.extractedText.trim())
      .join("\n\n--- Question Paper ---\n\n");

    const contextWithSubject = `Subject: ${subjectGroup.subject?.code} - ${subjectGroup.subject?.name}\n\n${subjectContext}`;

    handleChatWithAI(contextWithSubject);
  };

  // Group all papers by subject first - with null subject handling
  const allGroupedPapers = questionPapers.reduce((groups, paper) => {
    // Skip papers without subject data
    if (!paper.subject || !paper.subject._id) {
      console.warn('Skipping paper without subject:', paper);
      return groups;
    }

    const subjectId = paper.subject._id;
    const subjectKey = `${paper.subject.code} - ${paper.subject.name}`;

    if (!groups[subjectId]) {
      groups[subjectId] = {
        subject: paper.subject,
        subjectKey,
        papers: [],
        latestUpload: paper.uploadedAt,
        availableYears: new Set(),
        hasExtractedText: false,
      };
    }

    groups[subjectId].papers.push(paper);
    groups[subjectId].availableYears.add(paper.year);

    if (paper.extractedText && paper.extractedText.trim()) {
      groups[subjectId].hasExtractedText = true;
    }

    // Keep track of the latest upload date
    if (new Date(paper.uploadedAt) > new Date(groups[subjectId].latestUpload)) {
      groups[subjectId].latestUpload = paper.uploadedAt;
    }

    return groups;
  }, {});

  // Filter grouped subjects based on search and filters
  const filteredSubjects = Object.values(allGroupedPapers)
    .filter((group) => {
      // Additional safety check
      if (!group.subject) return false;

      const matchesSearch =
        !searchTerm ||
        group.subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.subject.code?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject =
        !selectedSubject || group.subject._id === selectedSubject;

      const matchesYear =
        !selectedYear ||
        Array.from(group.availableYears).includes(selectedYear);

      return matchesSearch && matchesSubject && matchesYear;
    })
    .sort((a, b) => a.subjectKey.localeCompare(b.subjectKey));

  // Get unique years for filter - with null check
  const availableYears = [
    ...new Set(questionPapers
      .filter(paper => paper.year) // Filter out papers without year
      .map((paper) => paper.year)
    ),
  ].sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    QuestionPaperWithAI
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user?.branch} - Semester {user?.semester}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* New Back to Home Button (without icon) */}
              <button
                onClick={() => (window.location.href = "/")}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Back to Home
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload File Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Question Paper
                </h3>
                <p className="text-sm text-gray-600">
                  Extract text from PDF, images, or documents
                </p>
              </div>
            </div>
            <button
              onClick={handleUploadClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Start Text Extraction</span>
            </button>
          </div>

          {/* AI Chat Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chat with AI
                </h3>
                <p className="text-sm text-gray-600">
                  Get help with your question papers
                </p>
              </div>
            </div>
            <button
              onClick={() => handleChatWithAI()}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start AI Chat</span>
            </button>
          </div>
        </div>

        {/* Question Papers Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Subjects ({filteredSubjects.length} subjects)
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Subjects Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {questionPapers.length === 0
                    ? "No question papers available for your branch and semester yet."
                    : "No subjects match your search criteria."}
                </p>
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload First Paper</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubjects.map((subjectGroup) => (
                  <div
                    key={subjectGroup.subject._id}
                    className="border border-red-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {subjectGroup.subject.code} -{" "}
                            {subjectGroup.subject.name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>
                              {" "}
                              Total Submit
                              {subjectGroup.papers.length !== 1 ? "s " : " "}
                              {subjectGroup.papers.length}
                            </span>
                          </span>
                          <span className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Years:{" "}
                              {Array.from(subjectGroup.availableYears)
                                .sort()
                                .join(", ")}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {subjectGroup.hasExtractedText && (
                          <span className="px-6 py-2 rounded-lg font-medium bg-green-300 flex items-center space-x-2">
                            Text Available
                          </span>
                        )}
                        <button
                          onClick={() => handleViewDetails(subjectGroup)}
                          disabled={!subjectGroup.hasExtractedText}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            subjectGroup.hasExtractedText
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>
                            {subjectGroup.hasExtractedText
                              ? "View Questions"
                              : "No Text Available"}
                          </span>
                        </button>
                        {/* Add Chat with AI button for specific subject */}
                        <button
                          onClick={() => handleChatWithSubject(subjectGroup)}
                          disabled={!subjectGroup.hasExtractedText}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            subjectGroup.hasExtractedText
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for viewing paper details */}
      {showModal && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-300 to-gray-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-red-100 bg-white/80 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedPaper.subject?.code} - {selectedPaper.subject?.name}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>
                    Years Available: {selectedPaper.availableYears?.join(", ")}
                  </span>
                  {selectedPaper.combinedCount > 1 && (
                    <span>
                      • Combined from {selectedPaper.combinedCount} of{" "}
                      {selectedPaper.totalPapers} papers
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-blue-300 max-h-[70vh]">
              {selectedPaper.extractedText ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      {selectedPaper.combinedCount > 1
                        ? `Combined Questions (${selectedPaper.combinedCount} papers):`
                        : "Extracted Questions:"}
                    </h3>
                    <div className="flex items-center space-x-3">
                      {selectedPaper.combinedCount > 1 && (
                        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          All {selectedPaper.subject?.code} papers combined
                        </div>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedPaper.extractedText
                          );
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Copy Text</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-300 p-6 rounded-lg border border-gray-200 shadow-inner">
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {selectedPaper.extractedText}
                    </pre>
                  </div>
                  {selectedPaper.combinedCount > 1 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This view combines extracted text
                        from all available papers for{" "}
                        {selectedPaper.subject?.code}. Questions from different
                        papers are separated by divider lines for better
                        readability.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Extracted Text Available
                  </h3>
                  <p className="text-gray-600">
                    {selectedPaper.totalPapers > 1
                      ? `None of the ${selectedPaper.totalPapers} papers for this subject have extracted text available.`
                      : "No extracted text available for this paper."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Chat Modal */}
      {showChatModal && (
        <ChatWithAI
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setChatContext(null);
          }}
          context={chatContext}
        />
      )}
    </div>
  );
};

export default MainDashboard;
