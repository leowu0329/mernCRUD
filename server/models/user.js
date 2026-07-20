// 引入 mongoose 套件，用於在 Node.js 中操作 MongoDB 資料庫 (使用 ES6 import 語法)
import mongoose from 'mongoose';

/**
 * 定義使用者的資料綱要 (Schema)
 * Schema 決定了寫入 MongoDB 文件的欄位名稱、資料型態以及驗證規則
 */
const userSchema = new mongoose.Schema({
  // 欄位 1：使用者姓名
  name: {
    type: String, // 指定資料型態為字串 (String)
  },
  
  // 欄位 2：電子郵件
  email: {
    type: String,   // 指定資料型態為字串 (String)
    required: true, // 必填欄位驗證：若儲存時此欄位為空，Mongoose 會拋出錯誤
    unique: true,   // 唯一值索引：確保資料庫中不會有重複的 Email。
                    // 注意：這會在 MongoDB 中建立一個 Unique Index
  },
  
  // 欄位 3：年齡
  age: {
    type: Number, // 指定資料型態為數字 (Number)
  },
});

/**
 * 根據定義好的 userSchema 建立並編譯成資料模型 (Model)
 * * 參數說明：
 * 1. 'User'：模型的名稱。Mongoose 預設會自動將其轉為「小寫、複數形」
 * 作為資料庫中的 Collection 名稱。因此在 MongoDB 中對應的集合名稱會是 `users`。
 * 2. userSchema：此模型要遵循的資料結構綱要。
 */
const User = mongoose.model('User', userSchema);

// 將 User 模型以預設導出 (Default Export) 方式匯出，讓專案中的其他檔案可以使用 ES6 import 進行引入與 CRUD 操作
export default User;