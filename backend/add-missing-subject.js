const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

const Subject = mongoose.model('Subject', subjectSchema);

const addMissingSubjects = async () => {
    try {
        console.log('Checking for missing subjects...');
        
        const missingSubjects = [
     // --- Computer Science Engineering ---
    // Computer Science Engineering - 1st Semester
    { name: 'Mathematics I', code: 'MA101', branch: 'Computer Science Engineering', semester: '1', credits: 4 },
    { name: 'Physics', code: 'PH101', branch: 'Computer Science Engineering', semester: '1', credits: 3 },
    { name: 'Chemistry', code: 'CH101', branch: 'Computer Science Engineering', semester: '1', credits: 3 },
    { name: 'English Communication', code: 'EN101', branch: 'Computer Science Engineering', semester: '1', credits: 2 },
    { name: 'Computer Programming', code: 'CS101', branch: 'Computer Science Engineering', semester: '1', credits: 4 },

    // Computer Science Engineering - 2nd Semester
    { name: 'Mathematics II', code: 'MA102', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { name: 'Data Structures', code: 'CS201', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { name: 'Digital Logic Design', code: 'CS202', branch: 'Computer Science Engineering', semester: '2', credits: 3 },
    { name: 'Object Oriented Programming', code: 'CS203', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { name: 'Engineering Graphics', code: 'ME102', branch: 'Computer Science Engineering', semester: '2', credits: 2 },

    // Computer Science Engineering - 3rd Semester
    { name: 'Algorithms', code: 'CS301', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { name: 'Computer Organization', code: 'CS302', branch: 'Computer Science Engineering', semester: '3', credits: 3 },
    { name: 'Database Management Systems', code: 'CS303', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { name: 'Operating Systems', code: 'CS304', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { name: 'Discrete Mathematics', code: 'MA301', branch: 'Computer Science Engineering', semester: '3', credits: 3 },

    // Computer Science Engineering - 4th Semester
    { name: 'Software Engineering', code: 'CS401', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { name: 'Computer Networks', code: 'CS402', branch: 'Computer Science Engineering', semester: '4', credits: 4 },
    { name: 'Theory of Computation', code: 'CS403', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { name: 'Web Technologies', code: 'CS404', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { name: 'Mathematics III', code: 'MA401', branch: 'Computer Science Engineering', semester: '4', credits: 4 },

    // Computer Science Engineering - 5th Semester
    { name: 'Machine Learning', code: 'CS501', branch: 'Computer Science Engineering', semester: '5', credits: 4 },
    { name: 'Compiler Design', code: 'CS502', branch: 'Computer Science Engineering', semester: '5', credits: 3 },
    { name: 'Computer Graphics', code: 'CS503', branch: 'Computer Science Engineering', semester: '5', credits: 3 },
    { name: 'Artificial Intelligence', code: 'CS504', branch: 'Computer Science Engineering', semester: '5', credits: 4 },
    { name: 'Cyber Security', code: 'CS505', branch: 'Computer Science Engineering', semester: '5', credits: 3 },

    // Computer Science Engineering - 6th Semester
    { name: 'Mobile Application Development', code: 'CS601', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { name: 'Cloud Computing', code: 'CS602', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { name: 'Data Mining', code: 'CS603', branch: 'Computer Science Engineering', semester: '6', credits: 4 },
    { name: 'Information Security', code: 'CS604', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { name: 'Project Management', code: 'CS605', branch: 'Computer Science Engineering', semester: '6', credits: 2 },

    // Computer Science Engineering - 7th Semester
    { name: 'Deep Learning', code: 'CS701', branch: 'Computer Science Engineering', semester: '7', credits: 4 },
    { name: 'Big Data Analytics', code: 'CS702', branch: 'Computer Science Engineering', semester: '7', credits: 4 },
    { name: 'Natural Language Processing', code: 'CS703', branch: 'Computer Science Engineering', semester: '7', credits: 3 },
    { name: 'Distributed Systems', code: 'CS704', branch: 'Computer Science Engineering', semester: '7', credits: 3 },
    { name: 'Elective I (CSE)', code: 'CSE705E', branch: 'Computer Science Engineering', semester: '7', credits: 3 },

    // Computer Science Engineering - 8th Semester
    { name: 'Capstone Project', code: 'CS801P', branch: 'Computer Science Engineering', semester: '8', credits: 6 },
    { name: 'Blockchain Technology', code: 'CS802', branch: 'Computer Science Engineering', semester: '8', credits: 3 },
    { name: 'Internet of Things (IoT)', code: 'CS803', branch: 'Computer Science Engineering', semester: '8', credits: 3 },
    { name: 'Elective II (CSE)', code: 'CSE804E', branch: 'Computer Science Engineering', semester: '8', credits: 3 },

    // --- Information Technology ---
    // Information Technology - 1st Semester
    { name: 'Mathematics I', code: 'MA101', branch: 'Information Technology', semester: '1', credits: 4 },
    { name: 'Physics', code: 'PH101', branch: 'Information Technology', semester: '1', credits: 3 },
    { name: 'Chemistry', code: 'CH101', branch: 'Information Technology', semester: '1', credits: 3 },
    { name: 'English Communication', code: 'EN101', branch: 'Information Technology', semester: '1', credits: 2 },
    { name: 'Computer Fundamentals', code: 'IT101', branch: 'Information Technology', semester: '1', credits: 3 },

    // Information Technology - 2nd Semester
    { name: 'Mathematics II', code: 'MA102', branch: 'Information Technology', semester: '2', credits: 4 },
    { name: 'Programming in C', code: 'IT201', branch: 'Information Technology', semester: '2', credits: 4 },
    { name: 'Digital Electronics', code: 'IT202', branch: 'Information Technology', semester: '2', credits: 3 },
    { name: 'Data Structures', code: 'IT203', branch: 'Information Technology', semester: '2', credits: 4 },
    { name: 'Engineering Graphics', code: 'ME102', branch: 'Information Technology', semester: '2', credits: 2 },

    // Information Technology - 3rd Semester
    { name: 'Object Oriented Programming', code: 'IT301', branch: 'Information Technology', semester: '3', credits: 4 },
    { name: 'Database Systems', code: 'IT302', branch: 'Information Technology', semester: '3', credits: 4 },
    { name: 'Computer Networks', code: 'IT303', branch: 'Information Technology', semester: '3', credits: 3 },
    { name: 'Software Engineering', code: 'IT304', branch: 'Information Technology', semester: '3', credits: 3 },
    { name: 'Statistics', code: 'MA302', branch: 'Information Technology', semester: '3', credits: 3 },

    // Information Technology - 4th Semester
    { name: 'Web Technologies', code: 'IT401', branch: 'Information Technology', semester: '4', credits: 4 },
    { name: 'Operating Systems', code: 'IT402', branch: 'Information Technology', semester: '4', credits: 3 },
    { name: 'System Analysis & Design', code: 'IT403', branch: 'Information Technology', semester: '4', credits: 3 },
    { name: 'Computer Architecture', code: 'IT404', branch: 'Information Technology', semester: '4', credits: 3 },
    { name: 'Cyber Security Fundamentals', code: 'IT405', branch: 'Information Technology', semester: '4', credits: 3 },

    // Information Technology - 5th Semester
    { name: 'Data Communication', code: 'IT501', branch: 'Information Technology', semester: '5', credits: 3 },
    { name: 'Cloud Computing', code: 'IT502', branch: 'Information Technology', semester: '5', credits: 4 },
    { name: 'Artificial Intelligence', code: 'IT503', branch: 'Information Technology', semester: '5', credits: 4 },
    { name: 'Theory of Computation', code: 'IT504', branch: 'Information Technology', semester: '5', credits: 3 },
    { name: 'Python Programming', code: 'IT505', branch: 'Information Technology', semester: '5', credits: 3 },

    // Information Technology - 6th Semester
    { name: 'Machine Learning', code: 'IT601', branch: 'Information Technology', semester: '6', credits: 4 },
    { name: 'Network Security', code: 'IT602', branch: 'Information Technology', semester: '6', credits: 3 },
    { name: 'Mobile Application Development', code: 'IT603', branch: 'Information Technology', semester: '6', credits: 3 },
    { name: 'Big Data Technologies', code: 'IT604', branch: 'Information Technology', semester: '6', credits: 4 },
    { name: 'Elective (IT)', code: 'ITE605E', branch: 'Information Technology', semester: '6', credits: 3 },

    // Information Technology - 7th Semester
    { name: 'Cyber Security & Forensics', code: 'IT701', branch: 'Information Technology', semester: '7', credits: 4 },
    { name: 'Cloud Infrastructure & Services', code: 'IT702', branch: 'Information Technology', semester: '7', credits: 3 },
    { name: 'Data Warehousing & Mining', code: 'IT703', branch: 'Information Technology', semester: '7', credits: 4 },
    { name: 'Mobile Computing', code: 'IT704', branch: 'Information Technology', semester: '7', credits: 3 },
    { name: 'Elective II (IT)', code: 'ITE705E', branch: 'Information Technology', semester: '7', credits: 3 },

    // Information Technology - 8th Semester
    { name: 'Major Project', code: 'IT801P', branch: 'Information Technology', semester: '8', credits: 6 },
    { name: 'IT Infrastructure Management', code: 'IT802', branch: 'Information Technology', semester: '8', credits: 3 },
    { name: 'Ethical Hacking', code: 'IT803', branch: 'Information Technology', semester: '8', credits: 3 },
    { name: 'Elective III (IT)', code: 'ITE804E', branch: 'Information Technology', semester: '8', credits: 3 },

    // --- Electronics & Communication Engineering ---
    // Electronics & Communication Engineering - 1st Semester
    { name: 'Mathematics I', code: 'MA101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 4 },
    { name: 'Physics', code: 'PH101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },
    { name: 'Chemistry', code: 'CH101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },
    { name: 'English Communication', code: 'EN101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 2 },
    { name: 'Basic Electrical Engineering', code: 'EE101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },

    // Electronics & Communication Engineering - 2nd Semester
    { name: 'Mathematics II', code: 'MA102', branch: 'Electronics & Communication Engineering', semester: '2', credits: 4 },
    { name: 'Electronic Devices', code: 'EC201', branch: 'Electronics & Communication Engineering', semester: '2', credits: 4 },
    { name: 'Circuit Analysis', code: 'EC202', branch: 'Electronics & Communication Engineering', semester: '2', credits: 3 },
    { name: 'Digital Electronics', code: 'EC203', branch: 'Electronics & Communication Engineering', semester: '2', credits: 3 },
    { name: 'Engineering Graphics', code: 'ME102', branch: 'Electronics & Communication Engineering', semester: '2', credits: 2 },

    // Electronics & Communication Engineering - 3rd Semester
    { name: 'Analog Electronics', code: 'EC301', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { name: 'Signals & Systems', code: 'EC302', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { name: 'Network Analysis', code: 'EC303', branch: 'Electronics & Communication Engineering', semester: '3', credits: 3 },
    { name: 'Digital Signal Processing', code: 'EC304', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { name: 'Electromagnetic Theory', code: 'EC305', branch: 'Electronics & Communication Engineering', semester: '3', credits: 3 },

    // Electronics & Communication Engineering - 4th Semester
    { name: 'Communication Systems', code: 'EC401', branch: 'Electronics & Communication Engineering', semester: '4', credits: 4 },
    { name: 'Microprocessors', code: 'EC402', branch: 'Electronics & Communication Engineering', semester: '4', credits: 4 },
    { name: 'Control Systems', code: 'EC403', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },
    { name: 'VLSI Design', code: 'EC404', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },
    { name: 'Antenna Theory', code: 'EC405', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },

    // Electronics & Communication Engineering - 5th Semester
    { name: 'Linear Integrated Circuits', code: 'EC501', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { name: 'Microcontrollers', code: 'EC502', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { name: 'Data Communication Networks', code: 'EC503', branch: 'Electronics & Communication Engineering', semester: '5', credits: 3 },
    { name: 'Digital Communication', code: 'EC504', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { name: 'Elective (ECE)', code: 'ECE505E', branch: 'Electronics & Communication Engineering', semester: '5', credits: 3 },

    // Electronics & Communication Engineering - 6th Semester
    { name: 'Power Electronics', code: 'EC601', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },
    { name: 'Embedded Systems', code: 'EC602', branch: 'Electronics & Communication Engineering', semester: '6', credits: 4 },
    { name: 'Wireless Communication', code: 'EC603', branch: 'Electronics & Communication Engineering', semester: '6', credits: 4 },
    { name: 'Optical Communication', code: 'EC604', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },
    { name: 'Elective II (ECE)', code: 'ECE605E', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },

    // Electronics & Communication Engineering - 7th Semester
    { name: 'Digital Image Processing', code: 'EC701', branch: 'Electronics & Communication Engineering', semester: '7', credits: 4 },
    { name: 'Satellite Communication', code: 'EC702', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },
    { name: 'Biomedical Instrumentation', code: 'EC703', branch: 'Electronics & Communication Engineering', semester: '7', credits: 4 },
    { name: 'Robotics and Automation', code: 'EC704', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },
    { name: 'Elective III (ECE)', code: 'ECE705E', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },

    // Electronics & Communication Engineering - 8th Semester
    { name: 'Major Project', code: 'EC801P', branch: 'Electronics & Communication Engineering', semester: '8', credits: 6 },
    { name: 'Advanced Digital Signal Processing', code: 'EC802', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },
    { name: 'Radar Systems', code: 'EC803', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },
    { name: 'Elective IV (ECE)', code: 'ECE804E', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },

    // --- Mechanical Engineering ---
    // Mechanical Engineering - 1st Semester
    { name: 'Mathematics I', code: 'MA101', branch: 'Mechanical Engineering', semester: '1', credits: 4 },
    { name: 'Physics', code: 'PH101', branch: 'Mechanical Engineering', semester: '1', credits: 3 },
    { name: 'Chemistry', code: 'CH101', branch: 'Mechanical Engineering', semester: '1', credits: 3 },
    { name: 'English Communication', code: 'EN101', branch: 'Mechanical Engineering', semester: '1', credits: 2 },
    { name: 'Engineering Mechanics', code: 'ME101', branch: 'Mechanical Engineering', semester: '1', credits: 4 },

    // Mechanical Engineering - 2nd Semester
    { name: 'Mathematics II', code: 'MA102', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { name: 'Thermodynamics', code: 'ME201', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { name: 'Materials Science', code: 'ME202', branch: 'Mechanical Engineering', semester: '2', credits: 3 },
    { name: 'Manufacturing Processes', code: 'ME203', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { name: 'Engineering Graphics', code: 'ME102', branch: 'Mechanical Engineering', semester: '2', credits: 2 },

    // Mechanical Engineering - 3rd Semester
    { name: 'Fluid Mechanics', code: 'ME301', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { name: 'Strength of Materials', code: 'ME302', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { name: 'Machine Design I', code: 'ME303', branch: 'Mechanical Engineering', semester: '3', credits: 3 },
    { name: 'Heat Transfer', code: 'ME304', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { name: 'Kinematics of Machines', code: 'ME305', branch: 'Mechanical Engineering', semester: '3', credits: 3 },

    // Mechanical Engineering - 4th Semester
    { name: 'Applied Thermodynamics', code: 'ME401', branch: 'Mechanical Engineering', semester: '4', credits: 4 },
    { name: 'Theory of Machines', code: 'ME402', branch: 'Mechanical Engineering', semester: '4', credits: 4 },
    { name: 'Manufacturing Technology', code: 'ME403', branch: 'Mechanical Engineering', semester: '4', credits: 3 },
    { name: 'Metrology and Quality Control', code: 'ME404', branch: 'Mechanical Engineering', semester: '4', credits: 3 },
    { name: 'Machine Design II', code: 'ME405', branch: 'Mechanical Engineering', semester: '4', credits: 3 },

    // Mechanical Engineering - 5th Semester
    { name: 'Fluid Machinery', code: 'ME501', branch: 'Mechanical Engineering', semester: '5', credits: 4 },
    { name: 'Internal Combustion Engines', code: 'ME502', branch: 'Mechanical Engineering', semester: '5', credits: 4 },
    { name: 'Dynamics of Machinery', code: 'ME503', branch: 'Mechanical Engineering', semester: '5', credits: 3 },
    { name: 'Refrigeration & Air Conditioning', code: 'ME504', branch: 'Mechanical Engineering', semester: '5', credits: 3 },
    { name: 'Elective (ME)', code: 'MEE505E', branch: 'Mechanical Engineering', semester: '5', credits: 3 },

    // Mechanical Engineering - 6th Semester
    { name: 'Power Plant Engineering', code: 'ME601', branch: 'Mechanical Engineering', semester: '6', credits: 4 },
    { name: 'Industrial Engineering', code: 'ME602', branch: 'Mechanical Engineering', semester: '6', credits: 3 },
    { name: 'Finite Element Analysis', code: 'ME603', branch: 'Mechanical Engineering', semester: '6', credits: 3 },
    { name: 'Automobile Engineering', code: 'ME604', branch: 'Mechanical Engineering', semester: '6', credits: 4 },
    { name: 'Elective II (ME)', code: 'MEE605E', branch: 'Mechanical Engineering', semester: '6', credits: 3 },

    // Mechanical Engineering - 7th Semester
    { name: 'Renewable Energy Systems', code: 'ME701', branch: 'Mechanical Engineering', semester: '7', credits: 4 },
    { name: 'Mechatronics', code: 'ME702', branch: 'Mechanical Engineering', semester: '7', credits: 3 },
    { name: 'Operations Research', code: 'ME703', branch: 'Mechanical Engineering', semester: '7', credits: 4 },
    { name: 'Robotics', code: 'ME704', branch: 'Mechanical Engineering', semester: '7', credits: 3 },
    { name: 'Elective III (ME)', code: 'MEE705E', branch: 'Mechanical Engineering', semester: '7', credits: 3 },

    // Mechanical Engineering - 8th Semester
    { name: 'Major Project', code: 'ME801P', branch: 'Mechanical Engineering', semester: '8', credits: 6 },
    { name: 'Advanced Manufacturing Processes', code: 'ME802', branch: 'Mechanical Engineering', semester: '8', credits: 3 },
    { name: 'Total Quality Management', code: 'ME803', branch: 'Mechanical Engineering', semester: '8', credits: 3 },
    { name: 'Elective IV (ME)', code: 'MEE804E', branch: 'Mechanical Engineering', semester: '8', credits: 3 },

    // --- Civil Engineering ---
    // Civil Engineering - 1st Semester
    { name: 'Mathematics I', code: 'MA101', branch: 'Civil Engineering', semester: '1', credits: 4 },
    { name: 'Physics', code: 'PH101', branch: 'Civil Engineering', semester: '1', credits: 3 },
    { name: 'Chemistry', code: 'CH101', branch: 'Civil Engineering', semester: '1', credits: 3 },
    { name: 'English Communication', code: 'EN101', branch: 'Civil Engineering', semester: '1', credits: 2 },
    { name: 'Engineering Mechanics', code: 'CE101', branch: 'Civil Engineering', semester: '1', credits: 4 },

    // Civil Engineering - 2nd Semester
    { name: 'Mathematics II', code: 'MA102', branch: 'Civil Engineering', semester: '2', credits: 4 },
    { name: 'Building Materials', code: 'CE201', branch: 'Civil Engineering', semester: '2', credits: 3 },
    { name: 'Surveying', code: 'CE202', branch: 'Civil Engineering', semester: '2', credits: 4 },
    { name: 'Concrete Technology', code: 'CE203', branch: 'Civil Engineering', semester: '2', credits: 3 },
    { name: 'Engineering Graphics', code: 'ME102', branch: 'Civil Engineering', semester: '2', credits: 2 },

    // Civil Engineering - 3rd Semester
    { name: 'Structural Analysis I', code: 'CE301', branch: 'Civil Engineering', semester: '3', credits: 4 },
    { name: 'Fluid Mechanics', code: 'CE302', branch: 'Civil Engineering', semester: '3', credits: 4 },
    { name: 'Soil Mechanics', code: 'CE303', branch: 'Civil Engineering', semester: '3', credits: 3 },
    { name: 'Transportation Engineering I', code: 'CE304', branch: 'Civil Engineering', semester: '3', credits: 3 },
    { name: 'Environmental Engineering I', code: 'CE305', branch: 'Civil Engineering', semester: '3', credits: 3 },

    // Civil Engineering - 4th Semester
    { name: 'Structural Analysis II', code: 'CE401', branch: 'Civil Engineering', semester: '4', credits: 4 },
    { name: 'Water Resources Engineering', code: 'CE402', branch: 'Civil Engineering', semester: '4', credits: 4 },
    { name: 'Geotechnical Engineering', code: 'CE403', branch: 'Civil Engineering', semester: '4', credits: 3 },
    { name: 'Transportation Engineering II', code: 'CE404', branch: 'Civil Engineering', semester: '4', credits: 3 },
    { name: 'Environmental Engineering II', code: 'CE405', branch: 'Civil Engineering', semester: '4', credits: 3 },

    // Civil Engineering - 5th Semester
    { name: 'Design of Steel Structures', code: 'CE501', branch: 'Civil Engineering', semester: '5', credits: 4 },
    { name: 'Hydrology', code: 'CE502', branch: 'Civil Engineering', semester: '5', credits: 3 },
    { name: 'Foundation Engineering', code: 'CE503', branch: 'Civil Engineering', semester: '5', credits: 4 },
    { name: 'Construction Technology & Management', code: 'CE504', branch: 'Civil Engineering', semester: '5', credits: 3 },
    { name: 'Elective (CE)', code: 'CEE505E', branch: 'Civil Engineering', semester: '5', credits: 3 },

    // Civil Engineering - 6th Semester
    { name: 'Reinforced Concrete Structures', code: 'CE601', branch: 'Civil Engineering', semester: '6', credits: 4 },
    { name: 'Quantity Surveying & Valuation', code: 'CE602', branch: 'Civil Engineering', semester: '6', credits: 3 },
    { name: 'Remote Sensing & GIS', code: 'CE603', branch: 'Civil Engineering', semester: '6', credits: 3 },
    { name: 'Pavement Design', code: 'CE604', branch: 'Civil Engineering', semester: '6', credits: 4 },
    { name: 'Elective II (CE)', code: 'CEE605E', branch: 'Civil Engineering', semester: '6', credits: 3 },

    // Civil Engineering - 7th Semester
    { name: 'Earthquake Engineering', code: 'CE701', branch: 'Civil Engineering', semester: '7', credits: 4 },
    { name: 'Bridge Engineering', code: 'CE702', branch: 'Civil Engineering', semester: '7', credits: 3 },
    { name: 'Urban Transportation Planning', code: 'CE703', branch: 'Civil Engineering', semester: '7', credits: 4 },
    { name: 'Prestressed Concrete', code: 'CE704', branch: 'Civil Engineering', semester: '7', credits: 3 },
    { name: 'Elective III (CE)', code: 'CEE705E', branch: 'Civil Engineering', semester: '7', credits: 3 },

    // Civil Engineering - 8th Semester
    { name: 'Major Project', code: 'CE801P', branch: 'Civil Engineering', semester: '8', credits: 6 },
    { name: 'Advanced Structural Design', code: 'CE802', branch: 'Civil Engineering', semester: '8', credits: 3 },
    { name: 'Environmental Impact Assessment', code: 'CE803', branch: 'Civil Engineering', semester: '8', credits: 3 },
    { name: 'Elective IV (CE)', code: 'CEE804E', branch: 'Civil Engineering', semester: '8', credits: 3 }
];

        let addedCount = 0;
        
        for (const subject of missingSubjects) {
            const exists = await Subject.findOne({ 
                code: subject.code, 
                branch: subject.branch, 
                semester: subject.semester 
            });
            
            if (!exists) {
                await Subject.create(subject);
                console.log(`✅ Added: ${subject.code} - ${subject.name}`);
                addedCount++;
            } else {
                console.log(`⏭️  Already exists: ${subject.code} - ${subject.name}`);
            }
        }
        
        console.log(`\n🎉 Process completed! Added ${addedCount} new subjects.`);
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

// Run once and exit
addMissingSubjects();