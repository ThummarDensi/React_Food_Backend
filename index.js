import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

// Path setup for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import Routers
import foodRouter from './src/routers/food.router.js';
import userRouter from './src/routers/user.router.js';
import orderRouter from './src/routers/order.router.js';
import uploadRouter from './src/routers/upload.router.js';

// DB connection
import { dbconnect } from './src/config/database.config.js';

const app = express();
app.use(express.json());

// ✅ CORS Configuration
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || [
  'http://localhost:3000',
  'https://react-foodordering.vercel.app'
];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  }
}));

// ✅ API Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// ✅ Serve static files from "public" folder (if exists)
const publicFolder = path.join(__dirname, 'public');
if (fs.existsSync(publicFolder)) {
  app.use(express.static(publicFolder));

  // Serve index.html for any unknown routes (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicFolder, 'index.html'));
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5001;

(async () => {
  await dbconnect();
  app.listen(PORT, () => {
    console.log(✅ Server running on port ${PORT});
  });
})();
