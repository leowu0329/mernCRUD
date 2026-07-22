// 【最重要】必須放在所有 import 的第一行，讓環境變數優先載入
import dotenv from 'dotenv';
dotenv.config();
// ==========================================
// 導入必要的第三方模組與自定義模組 (ES6 import 語法)
// ==========================================
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; // ES6 導入自定義檔案時需加上副檔名 .js
import apiRoutes from './routes/api.js';

// ==========================================
// 初始化 Express 應用程式與設定埠號
// ==========================================
const app = express();
// 設定伺服器運行埠號：優先使用環境變數 PORT，若無則預設為 3000
const PORT = process.env.PORT || 3000;  

// ==========================================
// 建立與資料庫的連線
// ==========================================
// 執行匯入的資料庫連線函式以初始化 MongoDB 連線
connectDB();

// ==========================================
// 設定跨來源資源共享 (CORS) 政策
// ==========================================
// 允許所有來源，並明確支援帶有憑證或自定義標頭的請求
app.use(cors({
  origin: '*', // 若正式環境需更安全，可改為前端網域陣列，例如 ["https://your-frontend.vercel.app"]
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 註解範例：若需限制特定來源，可改用以下寫法：
// app.use(cors({ 
//   origin: ["https://your-frontend-domain.com"],
// }));

// ==========================================
// 註冊全域中介軟體 (Middleware)
// ==========================================
// 解析客戶端傳遞的 JSON 格式請求主體 (Request Body)
app.use(express.json());

// ==========================================
// 設定 API 路由
// ==========================================
// 將所有以 '/api' 開頭的請求導向至 apiRoutes 路由模組進行處理
app.use('/api', apiRoutes);

// 根目錄測試路由
app.get('/', (req, res) => {
  res.send('MERN Server is running on Vercel!');
});

// ==========================================
// 處理所有路由的預檢請求 (Preflight Requests)
// ==========================================
// 針對複雜的 CORS 請求（如帶有自定義標頭或 PUT/DELETE 方法），確保 OPTIONS 請求能正確回應
app.options('/{*splat}', cors());

// ==========================================
// 啟動伺服器並傾聽指定埠號
// ==========================================
app.listen(PORT, () => {
  console.log(`伺服器目前正在運行於 http://localhost:${PORT}`);
});