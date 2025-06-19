const sampleSubjects = [
    // --- Computer Science Engineering ---
    // Computer Science Engineering - 1st Semester
    { _id: 'cs101', name: 'Mathematics I', code: 'MA101', branch: 'Computer Science Engineering', semester: '1', credits: 4 },
    { _id: 'cs102', name: 'Physics', code: 'PH101', branch: 'Computer Science Engineering', semester: '1', credits: 3 },
    { _id: 'cs103', name: 'Chemistry', code: 'CH101', branch: 'Computer Science Engineering', semester: '1', credits: 3 },
    { _id: 'cs104', name: 'English Communication', code: 'EN101', branch: 'Computer Science Engineering', semester: '1', credits: 2 },
    { _id: 'cs105', name: 'Computer Programming', code: 'CS101', branch: 'Computer Science Engineering', semester: '1', credits: 4 },

    // Computer Science Engineering - 2nd Semester
    { _id: 'cs201', name: 'Mathematics II', code: 'MA102', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { _id: 'cs202', name: 'Data Structures', code: 'CS201', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { _id: 'cs203', name: 'Digital Logic Design', code: 'CS202', branch: 'Computer Science Engineering', semester: '2', credits: 3 },
    { _id: 'cs204', name: 'Object Oriented Programming', code: 'CS203', branch: 'Computer Science Engineering', semester: '2', credits: 4 },
    { _id: 'cs205', name: 'Engineering Graphics', code: 'ME102', branch: 'Computer Science Engineering', semester: '2', credits: 2 },

    // Computer Science Engineering - 3rd Semester
    { _id: 'cs301', name: 'Algorithms', code: 'CS301', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { _id: 'cs302', name: 'Computer Organization', code: 'CS302', branch: 'Computer Science Engineering', semester: '3', credits: 3 },
    { _id: 'cs303', name: 'Database Management Systems', code: 'CS303', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { _id: 'cs304', name: 'Operating Systems', code: 'CS304', branch: 'Computer Science Engineering', semester: '3', credits: 4 },
    { _id: 'cs305', name: 'Discrete Mathematics', code: 'MA301', branch: 'Computer Science Engineering', semester: '3', credits: 3 },

    // Computer Science Engineering - 4th Semester
    { _id: 'cs401', name: 'Software Engineering', code: 'CS401', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { _id: 'cs402', name: 'Computer Networks', code: 'CS402', branch: 'Computer Science Engineering', semester: '4', credits: 4 },
    { _id: 'cs403', name: 'Theory of Computation', code: 'CS403', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { _id: 'cs404', name: 'Web Technologies', code: 'CS404', branch: 'Computer Science Engineering', semester: '4', credits: 3 },
    { _id: 'cs405', name: 'Mathematics III', code: 'MA401', branch: 'Computer Science Engineering', semester: '4', credits: 4 },

    // Computer Science Engineering - 5th Semester
    { _id: 'cs501', name: 'Machine Learning', code: 'CS501', branch: 'Computer Science Engineering', semester: '5', credits: 4 },
    { _id: 'cs502', name: 'Compiler Design', code: 'CS502', branch: 'Computer Science Engineering', semester: '5', credits: 3 },
    { _id: 'cs503', name: 'Computer Graphics', code: 'CS503', branch: 'Computer Science Engineering', semester: '5', credits: 3 },
    { _id: 'cs504', name: 'Artificial Intelligence', code: 'CS504', branch: 'Computer Science Engineering', semester: '5', credits: 4 },
    { _id: 'cs505', name: 'Cyber Security', code: 'CS505', branch: 'Computer Science Engineering', semester: '5', credits: 3 },

    // Computer Science Engineering - 6th Semester
    { _id: 'cs601', name: 'Mobile Application Development', code: 'CS601', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { _id: 'cs602', name: 'Cloud Computing', code: 'CS602', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { _id: 'cs603', name: 'Data Mining', code: 'CS603', branch: 'Computer Science Engineering', semester: '6', credits: 4 },
    { _id: 'cs604', name: 'Information Security', code: 'CS604', branch: 'Computer Science Engineering', semester: '6', credits: 3 },
    { _id: 'cs605', name: 'Project Management', code: 'CS605', branch: 'Computer Science Engineering', semester: '6', credits: 2 },

    // Computer Science Engineering - 7th Semester
    { _id: 'cs701', name: 'Deep Learning', code: 'CS701', branch: 'Computer Science Engineering', semester: '7', credits: 4 },
    { _id: 'cs702', name: 'Big Data Analytics', code: 'CS702', branch: 'Computer Science Engineering', semester: '7', credits: 4 },
    { _id: 'cs703', name: 'Natural Language Processing', code: 'CS703', branch: 'Computer Science Engineering', semester: '7', credits: 3 },
    { _id: 'cs704', name: 'Distributed Systems', code: 'CS704', branch: 'Computer Science Engineering', semester: '7', credits: 3 },
    { _id: 'cs705', name: 'Elective I (CSE)', code: 'CSE705E', branch: 'Computer Science Engineering', semester: '7', credits: 3 },

    // Computer Science Engineering - 8th Semester
    { _id: 'cs801', name: 'Capstone Project', code: 'CS801P', branch: 'Computer Science Engineering', semester: '8', credits: 6 },
    { _id: 'cs802', name: 'Blockchain Technology', code: 'CS802', branch: 'Computer Science Engineering', semester: '8', credits: 3 },
    { _id: 'cs803', name: 'Internet of Things (IoT)', code: 'CS803', branch: 'Computer Science Engineering', semester: '8', credits: 3 },
    { _id: 'cs804', name: 'Elective II (CSE)', code: 'CSE804E', branch: 'Computer Science Engineering', semester: '8', credits: 3 },

    // --- Information Technology ---
    // Information Technology - 1st Semester
    { _id: 'it101', name: 'Mathematics I', code: 'MA101', branch: 'Information Technology', semester: '1', credits: 4 },
    { _id: 'it102', name: 'Physics', code: 'PH101', branch: 'Information Technology', semester: '1', credits: 3 },
    { _id: 'it103', name: 'Chemistry', code: 'CH101', branch: 'Information Technology', semester: '1', credits: 3 },
    { _id: 'it104', name: 'English Communication', code: 'EN101', branch: 'Information Technology', semester: '1', credits: 2 },
    { _id: 'it105', name: 'Computer Fundamentals', code: 'IT101', branch: 'Information Technology', semester: '1', credits: 3 },

    // Information Technology - 2nd Semester
    { _id: 'it201', name: 'Mathematics II', code: 'MA102', branch: 'Information Technology', semester: '2', credits: 4 },
    { _id: 'it202', name: 'Programming in C', code: 'IT201', branch: 'Information Technology', semester: '2', credits: 4 },
    { _id: 'it203', name: 'Digital Electronics', code: 'IT202', branch: 'Information Technology', semester: '2', credits: 3 },
    { _id: 'it204', name: 'Data Structures', code: 'IT203', branch: 'Information Technology', semester: '2', credits: 4 },
    { _id: 'it205', name: 'Engineering Graphics', code: 'ME102', branch: 'Information Technology', semester: '2', credits: 2 },

    // Information Technology - 3rd Semester
    { _id: 'it301', name: 'Object Oriented Programming', code: 'IT301', branch: 'Information Technology', semester: '3', credits: 4 },
    { _id: 'it302', name: 'Database Systems', code: 'IT302', branch: 'Information Technology', semester: '3', credits: 4 },
    { _id: 'it303', name: 'Computer Networks', code: 'IT303', branch: 'Information Technology', semester: '3', credits: 3 },
    { _id: 'it304', name: 'Software Engineering', code: 'IT304', branch: 'Information Technology', semester: '3', credits: 3 },
    { _id: 'it305', name: 'Statistics', code: 'MA302', branch: 'Information Technology', semester: '3', credits: 3 },

    // Information Technology - 4th Semester
    { _id: 'it401', name: 'Web Technologies', code: 'IT401', branch: 'Information Technology', semester: '4', credits: 4 },
    { _id: 'it402', name: 'Operating Systems', code: 'IT402', branch: 'Information Technology', semester: '4', credits: 3 },
    { _id: 'it403', name: 'System Analysis & Design', code: 'IT403', branch: 'Information Technology', semester: '4', credits: 3 },
    { _id: 'it404', name: 'Computer Architecture', code: 'IT404', branch: 'Information Technology', semester: '4', credits: 3 },
    { _id: 'it405', name: 'Cyber Security Fundamentals', code: 'IT405', branch: 'Information Technology', semester: '4', credits: 3 },

    // Information Technology - 5th Semester
    { _id: 'it501', name: 'Data Communication', code: 'IT501', branch: 'Information Technology', semester: '5', credits: 3 },
    { _id: 'it502', name: 'Cloud Computing', code: 'IT502', branch: 'Information Technology', semester: '5', credits: 4 },
    { _id: 'it503', name: 'Artificial Intelligence', code: 'IT503', branch: 'Information Technology', semester: '5', credits: 4 },
    { _id: 'it504', name: 'Theory of Computation', code: 'IT504', branch: 'Information Technology', semester: '5', credits: 3 },
    { _id: 'it505', name: 'Python Programming', code: 'IT505', branch: 'Information Technology', semester: '5', credits: 3 },

    // Information Technology - 6th Semester
    { _id: 'it601', name: 'Machine Learning', code: 'IT601', branch: 'Information Technology', semester: '6', credits: 4 },
    { _id: 'it602', name: 'Network Security', code: 'IT602', branch: 'Information Technology', semester: '6', credits: 3 },
    { _id: 'it603', name: 'Mobile Application Development', code: 'IT603', branch: 'Information Technology', semester: '6', credits: 3 },
    { _id: 'it604', name: 'Big Data Technologies', code: 'IT604', branch: 'Information Technology', semester: '6', credits: 4 },
    { _id: 'it605', name: 'Elective (IT)', code: 'ITE605E', branch: 'Information Technology', semester: '6', credits: 3 },

    // Information Technology - 7th Semester
    { _id: 'it701', name: 'Cyber Security & Forensics', code: 'IT701', branch: 'Information Technology', semester: '7', credits: 4 },
    { _id: 'it702', name: 'Cloud Infrastructure & Services', code: 'IT702', branch: 'Information Technology', semester: '7', credits: 3 },
    { _id: 'it703', name: 'Data Warehousing & Mining', code: 'IT703', branch: 'Information Technology', semester: '7', credits: 4 },
    { _id: 'it704', name: 'Mobile Computing', code: 'IT704', branch: 'Information Technology', semester: '7', credits: 3 },
    { _id: 'it705', name: 'Elective II (IT)', code: 'ITE705E', branch: 'Information Technology', semester: '7', credits: 3 },

    // Information Technology - 8th Semester
    { _id: 'it801', name: 'Major Project', code: 'IT801P', branch: 'Information Technology', semester: '8', credits: 6 },
    { _id: 'it802', name: 'IT Infrastructure Management', code: 'IT802', branch: 'Information Technology', semester: '8', credits: 3 },
    { _id: 'it803', name: 'Ethical Hacking', code: 'IT803', branch: 'Information Technology', semester: '8', credits: 3 },
    { _id: 'it804', name: 'Elective III (IT)', code: 'ITE804E', branch: 'Information Technology', semester: '8', credits: 3 },

    // --- Electronics & Communication Engineering ---
    // Electronics & Communication Engineering - 1st Semester
    { _id: 'ec101', name: 'Mathematics I', code: 'MA101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 4 },
    { _id: 'ec102', name: 'Physics', code: 'PH101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },
    { _id: 'ec103', name: 'Chemistry', code: 'CH101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },
    { _id: 'ec104', name: 'English Communication', code: 'EN101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 2 },
    { _id: 'ec105', name: 'Basic Electrical Engineering', code: 'EE101', branch: 'Electronics & Communication Engineering', semester: '1', credits: 3 },

    // Electronics & Communication Engineering - 2nd Semester
    { _id: 'ec201', name: 'Mathematics II', code: 'MA102', branch: 'Electronics & Communication Engineering', semester: '2', credits: 4 },
    { _id: 'ec202', name: 'Electronic Devices', code: 'EC201', branch: 'Electronics & Communication Engineering', semester: '2', credits: 4 },
    { _id: 'ec203', name: 'Circuit Analysis', code: 'EC202', branch: 'Electronics & Communication Engineering', semester: '2', credits: 3 },
    { _id: 'ec204', name: 'Digital Electronics', code: 'EC203', branch: 'Electronics & Communication Engineering', semester: '2', credits: 3 },
    { _id: 'ec205', name: 'Engineering Graphics', code: 'ME102', branch: 'Electronics & Communication Engineering', semester: '2', credits: 2 },

    // Electronics & Communication Engineering - 3rd Semester
    { _id: 'ec301', name: 'Analog Electronics', code: 'EC301', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { _id: 'ec302', name: 'Signals & Systems', code: 'EC302', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { _id: 'ec303', name: 'Network Analysis', code: 'EC303', branch: 'Electronics & Communication Engineering', semester: '3', credits: 3 },
    { _id: 'ec304', name: 'Digital Signal Processing', code: 'EC304', branch: 'Electronics & Communication Engineering', semester: '3', credits: 4 },
    { _id: 'ec305', name: 'Electromagnetic Theory', code: 'EC305', branch: 'Electronics & Communication Engineering', semester: '3', credits: 3 },

    // Electronics & Communication Engineering - 4th Semester
    { _id: 'ec401', name: 'Communication Systems', code: 'EC401', branch: 'Electronics & Communication Engineering', semester: '4', credits: 4 },
    { _id: 'ec402', name: 'Microprocessors', code: 'EC402', branch: 'Electronics & Communication Engineering', semester: '4', credits: 4 },
    { _id: 'ec403', name: 'Control Systems', code: 'EC403', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },
    { _id: 'ec404', name: 'VLSI Design', code: 'EC404', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },
    { _id: 'ec405', name: 'Antenna Theory', code: 'EC405', branch: 'Electronics & Communication Engineering', semester: '4', credits: 3 },

    // Electronics & Communication Engineering - 5th Semester
    { _id: 'ec501', name: 'Linear Integrated Circuits', code: 'EC501', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { _id: 'ec502', name: 'Microcontrollers', code: 'EC502', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { _id: 'ec503', name: 'Data Communication Networks', code: 'EC503', branch: 'Electronics & Communication Engineering', semester: '5', credits: 3 },
    { _id: 'ec504', name: 'Digital Communication', code: 'EC504', branch: 'Electronics & Communication Engineering', semester: '5', credits: 4 },
    { _id: 'ec505', name: 'Elective (ECE)', code: 'ECE505E', branch: 'Electronics & Communication Engineering', semester: '5', credits: 3 },

    // Electronics & Communication Engineering - 6th Semester
    { _id: 'ec601', name: 'Power Electronics', code: 'EC601', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },
    { _id: 'ec602', name: 'Embedded Systems', code: 'EC602', branch: 'Electronics & Communication Engineering', semester: '6', credits: 4 },
    { _id: 'ec603', name: 'Wireless Communication', code: 'EC603', branch: 'Electronics & Communication Engineering', semester: '6', credits: 4 },
    { _id: 'ec604', name: 'Optical Communication', code: 'EC604', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },
    { _id: 'ec605', name: 'Elective II (ECE)', code: 'ECE605E', branch: 'Electronics & Communication Engineering', semester: '6', credits: 3 },

    // Electronics & Communication Engineering - 7th Semester
    { _id: 'ec701', name: 'Digital Image Processing', code: 'EC701', branch: 'Electronics & Communication Engineering', semester: '7', credits: 4 },
    { _id: 'ec702', name: 'Satellite Communication', code: 'EC702', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },
    { _id: 'ec703', name: 'Biomedical Instrumentation', code: 'EC703', branch: 'Electronics & Communication Engineering', semester: '7', credits: 4 },
    { _id: 'ec704', name: 'Robotics and Automation', code: 'EC704', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },
    { _id: 'ec705', name: 'Elective III (ECE)', code: 'ECE705E', branch: 'Electronics & Communication Engineering', semester: '7', credits: 3 },

    // Electronics & Communication Engineering - 8th Semester
    { _id: 'ec801', name: 'Major Project', code: 'EC801P', branch: 'Electronics & Communication Engineering', semester: '8', credits: 6 },
    { _id: 'ec802', name: 'Advanced Digital Signal Processing', code: 'EC802', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },
    { _id: 'ec803', name: 'Radar Systems', code: 'EC803', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },
    { _id: 'ec804', name: 'Elective IV (ECE)', code: 'ECE804E', branch: 'Electronics & Communication Engineering', semester: '8', credits: 3 },

    // --- Mechanical Engineering ---
    // Mechanical Engineering - 1st Semester
    { _id: 'me101', name: 'Mathematics I', code: 'MA101', branch: 'Mechanical Engineering', semester: '1', credits: 4 },
    { _id: 'me102', name: 'Physics', code: 'PH101', branch: 'Mechanical Engineering', semester: '1', credits: 3 },
    { _id: 'me103', name: 'Chemistry', code: 'CH101', branch: 'Mechanical Engineering', semester: '1', credits: 3 },
    { _id: 'me104', name: 'English Communication', code: 'EN101', branch: 'Mechanical Engineering', semester: '1', credits: 2 },
    { _id: 'me105', name: 'Engineering Mechanics', code: 'ME101', branch: 'Mechanical Engineering', semester: '1', credits: 4 },

    // Mechanical Engineering - 2nd Semester
    { _id: 'me201', name: 'Mathematics II', code: 'MA102', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { _id: 'me202', name: 'Thermodynamics', code: 'ME201', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { _id: 'me203', name: 'Materials Science', code: 'ME202', branch: 'Mechanical Engineering', semester: '2', credits: 3 },
    { _id: 'me204', name: 'Manufacturing Processes', code: 'ME203', branch: 'Mechanical Engineering', semester: '2', credits: 4 },
    { _id: 'me205', name: 'Engineering Graphics', code: 'ME102', branch: 'Mechanical Engineering', semester: '2', credits: 2 },

    // Mechanical Engineering - 3rd Semester
    { _id: 'me301', name: 'Fluid Mechanics', code: 'ME301', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { _id: 'me302', name: 'Strength of Materials', code: 'ME302', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { _id: 'me303', name: 'Machine Design I', code: 'ME303', branch: 'Mechanical Engineering', semester: '3', credits: 3 },
    { _id: 'me304', name: 'Heat Transfer', code: 'ME304', branch: 'Mechanical Engineering', semester: '3', credits: 4 },
    { _id: 'me305', name: 'Kinematics of Machines', code: 'ME305', branch: 'Mechanical Engineering', semester: '3', credits: 3 },

    // Mechanical Engineering - 4th Semester
    { _id: 'me401', name: 'Applied Thermodynamics', code: 'ME401', branch: 'Mechanical Engineering', semester: '4', credits: 4 },
    { _id: 'me402', name: 'Theory of Machines', code: 'ME402', branch: 'Mechanical Engineering', semester: '4', credits: 4 },
    { _id: 'me403', name: 'Manufacturing Technology', code: 'ME403', branch: 'Mechanical Engineering', semester: '4', credits: 3 },
    { _id: 'me404', name: 'Metrology and Quality Control', code: 'ME404', branch: 'Mechanical Engineering', semester: '4', credits: 3 },
    { _id: 'me405', name: 'Machine Design II', code: 'ME405', branch: 'Mechanical Engineering', semester: '4', credits: 3 },

    // Mechanical Engineering - 5th Semester
    { _id: 'me501', name: 'Fluid Machinery', code: 'ME501', branch: 'Mechanical Engineering', semester: '5', credits: 4 },
    { _id: 'me502', name: 'Internal Combustion Engines', code: 'ME502', branch: 'Mechanical Engineering', semester: '5', credits: 4 },
    { _id: 'me503', name: 'Dynamics of Machinery', code: 'ME503', branch: 'Mechanical Engineering', semester: '5', credits: 3 },
    { _id: 'me504', name: 'Refrigeration & Air Conditioning', code: 'ME504', branch: 'Mechanical Engineering', semester: '5', credits: 3 },
    { _id: 'me505', name: 'Elective (ME)', code: 'MEE505E', branch: 'Mechanical Engineering', semester: '5', credits: 3 },

    // Mechanical Engineering - 6th Semester
    { _id: 'me601', name: 'Power Plant Engineering', code: 'ME601', branch: 'Mechanical Engineering', semester: '6', credits: 4 },
    { _id: 'me602', name: 'Industrial Engineering', code: 'ME602', branch: 'Mechanical Engineering', semester: '6', credits: 3 },
    { _id: 'me603', name: 'Finite Element Analysis', code: 'ME603', branch: 'Mechanical Engineering', semester: '6', credits: 3 },
    { _id: 'me604', name: 'Automobile Engineering', code: 'ME604', branch: 'Mechanical Engineering', semester: '6', credits: 4 },
    { _id: 'me605', name: 'Elective II (ME)', code: 'MEE605E', branch: 'Mechanical Engineering', semester: '6', credits: 3 },

    // Mechanical Engineering - 7th Semester
    { _id: 'me701', name: 'Renewable Energy Systems', code: 'ME701', branch: 'Mechanical Engineering', semester: '7', credits: 4 },
    { _id: 'me702', name: 'Mechatronics', code: 'ME702', branch: 'Mechanical Engineering', semester: '7', credits: 3 },
    { _id: 'me703', name: 'Operations Research', code: 'ME703', branch: 'Mechanical Engineering', semester: '7', credits: 4 },
    { _id: 'me704', name: 'Robotics', code: 'ME704', branch: 'Mechanical Engineering', semester: '7', credits: 3 },
    { _id: 'me705', name: 'Elective III (ME)', code: 'MEE705E', branch: 'Mechanical Engineering', semester: '7', credits: 3 },

    // Mechanical Engineering - 8th Semester
    { _id: 'me801', name: 'Major Project', code: 'ME801P', branch: 'Mechanical Engineering', semester: '8', credits: 6 },
    { _id: 'me802', name: 'Advanced Manufacturing Processes', code: 'ME802', branch: 'Mechanical Engineering', semester: '8', credits: 3 },
    { _id: 'me803', name: 'Total Quality Management', code: 'ME803', branch: 'Mechanical Engineering', semester: '8', credits: 3 },
    { _id: 'me804', name: 'Elective IV (ME)', code: 'MEE804E', branch: 'Mechanical Engineering', semester: '8', credits: 3 },

    // --- Civil Engineering ---
    // Civil Engineering - 1st Semester
    { _id: 'ce101', name: 'Mathematics I', code: 'MA101', branch: 'Civil Engineering', semester: '1', credits: 4 },
    { _id: 'ce102', name: 'Physics', code: 'PH101', branch: 'Civil Engineering', semester: '1', credits: 3 },
    { _id: 'ce103', name: 'Chemistry', code: 'CH101', branch: 'Civil Engineering', semester: '1', credits: 3 },
    { _id: 'ce104', name: 'English Communication', code: 'EN101', branch: 'Civil Engineering', semester: '1', credits: 2 },
    { _id: 'ce105', name: 'Engineering Mechanics', code: 'CE101', branch: 'Civil Engineering', semester: '1', credits: 4 },

    // Civil Engineering - 2nd Semester
    { _id: 'ce201', name: 'Mathematics II', code: 'MA102', branch: 'Civil Engineering', semester: '2', credits: 4 },
    { _id: 'ce202', name: 'Building Materials', code: 'CE201', branch: 'Civil Engineering', semester: '2', credits: 3 },
    { _id: 'ce203', name: 'Surveying', code: 'CE202', branch: 'Civil Engineering', semester: '2', credits: 4 },
    { _id: 'ce204', name: 'Concrete Technology', code: 'CE203', branch: 'Civil Engineering', semester: '2', credits: 3 },
    { _id: 'ce205', name: 'Engineering Graphics', code: 'ME102', branch: 'Civil Engineering', semester: '2', credits: 2 },

    // Civil Engineering - 3rd Semester
    { _id: 'ce301', name: 'Structural Analysis I', code: 'CE301', branch: 'Civil Engineering', semester: '3', credits: 4 },
    { _id: 'ce302', name: 'Fluid Mechanics', code: 'CE302', branch: 'Civil Engineering', semester: '3', credits: 4 },
    { _id: 'ce303', name: 'Soil Mechanics', code: 'CE303', branch: 'Civil Engineering', semester: '3', credits: 3 },
    { _id: 'ce304', name: 'Transportation Engineering I', code: 'CE304', branch: 'Civil Engineering', semester: '3', credits: 3 },
    { _id: 'ce305', name: 'Environmental Engineering I', code: 'CE305', branch: 'Civil Engineering', semester: '3', credits: 3 },

    // Civil Engineering - 4th Semester
    { _id: 'ce401', name: 'Structural Analysis II', code: 'CE401', branch: 'Civil Engineering', semester: '4', credits: 4 },
    { _id: 'ce402', name: 'Water Resources Engineering', code: 'CE402', branch: 'Civil Engineering', semester: '4', credits: 4 },
    { _id: 'ce403', name: 'Geotechnical Engineering', code: 'CE403', branch: 'Civil Engineering', semester: '4', credits: 3 },
    { _id: 'ce404', name: 'Transportation Engineering II', code: 'CE404', branch: 'Civil Engineering', semester: '4', credits: 3 },
    { _id: 'ce405', name: 'Environmental Engineering II', code: 'CE405', branch: 'Civil Engineering', semester: '4', credits: 3 },

    // Civil Engineering - 5th Semester
    { _id: 'ce501', name: 'Design of Steel Structures', code: 'CE501', branch: 'Civil Engineering', semester: '5', credits: 4 },
    { _id: 'ce502', name: 'Hydrology', code: 'CE502', branch: 'Civil Engineering', semester: '5', credits: 3 },
    { _id: 'ce503', name: 'Foundation Engineering', code: 'CE503', branch: 'Civil Engineering', semester: '5', credits: 4 },
    { _id: 'ce504', name: 'Construction Technology & Management', code: 'CE504', branch: 'Civil Engineering', semester: '5', credits: 3 },
    { _id: 'ce505', name: 'Elective (CE)', code: 'CEE505E', branch: 'Civil Engineering', semester: '5', credits: 3 },

    // Civil Engineering - 6th Semester
    { _id: 'ce601', name: 'Reinforced Concrete Structures', code: 'CE601', branch: 'Civil Engineering', semester: '6', credits: 4 },
    { _id: 'ce602', name: 'Quantity Surveying & Valuation', code: 'CE602', branch: 'Civil Engineering', semester: '6', credits: 3 },
    { _id: 'ce603', name: 'Remote Sensing & GIS', code: 'CE603', branch: 'Civil Engineering', semester: '6', credits: 3 },
    { _id: 'ce604', name: 'Pavement Design', code: 'CE604', branch: 'Civil Engineering', semester: '6', credits: 4 },
    { _id: 'ce605', name: 'Elective II (CE)', code: 'CEE605E', branch: 'Civil Engineering', semester: '6', credits: 3 },

    // Civil Engineering - 7th Semester
    { _id: 'ce701', name: 'Earthquake Engineering', code: 'CE701', branch: 'Civil Engineering', semester: '7', credits: 4 },
    { _id: 'ce702', name: 'Bridge Engineering', code: 'CE702', branch: 'Civil Engineering', semester: '7', credits: 3 },
    { _id: 'ce703', name: 'Urban Transportation Planning', code: 'CE703', branch: 'Civil Engineering', semester: '7', credits: 4 },
    { _id: 'ce704', name: 'Prestressed Concrete', code: 'CE704', branch: 'Civil Engineering', semester: '7', credits: 3 },
    { _id: 'ce705', name: 'Elective III (CE)', code: 'CEE705E', branch: 'Civil Engineering', semester: '7', credits: 3 },

    // Civil Engineering - 8th Semester
    { _id: 'ce801', name: 'Major Project', code: 'CE801P', branch: 'Civil Engineering', semester: '8', credits: 6 },
    { _id: 'ce802', name: 'Advanced Structural Design', code: 'CE802', branch: 'Civil Engineering', semester: '8', credits: 3 },
    { _id: 'ce803', name: 'Environmental Impact Assessment', code: 'CE803', branch: 'Civil Engineering', semester: '8', credits: 3 },
    { _id: 'ce804', name: 'Elective IV (CE)', code: 'CEE804E', branch: 'Civil Engineering', semester: '8', credits: 3 },
];

export default sampleSubjects;