// server.js - Complete Backend Setup with Simplified Schema
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// CORS configuration - Add this before other middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://questionai-ayush.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Create necessary directories (only for temporary file processing)
const createDirectories = () => {
    const dirs = ['uploads', 'uploads/question-papers'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            console.log(`Creating directory: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Directory created: ${dir}`);
        } else {
            console.log(`Directory already exists: ${dir}`);
        }
    });
};
createDirectories();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// UPDATED: Simplified Question Paper Schema - Removed title, examType, fileName, filePath, fileSize
const questionPaperSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: String, required: true },
    
    // UPDATED: Support multiple extracted texts
    extractedTexts: [{
        text: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    
    // Keep this for backward compatibility with single text uploads
    extractedText: { type: String },
    
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    downloads: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    tags: [String],
    totalTexts: { type: Number, default: 0 } // Track number of texts
});

// Subject Schema
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    credits: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now }
});

// Create compound indexes for better queries
questionPaperSchema.index({ branch: 1, semester: 1, subject: 1 });
questionPaperSchema.index({ branch: 1, semester: 1 });
questionPaperSchema.index({ uploadedBy: 1 });
subjectSchema.index({ branch: 1, semester: 1 });

const User = mongoose.model('User', userSchema);
const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
const Subject = mongoose.model('Subject', subjectSchema);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Authentication: No token provided');
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
        if (err) {
            console.log('Authentication: Invalid or expired token', err.message);
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Enhanced Multer configuration for temporary file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/question-papers/'); // Store in question papers folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueSuffix + '-' + cleanName);
    }
});

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 10 // Maximum 10 files at once
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|jpg|jpeg|png|gif|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/plain';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, image files (JPEG, PNG, GIF), and text files are allowed'));
        }
    }
});

// --- TEXT EXTRACTION HELPERS ---
const fileToBase64 = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
};

const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain'
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

const extractTextFromImage = async (filePath, filename) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set. Image text extraction skipped.');
            return null;
        }

        const base64Data = fileToBase64(filePath);
        const mimeType = getMimeType(filename);

        console.log(`Sending image to Gemini: ${filename}, MIME: ${mimeType}`);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [
                        { text: "Extract all text from this image. Return only the extracted text, no additional commentary or formatting beyond what's directly in the image." },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }]
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000 // 30 second timeout
            }
        );

        const extractedContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!extractedContent) {
            console.warn('Gemini API returned no text content.', response.data);
            return null;
        }
        return extractedContent;

    } catch (error) {
        console.error('Gemini API Error during text extraction:', error.response?.data || error.message);
        return null;
    }
};

const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('PDF parsing error during text extraction:', error);
        return null;
    }
};

const extractTextFromFile = async (filePath, filename) => {
    const fileExtension = path.extname(filename).toLowerCase();
    
    if (fileExtension === '.txt') {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error('Text file reading error:', error);
            return null;
        }
    } else if (fileExtension === '.pdf') {
        return await extractTextFromPDF(filePath);
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
        return await extractTextFromImage(filePath, filename);
    }
    
    return null;
};

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role, branch } = req.body;

        if (!name || !email || !password || !branch) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({ success: false, message: 'Please use a Gmail address' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || 'student',
            branch,
            semester: '1'
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: user._id
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, semester } = req.body;

        if (!email || !password || !semester) {
            return res.status(400).json({ success: false, message: 'Email, password, and semester are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        user.semester = semester;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                branch: user.branch,
                semester: user.semester
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                semester: user.semester
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// --- TEXT EXTRACTION ROUTE ---
app.post('/api/extract-text', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const extractedText = await extractTextFromFile(req.file.path, req.file.originalname);

        // Clean up the uploaded file after extraction
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log(`Cleaned up temp file: ${req.file.path}`);
        }

        if (extractedText) {
            res.json({
                success: true,
                extractedText: extractedText
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to extract text from the file. It might be an unreadable format or extraction service issue.'
            });
        }

    } catch (error) {
        console.error('Text extraction API error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: 'An internal server error occurred during text extraction.' });
    }
});

// --- SUBJECT ROUTES ---
app.get('/api/subjects', authenticateToken, async (req, res) => {
    try {
        const { branch, semester } = req.query;

        const filter = {};
        if (branch) filter.branch = branch;
        if (semester) filter.semester = semester;

        if (!branch && !semester) {
            filter.branch = req.user.branch;
            filter.semester = req.user.semester;
        }

        const subjects = await Subject.find(filter).sort({ name: 1 });

        res.json({
            success: true,
            subjects
        });

    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
    }
});
// to add subject in mongodb
app.post('/api/subjects', authenticateToken, async (req, res) => {
    try {
        const { name, code, branch, semester, credits } = req.body;

        if (!name || !code || !branch || !semester) {
            return res.status(400).json({ success: false, message: 'Name, code, branch, and semester are required' });
        }

        const existingSubject = await Subject.findOne({ code, branch, semester });
        if (existingSubject) {
            return res.status(400).json({ success: false, message: 'Subject already exists for this branch and semester' });
        }

        const subject = new Subject({
            name,
            code,
            branch,
            semester,
            credits: credits || 3
        });

        await subject.save();

        res.status(201).json({
            success: true,
            message: 'Subject added successfully',
            subject
        });

    } catch (error) {
        console.error('Add subject error:', error);
        res.status(500).json({ success: false, message: 'Failed to add subject' });
    }
});

// --- QUESTION PAPER ROUTES ---

// UPDATED: Upload extracted text with simplified data structure
app.post('/api/question-papers/upload', authenticateToken, upload.single('questionPaper'), async (req, res) => {
    console.log('=== UPLOAD DEBUG START ===');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    console.log('========================');

    try {
        if (!req.file) {
            console.log('ERROR: No file uploaded');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Extract all possible subject identification data
        const subjectCode = req.body.subject;
        const subjectName = req.body.subjectName;
        const branch = req.body.branch || req.user.branch;
        const semester = req.body.semester || req.user.semester;
        
        console.log('Subject lookup details:', { subjectCode, subjectName, branch, semester });

        // Only validate that some subject identifier is provided
        if (!subjectCode && !subjectName) {
            console.log('ERROR: No subject identifier provided');
            // Clean up file before returning error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
                console.log(`Cleaned up file due to missing subject: ${req.file.path}`);
            }
            return res.status(400).json({ success: false, message: 'Subject code or name is required' });
        }

        // Enhanced subject lookup with multiple strategies
        console.log('Looking up subject in database...');
        
        const allSubjects = await Subject.find({ branch, semester }).limit(10);
        console.log('Available subjects in database for branch/semester:', allSubjects);

        let subjectDoc = null;

        // Strategy 1: Look up by code, branch, and semester (most specific)
        if (subjectCode && branch && semester) {
            subjectDoc = await Subject.findOne({ 
                code: subjectCode,
                branch: branch,
                semester: semester 
            });
            console.log('Strategy 1 (code+branch+semester) result:', subjectDoc);
        }

        // Strategy 2: If not found, look up by name, branch, and semester
        if (!subjectDoc && subjectName && branch && semester) {
            subjectDoc = await Subject.findOne({ 
                name: { $regex: new RegExp(subjectName, 'i') },
                branch: branch,
                semester: semester 
            });
            console.log('Strategy 2 (name+branch+semester) result:', subjectDoc);
        }

        // Strategy 3: If still not found, look up by code only (more flexible)
        if (!subjectDoc && subjectCode) {
            subjectDoc = await Subject.findOne({ 
                $or: [
                    { code: subjectCode },
                    { code: { $regex: new RegExp(subjectCode, 'i') } }
                ]
            });
            console.log('Strategy 3 (code only) result:', subjectDoc);
        }

        // Strategy 4: Look up by ObjectId if it's a valid ObjectId
        if (!subjectDoc && subjectCode && mongoose.Types.ObjectId.isValid(subjectCode)) {
            subjectDoc = await Subject.findById(subjectCode);
            console.log('Strategy 4 (ObjectId) result:', subjectDoc);
        }

        // Strategy 5: Last resort - look up by name only with flexible matching
        if (!subjectDoc && subjectName) {
            subjectDoc = await Subject.findOne({ 
                name: { $regex: new RegExp(subjectName, 'i') }
            });
            console.log('Strategy 5 (name only) result:', subjectDoc);
        }

        if (!subjectDoc) {
            console.log('Subject not found with any criteria:', { subjectCode, subjectName, branch, semester });
            
            const availableSubjects = await Subject.find({ branch, semester }).limit(5);
            console.log('Available subjects for this branch/semester:', availableSubjects);
            
            // Clean up file before returning error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
                console.log(`Cleaned up file due to subject not found: ${req.file.path}`);
            }
            
            return res.status(400).json({ 
                success: false,
                message: 'Subject not found in database',
                details: { 
                    searchedFor: { subjectCode, subjectName, branch, semester },
                    availableSubjects: availableSubjects.map(s => ({ 
                        id: s._id,
                        code: s.code, 
                        name: s.name 
                    }))
                }
            });
        }

        console.log('Successfully found subject:', {
            id: subjectDoc._id,
            name: subjectDoc.name,
            code: subjectDoc.code,
            branch: subjectDoc.branch,
            semester: subjectDoc.semester
        });

        // Read the extracted text from the uploaded file
        let extractedText = null;
        try {
            console.log('Reading file from path:', req.file.path);
            extractedText = fs.readFileSync(req.file.path, 'utf8');
            console.log('Extracted text length:', extractedText?.length || 0);
        } catch (readError) {
            console.error('Failed to read extracted text:', readError);
            // Clean up file before returning error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
                console.log(`Cleaned up file due to read error: ${req.file.path}`);
            }
            return res.status(400).json({ success: false, message: 'Failed to process extracted text' });
        }

        console.log('User branch:', req.user.branch);
        console.log('User semester:', req.user.semester);
        console.log('User ID:', req.user.userId);

        // Auto-generate current year
        const currentYear = new Date().getFullYear().toString();
        
        // UPDATED: Create question paper record with simplified fields - no title, examType, fileName, filePath, fileSize
        const questionPaperData = {
            subject: subjectDoc._id,
            branch: req.user.branch,
            semester: req.user.semester,
            year: currentYear,
            extractedText: extractedText,
            uploadedBy: req.user.userId,
            tags: ['extracted-text']
        };

        console.log('Creating QuestionPaper with simplified data:', questionPaperData);
        const questionPaper = new QuestionPaper(questionPaperData);

        console.log('Saving to database...');
        await questionPaper.save();
        console.log('Successfully saved to database');

        // *** CLEANUP: Delete the temporary file after successful database save ***
        try {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
                console.log(`✅ Successfully deleted temporary file: ${req.file.path}`);
            }
        } catch (cleanupError) {
            console.error('⚠️ Warning: Failed to delete temporary file:', cleanupError);
            // Don't fail the request if file cleanup fails, just log the warning
        }

        res.status(201).json({
            success: true,
            message: 'Extracted text saved successfully',
            questionPaper: {
                id: questionPaper._id,
                subject: questionPaper.subject,
                branch: questionPaper.branch,
                semester: questionPaper.semester,
                year: questionPaper.year,
                uploadedAt: questionPaper.uploadedAt,
                hasExtractedText: true,
                textLength: extractedText?.length || 0
            }
        });

    } catch (error) {
        console.error('=== UPLOAD ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('==================');

        // Clean up file in case of any error
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
                console.log(`Cleaned up file due to error: ${req.file.path}`);
            } catch (cleanupError) {
                console.error('Failed to cleanup file after error:', cleanupError);
            }
        }

        res.status(500).json({ success: false, message: 'Failed to save extracted text', error: error.message });
    }
});

// Get question papers with advanced filtering and search
app.get('/api/question-papers', authenticateToken, async (req, res) => {
    try {
        let { branch, semester, subject, year, page = 1, limit = 10, search } = req.query;

        const filter = { isApproved: true };

        // Use user's branch and semester if not specified
        filter.branch = branch || req.user.branch;
        filter.semester = semester || req.user.semester;

        if (subject) filter.subject = subject;
        if (year) filter.year = year;

        // Enhanced search functionality
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { tags: { $in: [searchRegex] } },
                { extractedText: searchRegex }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const questionPapers = await QuestionPaper.find(filter)
            .populate('subject', 'name code')
            .populate('uploadedBy', 'name email')
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await QuestionPaper.countDocuments(filter);

        res.json({
            success: true,
            questionPapers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get question papers error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch question papers' });
    }
});
// Delete question paper route - User can only delete their own uploads
app.delete('/api/question-papers/:id', authenticateToken, async (req, res) => {
    try {
        const questionPaperId = req.params.id;
        const userId = req.user.userId;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(questionPaperId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid question paper ID format' 
            });
        }

        // Find the question paper
        const questionPaper = await QuestionPaper.findById(questionPaperId);
        
        if (!questionPaper) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question paper not found' 
            });
        }

        // Check if the user is the owner of the question paper
        if (questionPaper.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only delete question papers uploaded by you' 
            });
        }

        // Delete the question paper from database
        await QuestionPaper.findByIdAndDelete(questionPaperId);

        console.log(`Question paper deleted successfully by user ${userId}: ${questionPaperId}`);

        res.json({
            success: true,
            message: 'Question paper deleted successfully',
            deletedPaper: {
                id: questionPaper._id,
                subject: questionPaper.subject,
                branch: questionPaper.branch,
                semester: questionPaper.semester,
                year: questionPaper.year,
                uploadedAt: questionPaper.uploadedAt
            }
        });

    } catch (error) {
        console.error('Delete question paper error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete question paper', 
            error: error.message 
        });
    }
});

// --- CHAT WITH AI ROUTE ---
app.post('/api/chat/ask', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    
    // Prepare the prompt with context and conversation history
    let fullPrompt = '';
    
    // Add context if available
    if (context) {
      fullPrompt += `Context (Question Paper Content):\n${context}\n\n`;
    }
    
    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += `Previous Conversation:\n`;
      conversationHistory.forEach((msg, index) => {
        fullPrompt += `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}\n`;
      });
      fullPrompt += `\nCurrent Question:\n`;
    }
    
    // Add current message
    fullPrompt += `Student: ${message}\n\nAI: `;
    
    // Call your AI service (OpenAI, Gemini, etc.)
    const aiResponse = await callGeminiService(fullPrompt);
    
    res.json({
      success: true,
      response: aiResponse
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response'
    });
  }
});

// Optional: Get chat history (if you want to implement chat history)
app.get('/api/chat/history', authenticateToken, async (req, res) => {
    try {
        // For now, return empty history
        // You can implement a ChatHistory model later if needed
        res.json({
            success: true,
            history: [],
            message: 'Chat history feature coming soon'
        });
    } catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch chat history' 
        });
    }
});
// Example for Google Gemini
async function callGeminiService(prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});