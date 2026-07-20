import mongoose from 'mongoose';

// MongoDB Atlas 叢集的連線字串（包含認證帳密、副本集與 SSL 設定）
const mongoURI = 'mongodb://ryowu0329:im4Yc8heF0W44g3x@ac-gxryylv-shard-00-00.v8k6yif.mongodb.net:27017,ac-gxryylv-shard-00-01.v8k6yif.mongodb.net:27017,ac-gxryylv-shard-00-02.v8k6yif.mongodb.net:27017/crud?ssl=true&replicaSet=atlas-397f4r-shard-0&authSource=admin&appName=mern';

/**
 * 非同步函式：負責建立與 MongoDB 資料庫的連線
 * 採用 async/await 來處理可能發生的非同步錯誤
 */
const connectDB = async () => {
  try {
    // 嘗試連線至 MongoDB
    // 註解：在現代的 Mongoose (v6+) 中，舊有的 useNewUrlParser 與 useUnifiedTopology 
    // 已經被原生內建，因此可以安全移除，讓連線設定保持簡潔。
    await mongoose.connect(mongoURI);

    console.log('成功連線至 MongoDB 資料庫');
  } catch (error) {
    // 當連線失敗時（例如：帳密錯誤、網路中斷、IP 未加入白名單），捕捉錯誤並終止行程
    console.error('連線至 MongoDB 時發生錯誤:', error);
    
    // 結束 Node.js 進程，狀態碼 1 代表「未捕捉的致命錯誤異常」導致程式強制退出
    process.exit(1);
  }
};

// 使用 ES6 的 export default 匯出連線函式
export default connectDB;