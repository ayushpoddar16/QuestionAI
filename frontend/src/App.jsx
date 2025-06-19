import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TextExtractor from './pages/TextExtractor';
import MainDashboard from './pages/MainDashboard';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main Application Routes */}
          <Route path="/text-extractor" element={<TextExtractor />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// // 4. FRONTEND REACT COMPONENT (App.js)

// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [extractedText, setExtractedText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
//       if (allowedTypes.includes(file.type)) {
//         setSelectedFile(file);
//         setError('');
//         setExtractedText('');
//       } else {
//         setError('Please select a valid image (JPEG, PNG, GIF) or PDF file');
//         setSelectedFile(null);
//       }
//     }
//   };

//   const handleExtractText = async () => {
//     if (!selectedFile) {
//       setError('Please select a file first');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setExtractedText('');

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.post('http://localhost:5000/api/extract-text', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         setExtractedText(response.data.extractedText);
//       } else {
//         setError('Failed to extract text');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError(error.response?.data?.error || 'An error occurred while extracting text');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(extractedText);
//     alert('Text copied to clipboard!');
//   };

//   return (
//     <div className="App">
//       <div className="container">
//         <h1>Text Extractor</h1>
//         <p>Extract text from images and PDFs using AI</p>
        
//         <div className="upload-section">
//           <input
//             type="file"
//             onChange={handleFileSelect}
//             accept="image/*,.pdf"
//             id="file-input"
//             className="file-input"
//           />
//           <label htmlFor="file-input" className="file-label">
//             {selectedFile ? selectedFile.name : 'Choose File'}
//           </label>
          
//           <button 
//             onClick={handleExtractText} 
//             disabled={!selectedFile || loading}
//             className="extract-btn"
//           >
//             {loading ? 'Extracting...' : 'Extract Text'}
//           </button>
//         </div>

//         {error && (
//           <div className="error-message">
//             {error}
//           </div>
//         )}

//         {extractedText && (
//           <div className="result-section">
//             <div className="result-header">
//               <h3>Extracted Text:</h3>
//               <button onClick={copyToClipboard} className="copy-btn">
//                 Copy Text
//               </button>
//             </div>
//             <div className="text-output">
//               {extractedText}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;