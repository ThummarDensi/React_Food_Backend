import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Routers from src
import foodRouter from './src/routers/food.router.js';
import userRouter from './src/routers/user.router.js';
import orderRouter from './src/routers/order.router.js';
import uploadRouter from './src/routers/upload.router.js';
import { dbconnect } from './src/config/database.config.js';

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'react-foodordering.vercel.app' // replace with your Vercel domain
    ],
  })
);


app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// Serve public folder if needed
const publicFolder = path.join(__dirname, 'public');
if (fs.existsSync(publicFolder)) {
  app.use(express.static(publicFolder));
  app.get('*', (req, res) => {
    const indexFilePath = path.join(publicFolder, 'index.html');
    res.sendFile(indexFilePath);
  });
}

const PORT = process.env.PORT || 5001;
(async () => {
  await dbconnect();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
