import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('成功連線至 MongoDB 資料庫');
  } catch (error) {
    console.error('連線至 MongoDB 時發生錯誤:', error);
    process.exit(1);
  }
};

export default connectDB;