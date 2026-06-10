import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lifeline_super_secret_jwt_key_2026';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let useMongo = false;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeline';

// Auto-clean connection string if it starts with MONGODB_URI= due to cached shell variables
if (MONGODB_URI.startsWith('MONGODB_URI=')) {
  MONGODB_URI = MONGODB_URI.substring('MONGODB_URI='.length);
}

// Connect to MongoDB with a 4-second timeout limit to avoid blocking startup
console.log("Reading MONGODB_URI connection string:", MONGODB_URI);

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 })
  .then(() => {
    console.log("MongoDB connected successfully");
    useMongo = true;
    seedDatabase(); // Seed default records if empty
  })
  .catch(err => {
    console.log("------------------------------------------------------------------");
    console.log("[LIFELINE DATABASE WARNING]");
    console.log("MongoDB connection failed. Reason:", err.message);
    console.log(">>> FALLING BACK TO LOCAL DB.JSON STORAGE MODE <<<");
    console.log("The application remains fully functional and will save data locally.");
    console.log("------------------------------------------------------------------");
    useMongo = false;
  });

// --- HELPER FUNCTIONS FOR FILE DATABASE FALLBACK ---
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { donors: [], requests: [], users: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(data);
    if (!db.users) db.users = [];
    return db;
  } catch (error) {
    console.error("Error reading db.json database file:", error);
    return { donors: [], requests: [], users: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing db.json database file:", error);
    return false;
  }
}

// --- MONGOOSE SCHEMAS & MODELS ---
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  lastDonationDate: { type: String, default: "" },
  available: { type: Boolean, default: true },
  distance: { type: String, default: "1.0 km" }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

const Donor = mongoose.model('Donor', donorSchema);

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  hospital: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  urgency: { type: String, required: true, enum: ['Critical', 'Moderate', 'Stable'] },
  description: { type: String, default: "No additional notes provided." },
  unitsFulfilled: { type: Number, default: 0 }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

// 3. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// --- SEED DATABASE FUNCTION ---
async function seedDatabase() {
  try {
    const donorCount = await Donor.countDocuments({});
    if (donorCount === 0) {
      console.log("Seeding default donors in MongoDB...");
      await Donor.create([
        { name: "Ravi Kumar", bloodGroup: "O-", city: "Chennai", phone: "+91 98765 43210", email: "ravi.kumar@example.com", lastDonationDate: "2026-03-10", available: true, distance: "2 km" },
        { name: "Anita Sharma", bloodGroup: "O-", city: "Chennai", phone: "+91 87654 32109", email: "anita.s@example.com", lastDonationDate: "2026-04-15", available: true, distance: "3 km" },
        { name: "Vikram Singh", bloodGroup: "A+", city: "Coimbatore", phone: "+91 76543 21098", email: "vikram.s@example.com", lastDonationDate: "2026-05-01", available: true, distance: "4 km" },
        { name: "Priyanka Patel", bloodGroup: "B+", city: "Madurai", phone: "+91 91234 56789", email: "priyanka.p@example.com", lastDonationDate: "2025-12-12", available: true, distance: "1.5 km" },
        { name: "Rahul Verma", bloodGroup: "AB+", city: "Salem", phone: "+91 99887 76655", email: "rahul.v@example.com", lastDonationDate: "2026-01-20", available: true, distance: "5 km" },
        { name: "Siddharth Das", bloodGroup: "O+", city: "Tiruchirappalli", phone: "+91 94432 12345", email: "sid.das@example.com", lastDonationDate: "2026-02-18", available: false, distance: "2.8 km" },
        { name: "Meera Nair", bloodGroup: "O-", city: "Chennai", phone: "+91 81234 56780", email: "meera.nair@example.com", lastDonationDate: "2026-05-20", available: true, distance: "6 km" }
      ]);
    }

    const requestCount = await Request.countDocuments({});
    if (requestCount === 0) {
      console.log("Seeding default emergency requests in MongoDB...");
      await Request.create([
        { patientName: "Aarav Mehta (Trauma Patient)", bloodGroup: "O-", units: 2, hospital: "Apollo Hospital", city: "Chennai", contact: "+91 90000 11111", urgency: "Critical", description: "Severe road accident victim. Immediate transfusion required within hours. Please contact urgently.", unitsFulfilled: 0 },
        { patientName: "Kavitha Reddy", bloodGroup: "AB-", units: 3, hospital: "Fortis Hospital", city: "Coimbatore", contact: "+91 98888 77777", urgency: "Moderate", description: "Scheduled heart bypass surgery on Friday. Requesting backup donors.", unitsFulfilled: 1 },
        { patientName: "Amit Saxena", bloodGroup: "B+", units: 4, hospital: "Kauvery Hospital", city: "Tiruchirappalli", contact: "+91 97777 66666", urgency: "Critical", description: "Patient undergoing chemotherapy. Platelets urgent support needed.", unitsFulfilled: 0 }
      ]);
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// --- API ROUTES ---

// --- AUTH ENDPOINTS ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields (name, email, password)" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    let userExists = false;
    if (useMongo && mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      userExists = !!existingUser;
    } else {
      const db = readDatabase();
      userExists = db.users.some(u => u.email === cleanEmail);
    }

    if (userExists) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = {};
    if (useMongo && mongoose.connection.readyState === 1) {
      newUser = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword
      });
    } else {
      const db = readDatabase();
      newUser = {
        id: 'u' + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeDatabase(db);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id || newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id || newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    if (useMongo && mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      const db = readDatabase();
      user = db.users.find(u => u.email === cleanEmail);
    }

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id || user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get Current User Profile (JWT Protected)
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user = null;
    if (useMongo && mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.userId).select('-password');
    } else {
      const db = readDatabase();
      user = db.users.find(u => u.id === decoded.userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired session token." });
  }
});

// --- CORE APP ENDPOINTS ---

// JWT Authentication verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Sign in required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired session token." });
  }
};

// Get impact and real-time statistics
app.get('/api/stats', async (req, res) => {
  try {
    if (useMongo && mongoose.connection.readyState === 1) {
      const totalDonors = await Donor.countDocuments({});
      const criticalRequests = await Request.countDocuments({ urgency: 'Critical' });
      const totalRequests = await Request.countDocuments({});

      res.json({
        annualUnitsNeeded: "14.6M",
        shelfLifeDays: "35–42",
        livesSavedPerDonation: 3,
        donationFrequency: "every 3mo",
        totalRegisteredDonors: totalDonors,
        criticalRequestsCount: criticalRequests,
        totalRequestsCount: totalRequests
      });
    } else {
      const db = readDatabase();
      res.json({
        annualUnitsNeeded: "14.6M",
        shelfLifeDays: "35–42",
        livesSavedPerDonation: 3,
        donationFrequency: "every 3mo",
        totalRegisteredDonors: db.donors.length,
        criticalRequestsCount: db.requests.filter(r => r.urgency === 'Critical').length,
        totalRequestsCount: db.requests.length
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load statistics" });
  }
});

// Get donors, filter by blood group and city
app.get('/api/donors', async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    if (useMongo && mongoose.connection.readyState === 1) {
      let filter = {};
      if (bloodGroup && bloodGroup !== 'All') {
        const cleanGroup = bloodGroup.trim().replace(' ', '+');
        filter.bloodGroup = cleanGroup;
      }
      if (city) {
        filter.city = { $regex: new RegExp(city.trim(), 'i') };
      }
      const filteredDonors = await Donor.find(filter);
      res.json(filteredDonors);
    } else {
      const db = readDatabase();
      let filteredDonors = db.donors;
      if (bloodGroup && bloodGroup !== 'All') {
        const cleanGroup = bloodGroup.trim().replace(' ', '+');
        filteredDonors = filteredDonors.filter(d => d.bloodGroup.toUpperCase() === cleanGroup.toUpperCase());
      }
      if (city) {
        const cleanCity = city.trim().toLowerCase();
        filteredDonors = filteredDonors.filter(d => d.city.toLowerCase().includes(cleanCity));
      }
      res.json(filteredDonors);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

// Register a new donor
app.post('/api/donors', authenticateToken, async (req, res) => {
  try {
    const { name, bloodGroup, city, phone, email, lastDonationDate, available } = req.body;

    if (!name || !bloodGroup || !city || !phone || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const randomDist = (Math.random() * 6 + 1).toFixed(1) + " km";
    const donorData = {
      name,
      bloodGroup: bloodGroup.trim().replace(' ', '+'),
      city,
      phone,
      email,
      lastDonationDate: lastDonationDate || "",
      available: available !== undefined ? available : true,
      distance: randomDist
    };

    if (useMongo && mongoose.connection.readyState === 1) {
      const newDonor = await Donor.create(donorData);
      res.status(201).json(newDonor);
    } else {
      const db = readDatabase();
      const newDonor = {
        id: 'd' + Date.now(),
        ...donorData
      };
      db.donors.push(newDonor);
      writeDatabase(db);
      res.status(201).json(newDonor);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to register donor" });
  }
});

// Get emergency requests, sorted by urgency (Critical first)
app.get('/api/requests', async (req, res) => {
  try {
    let requestsList = [];
    if (useMongo && mongoose.connection.readyState === 1) {
      requestsList = await Request.find({});
    } else {
      const db = readDatabase();
      requestsList = db.requests;
    }
    
    const urgencyWeight = {
      'Critical': 3,
      'Moderate': 2,
      'Stable': 1
    };

    const sortedRequests = [...requestsList].sort((a, b) => {
      const weightA = urgencyWeight[a.urgency] || 0;
      const weightB = urgencyWeight[b.urgency] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(sortedRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch emergency requests" });
  }
});

// Post an urgent request
app.post('/api/requests', authenticateToken, async (req, res) => {
  try {
    const { patientName, bloodGroup, units, hospital, city, contact, urgency, description } = req.body;

    if (!patientName || !bloodGroup || !units || !hospital || !city || !contact || !urgency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const requestData = {
      patientName,
      bloodGroup: bloodGroup.trim().replace(' ', '+'),
      units: parseInt(units, 10),
      hospital,
      city,
      contact,
      urgency,
      description: description || "No additional notes provided.",
      unitsFulfilled: 0
    };

    if (useMongo && mongoose.connection.readyState === 1) {
      const newRequest = await Request.create(requestData);
      res.status(201).json(newRequest);
    } else {
      const db = readDatabase();
      const newRequest = {
        id: 'r' + Date.now(),
        ...requestData,
        createdAt: new Date().toISOString()
      };
      db.requests.push(newRequest);
      writeDatabase(db);
      res.status(201).json(newRequest);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to post emergency request" });
  }
});

// Update/Respond to a request (fulfill units)
app.post('/api/requests/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (useMongo && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid request ID format." });
      }
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ error: "Emergency request not found" });
      }
      if (request.unitsFulfilled < request.units) {
        request.unitsFulfilled += 1;
        await request.save();
        res.json({ message: "Responded successfully", request });
      } else {
        res.status(400).json({ error: "Request is already fully met" });
      }
    } else {
      const db = readDatabase();
      const requestIndex = db.requests.findIndex(r => r.id === id);
      if (requestIndex === -1) {
        return res.status(404).json({ error: "Emergency request not found" });
      }
      const request = db.requests[requestIndex];
      if (request.unitsFulfilled < request.units) {
        request.unitsFulfilled += 1;
        writeDatabase(db);
        res.json({ message: "Responded successfully", request });
      } else {
        res.status(400).json({ error: "Request is already fully met" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to respond to request" });
  }
});

// Contact donor (log action)
app.post('/api/donors/:id/contact', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let donorName = "";
    let donorPhone = "";

    if (useMongo && mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid donor ID format." });
      }
      const donor = await Donor.findById(id);
      if (!donor) return res.status(404).json({ error: "Donor not found" });
      donorName = donor.name;
      donorPhone = donor.phone;
    } else {
      const db = readDatabase();
      const donor = db.donors.find(d => d.id === id);
      if (!donor) return res.status(404).json({ error: "Donor not found" });
      donorName = donor.name;
      donorPhone = donor.phone;
    }

    console.log(`[LIFELINE ALERT] Simulated SMS & Email sent to ${donorName} (${donorPhone}) for urgent request.`);
    res.json({ message: `Successfully sent critical notification alert to ${donorName}!` });
  } catch (err) {
    res.status(500).json({ error: "Failed to process donor alert" });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
