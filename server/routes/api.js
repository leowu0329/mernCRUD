/**
 * @file userRoute.js
 * @description 使用者相關的路由設定檔（ES6 模組化版本），負責將不同的 HTTP 請求分發至對應的 UserController 函式處理。
 */

// 引入 Express 核心框架模組（使用 ES6 import 語法）
import express from 'express';

// 建立一個 Express 路由器執行個體，用於模組化路由管理
const router = express.Router();

// 引入負責處理使用者商業邏輯與資料庫互動的控制器（使用 ES6 import 語法）
import UserController from '../controllers/userController.js';

/**
 * @route   GET /users
 * @desc    取得所有使用者清單
 * @access  Public
 */
router.get('/users', UserController.getAllUsers);

/**
 * @route   POST /addUser
 * @desc    新增一筆使用者資料
 * @access  Public
 */
router.post('/addUser', UserController.createUser);

/**
 * @route   DELETE /users/:userId
 * @desc    依據使用者 ID 刪除指定的使用者資料
 * @access  Public
 * @param   {string} userId - 網址路徑參數，代表使用者的唯一識別碼
 */
router.delete('/users/:userId', UserController.deleteUser);

/**
 * @route   PUT /users/:userId
 * @desc    依據使用者 ID 更新指定的使用者資料
 * @access  Public
 * @param   {string} userId - 網址路徑參數，代表使用者的唯一識別碼
 */
router.put('/users/:userId', UserController.updateUser);

// 預設匯出此路由器模組（使用 ES6 export default 語法），以便在主應用程式中引入並掛載
export default router;