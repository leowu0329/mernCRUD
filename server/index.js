import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; 
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;  

connectDB();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('MERN Server is running on Vercel!');
});

app.options('/{*splat}', cors());

app.listen(PORT, () => {
  console.log(`伺服器目前正在運行於 http://localhost:${PORT}`);
});