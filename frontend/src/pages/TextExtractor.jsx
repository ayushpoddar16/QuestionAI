import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload, // Although Upload isn't directly used as an icon, it's good to keep if it was meant for future use
  LogOut,
  Scan,
  Copy,
  FileImage,
  AlertCircle,
  CheckCircle,
  Download,
  Sparkles,
  Save,
  BookOpen,
  Calendar,
  FileText,
  Edit3,
  X,
  Check,
} from "lucide-react";
import sampleSubjects from "./SampleSubjects";

const TextExtractor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fileName, setFileName] = useState("");

  // NEW: States for editing extracted text
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");

  // States for saving extracted text as a document
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadYear, setUploadYear] = useState("");
  const [uploadExamType, setUploadExamType] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [userBranch, setUserBranch] = useState("");
  const [userSemester, setUserSemester] = useState("");
  const [savingDocument, setSavingDocument] = useState(false);
  const [saveErrors, setSaveErrors] = useState({});
  // New state to store recently used subject IDs for prioritization
  const [recentlyUsedSubjectIds, setRecentlyUsedSubjectIds] = useState([]);
  const extractedTextRef = useRef(null);
  // 3. Add this useEffect to handle auto-scrolling when extractedText changes
  useEffect(() => {
    if (extractedText && extractedTextRef.current) {
      // Small delay to ensure the component has fully rendered
      setTimeout(() => {
        extractedTextRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [extractedText]);

  // --- Fetch User Data and Subjects on Component Mount ---
  useEffect(() => {
    const fetchUserDataAndSubjects = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Load recently used subjects from localStorage first
      const storedRecentlyUsed = localStorage.getItem("recentlyUsedSubjects");
      let recentlyUsed = [];
      if (storedRecentlyUsed) {
        recentlyUsed = JSON.parse(storedRecentlyUsed);
        setRecentlyUsedSubjectIds(recentlyUsed);
      }

      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser);
          setUserBranch(user.branch);
          setUserSemester(user.semester);

          // Filter subjects based on user's branch and semester
          let subjects = sampleSubjects.filter(
            (subject) =>
              subject.branch === user.branch &&
              subject.semester === user.semester
          );

          // Prioritize recently used subjects
          if (recentlyUsed.length > 0) {
            const prioritizedSubjects = [];
            const otherSubjects = [];

            subjects.forEach((subject) => {
              if (recentlyUsed.includes(subject._id)) {
                prioritizedSubjects.push(subject);
              } else {
                otherSubjects.push(subject);
              }
            });

            // Sort prioritized subjects by their order in recentlyUsed
            prioritizedSubjects.sort((a, b) => {
              return recentlyUsed.indexOf(a._id) - recentlyUsed.indexOf(b._id);
            });

            // Combine prioritized and other subjects, then sort the 'other' subjects alphabetically
            setAvailableSubjects([
              ...prioritizedSubjects,
              ...otherSubjects.sort((a, b) => a.name.localeCompare(b.name)),
            ]);
          } else {
            // If no recently used, just sort alphabetically
            setAvailableSubjects(
              subjects.sort((a, b) => a.name.localeCompare(b.name))
            );
          }

          if (subjects.length === 0) {
            setMessage({
              type: "error",
              text: "No subjects found for your branch and semester.",
            });
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setMessage({
            type: "error",
            text: "Error loading user data.",
          });
        }
      } else {
        // Not logged in, or token missing, redirect to login
        setMessage({
          type: "error",
          text: "You must be logged in. Redirecting to login...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    };

    fetchUserDataAndSubjects();
  }, []); // FIXED: Empty dependency array - this effect should only run once on mount

  // ADDED: Separate effect to update available subjects when recentlyUsedSubjectIds changes
  useEffect(() => {
    if (userBranch && userSemester && recentlyUsedSubjectIds.length > 0) {
      // Filter subjects based on user's branch and semester
      let subjects = sampleSubjects.filter(
        (subject) =>
          subject.branch === userBranch && subject.semester === userSemester
      );

      const prioritizedSubjects = [];
      const otherSubjects = [];

      subjects.forEach((subject) => {
        if (recentlyUsedSubjectIds.includes(subject._id)) {
          prioritizedSubjects.push(subject);
        } else {
          otherSubjects.push(subject);
        }
      });

      // Sort prioritized subjects by their order in recentlyUsedSubjectIds
      prioritizedSubjects.sort((a, b) => {
        return (
          recentlyUsedSubjectIds.indexOf(a._id) -
          recentlyUsedSubjectIds.indexOf(b._id)
        );
      });

      // Combine prioritized and other subjects, then sort the 'other' subjects alphabetically
      setAvailableSubjects([
        ...prioritizedSubjects,
        ...otherSubjects.sort((a, b) => a.name.localeCompare(b.name)),
      ]);
    }
  }, [recentlyUsedSubjectIds, userBranch, userSemester]); // This effect handles subject reordering

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setFileName(file.name);
        setMessage({ type: "", text: "" });
        setExtractedText("");
        // NEW: Reset editing states
        setIsEditing(false);
        setEditableText("");
        // Clear upload form fields and errors when a new file is selected
        setUploadTitle("");
        setUploadYear("");
        setUploadExamType("");
        setSelectedSubjectId(""); // This should already exist
        setSaveErrors({});
      } else {
        setMessage({
          type: "error",
          text: "Please select a valid image (JPEG, PNG, GIF) or PDF file.",
        });
        setSelectedFile(null);
        setFileName("");
      }
    }
  };

  // 1. Add this new function after your existing functions (around line 200-250):

  const cancelExtractedText = () => {
    setExtractedText("");
    setEditableText("");
    setIsEditing(false);
    setUploadTitle("");
    setUploadYear("");
    setUploadExamType("");
    setSelectedSubjectId("");
    setSaveErrors({});
    setMessage({
      type: "success",
      text: "Extracted text cleared. You can upload a new file.",
    });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    setExtractedText("");
    // NEW: Reset editing states
    setIsEditing(false);
    setEditableText("");
    setSaveErrors({}); // Clear save errors from previous attempts

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          type: "error",
          text: "You must be logged in to extract text. Redirecting to login...",
        });
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      const response = await fetch(
        "https://questionai-backend.onrender.com/api/extract-text",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const text =
          data.extractedText || "No text could be extracted from this file.";
        setExtractedText(text);
        // NEW: Initialize editable text with extracted text
        setEditableText(text);
        setMessage({ type: "success", text: "Text extracted successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to extract text. Unknown error.",
        });
        console.error("Backend error during extraction:", data);
      }
    } catch (error) {
      console.error(
        "Network or unexpected error during text extraction:",
        error
      );
      setMessage({
        type: "error",
        text: "A network error occurred. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to start editing
  const startEditing = () => {
    setIsEditing(true);
    setEditableText(extractedText);
  };

  // NEW: Function to cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditableText(extractedText);
  };

  // NEW: Function to save edits
  const saveEdits = () => {
    setExtractedText(editableText);
    setIsEditing(false);
    setMessage({ type: "success", text: "Text updated successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setMessage({ type: "success", text: "Text copied to clipboard!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const downloadText = () => {
    if (extractedText) {
      const element = document.createElement("a");
      const file = new Blob([extractedText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "extracted-text.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // --- Function to handle uploading extracted text as a document ---
  const handleUploadExtractedDocument = async () => {
    const newErrors = {};

    // Only validate subject selection
    if (!selectedSubjectId) {
      newErrors.selectedSubjectId = "Subject is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setSaveErrors(newErrors);
      setMessage({
        type: "error",
        text: "Please select a subject to save the extracted text.",
      });
      return;
    }

    setSavingDocument(true);
    setMessage({ type: "", text: "" });
    setSaveErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          type: "error",
          text: "Authentication required to save document. Redirecting to login...",
        });
        setSavingDocument(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      // Validate extracted text exists
      if (!extractedText || extractedText.trim() === "") {
        setMessage({
          type: "error",
          text: "No extracted text to save. Please extract text first.",
        });
        setSavingDocument(false);
        return;
      }

      // FIND THE SELECTED SUBJECT TO GET ITS CODE
      const selectedSubject = availableSubjects.find(
        (subject) => subject._id === selectedSubjectId
      );

      if (!selectedSubject) {
        setMessage({
          type: "error",
          text: "Selected subject not found. Please select a valid subject.",
        });
        setSavingDocument(false);
        return;
      }

      const formData = new FormData();

      // Create a file from the extracted text
      const extractedFileBlob = new Blob([extractedText], {
        type: "text/plain",
      });
      const extractedFile = new File(
        [extractedFileBlob],
        `extracted_text_${Date.now()}.txt`,
        { type: "text/plain" }
      );

      // Send subject code, name, branch, and semester for better matching
      formData.append("questionPaper", extractedFile);
      formData.append("subject", selectedSubject.code); // Send code instead of ID
      formData.append("subjectName", selectedSubject.name);
      formData.append("branch", userBranch);
      formData.append("semester", userSemester);

      console.log("Uploading extracted text with subject details:", {
        code: selectedSubject.code,
        name: selectedSubject.name,
        branch: userBranch,
        semester: userSemester,
      });

      const response = await fetch(
        "https://questionai-backend.onrender.com/api/question-papers/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it for FormData
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Extracted text saved as a new document successfully!",
        });

        // FIXED: Update recently used subjects without causing infinite loop
        const newRecentlyUsed = [
          selectedSubjectId,
          ...recentlyUsedSubjectIds.filter((id) => id !== selectedSubjectId),
        ];
        const limitedRecentlyUsed = newRecentlyUsed.slice(0, 5);

        // Update localStorage
        localStorage.setItem(
          "recentlyUsedSubjects",
          JSON.stringify(limitedRecentlyUsed)
        );

        // Update state
        setRecentlyUsedSubjectIds(limitedRecentlyUsed);

        // Clear form after successful save
        setExtractedText("");
        setSelectedSubjectId("");
        setSelectedFile(null);
        setFileName("");
        // NEW: Reset editing states
        setIsEditing(false);
        setEditableText("");
        // *** Redirect to dashboard after successful save ***
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        console.error("Backend error response:", data);
        setMessage({
          type: "error",
          text:
            data.message || "Failed to save extracted text. Please try again.",
        });
      }
    } catch (error) {
      console.error("Network error saving document:", error);
      setMessage({
        type: "error",
        text: "Network error occurred. Please check your connection and try again.",
      });
    } finally {
      setSavingDocument(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative flex flex-col items-center py-12 px-4 overflow-hidden">
      {/* Subtle Gradient Overlay for Depth */}
      <div className="absolute inset-0 z-0 opacity-20"></div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg mb-12">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {/* Assuming ArrowLeft is imported */}
          <span className="text-md">Back to dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Text Extractor
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2  text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-md">Logout</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
            Effortless Text from Any Document
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Quickly convert images and PDFs into editable text using intelligent
            AI.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-blue-200 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 sm:p-10 mb-8 shadow-xl shadow-gray-200/50">
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:border-blue-500 transition-all duration-300 cursor-pointer group">
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*,.pdf"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="block w-full h-full">
              <FileImage className="w-16 h-16 text-blue-500 mx-auto mb-5 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {fileName ? fileName : "Click to upload"}
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, GIF, and PDF (Max 50MB)
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="mt-8 text-center">
              <button
                onClick={handleExtractText}
                disabled={loading}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-300/30 hover:shadow-blue-300/40 active:scale-98"
              >
                {loading ? (
                  <>
                    <Scan className="w-6 h-6 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Scan className="w-6 h-6" />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Extracted Text Results */}
        {extractedText && (
          <div
            ref={extractedTextRef}
            className="bg-blue-200 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-xl shadow-gray-200/50 animate-slideUp"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-500 bg-clip-text text-transparent">
                Extracted Text
              </h3>
              <div className="flex gap-3">
                {/* Edit button */}
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}

                <button
                  onClick={copyToClipboard}
                  disabled={isEditing}
                  className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>

                <button
                  onClick={downloadText}
                  disabled={isEditing}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                {/* NEW: Cancel button - shows first */}
                <button
                  onClick={cancelExtractedText}
                  disabled={isEditing}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>

            {/* NEW: Conditional rendering for edit mode */}
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Edit the extracted text below:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdits}
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full h-96 p-6 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-sans text-base leading-relaxed resize-none"
                  placeholder="Edit your extracted text here..."
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans text-base leading-relaxed">
                  {extractedText}
                </pre>
              </div>
            )}

            {/* --- Save Extracted Text Form --- */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-500 bg-clip-text text-transparent">
                Upload the question paper
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Dropdown */}
                <div>
                  <label
                    htmlFor="selectedSubjectId"
                    className="block text-gray-700 text-sm font-medium mb-2 py-2"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      id="selectedSubjectId"
                      value={selectedSubjectId}
                      onChange={(e) => {
                        setSelectedSubjectId(e.target.value);
                        setSaveErrors({ ...saveErrors, selectedSubjectId: "" });
                      }}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                        saveErrors.selectedSubjectId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="" className="bg-white text-gray-700">
                        Select a subject
                      </option>
                      {availableSubjects.map((subject) => (
                        <option
                          key={subject._id}
                          value={subject._id}
                          className="bg-white text-gray-800"
                        >
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {saveErrors.selectedSubjectId && (
                      <p className="text-red-600 text-xs mt-1">
                        {saveErrors.selectedSubjectId}
                      </p>
                    )}
                  </div>
                </div>
              </form>

              {/* Save Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleUploadExtractedDocument}
                  disabled={
                    savingDocument ||
                    !extractedText ||
                    !userBranch ||
                    !userSemester ||
                    isEditing
                  }
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-300/30 hover:shadow-green-300/40 active:scale-98"
                >
                  {savingDocument ? (
                    <>
                      <Save className="w-6 h-6 animate-spin" />
                      Saving Document...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Upload Question Paper
                    </>
                  )}
                </button>
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-2">
                    Please save your edits before exporting
                  </p>
                )}
              </div>
            </div>
            {/* --- END Save Extracted Text Form --- */}
          </div>
        )}
      </main>
    </div>
  );
};

export default TextExtractor;
