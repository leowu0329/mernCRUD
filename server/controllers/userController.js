/**
 * 引入使用者（User）的 Mongoose 資料模型（Model）
 * 透過解構賦值或直接引入，用於對 MongoDB 中的 users 資料集進行 CRUD 操作
 */
import User from '../models/user.js'; // 註：若專案使用 ES Module 語法，請確保 package.json 設定了 "type": "module"

/**
 * 定義一個包含使用者相關商務邏輯的控制器物件
 * 採用 ES6 物件字面值縮寫與箭頭函式（Arrow Functions）編寫
 */
const userController = {
  
  /**
   * @route   GET /api/users?limit=10
   * @desc    取得所有使用者資料（支援透過 Query 參數限制回傳數量）
   */
  getAllUsers: async (req, res) => {
    try {
      // 從網址的 Query String 中解構取得 limit 參數（例如：GET /api/users?limit=5）
      const { limit } = req.query;
      
      /**
       * 向 MongoDB 查詢使用者資料
       * 1. User.find() 取得所有符合條件的文件
       * 2. .limit() 若 limit 存在則限制回傳的資料筆數，若為 undefined 則不限數量
       */
      const users = await User.find().limit(limit);
      
      // 將查詢到的使用者資料陣列以 JSON 格式回傳給前端（HTTP 狀態碼預設為 200）
      return res.status(200).json(users);
    } catch (error) {
      // 捕捉伺服器或資料庫查詢過程中的例外錯誤，並輸出至終端機（Terminal）供開發者排查
      console.error('Error fetching users:', error);
      
      // 回傳 HTTP 500（Internal Server Error）狀態碼與錯誤訊息給前端
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * @route   POST /api/users
   * @desc    接收前端資料並新增一位使用者
   */
  createUser: async (req, res) => {
    // 使用 ES6 物件解構賦值，從前端傳來的 HTTP Request Body 中取出對應欄位
    const { name, email, age } = req.body;
    
    // 利用 User 模型實例化一個全新的文件物件（Document），準備寫入資料庫
    const newUser = new User({ name, email, age });

    try {
      // 將新使用者資料非同步（Async）儲存到 MongoDB 中，並取得包含系統自動生成 _id 的完整文件
      const savedUser = await newUser.save();
      
      // 將儲存成功後的完整使用者資料以 JSON 格式回傳給前端，狀態碼 200
      return res.status(200).json(savedUser);
    } catch (error) {
      // 記錄寫入失敗的錯誤細節
      console.error('Error creating user:', error);
      
      // 回傳 500 伺服器內部錯誤與訊息
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * @route   DELETE /api/users/:userId
   * @desc    透過網址動態參數取得指定 ID 並將其使用者資料刪除
   */
  deleteUser: async (req, res) => {
    // 從網址動態參數（URL Params）中解構取得要刪除的使用者 ID
    const { userId } = req.params;
    
    try {
      // 呼叫 Mongoose 的 findByIdAndDelete 方法，透過 ID尋找對應文件並自資料庫中移除
      const deletedUser = await User.findByIdAndDelete(userId);
      
      // 如果資料庫中找不到該 ID 的使用者（回傳結果為 null），立即回傳 404 狀態碼並終止後續執行
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // 刪除成功，回傳狀態碼 200、成功提示訊息，並附帶已被刪除的使用者資料供前端核對
      return res.status(200).json({ 
        message: 'User deleted successfully', 
        deletedUser 
      });
    } catch (error) {
      // 記錄刪除過程中的非預期錯誤
      console.error('Error deleting user:', error);
      
      // 回傳 500 伺服器內部錯誤訊息
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * @route   PUT /api/users/:userId
   * @desc    透過網址動態參數與 Request Body 更新指定 ID 的使用者資料
   */
  updateUser: async (req, res) => {
    // 從網址動態參數中取得要更新的使用者 ID
    const { userId } = req.params;
    
    // 從 HTTP Body 中解構取得前端傳來要修改的最新欄位資料
    const { name, email, age } = req.body;

    try {
      /**
       * 呼叫 Mongoose 的 findByIdAndUpdate 方法進行更新
       * 參數說明：
       * 1. userId: 要尋找的文件 ID
       * 2. { name, email, age }: 要更新的新欄位資料
       * 3. { new: true }: 確保回傳的是「更新後」的最新資料，而非更新前的舊資料
       */
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, age },
        { new: true } 
      );

      // 如果找不到該 ID 的使用者，立即回傳 404 狀態碼並終止程式
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 更新成功，回傳狀態碼 200、成功提示及更新後的最新使用者物件
      return res.status(200).json({ 
        message: 'User updated successfully', 
        updatedUser 
      });
    } catch (error) {
      // 記錄更新過程中的例外錯誤
      console.error('Error updating user:', error);
      
      // 回傳 500 伺服器內部錯誤狀態碼與訊息
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

};

/**
 * 將設定好的 userController 物件以 ES6 語法匯出
 * 讓路由檔案（Routes）可以進行引入並呼叫對應的控制器方法
 */
export default userController;