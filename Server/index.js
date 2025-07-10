import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer'; // ✅ Add multer

// Optional if using environment/config/db
// import dotenv from 'dotenv';
// import userRoutes from './Routes/UserRoute.js'
// import connectDB from './Database/ConnectDB.js';
// dotenv.config();
// connectDB();

const app = express();

// ✅ Multer configuration
const storage = multer.memoryStorage(); // Or use diskStorage if you want to store on disk
const upload = multer({ storage });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.post('/test', async (req, res) => {
  console.log(req.body.message);
  return res.status(200).json({ message: "Client and Server connected successfully!" });
});

// ✅ Upload route with multer
app.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    const uploadedFile = req.file; // ✅ multer makes this available

    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log("Received file:", uploadedFile.originalname);
    return res.status(200).json({ message: "File received", filename: uploadedFile.originalname });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error occurred" });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
