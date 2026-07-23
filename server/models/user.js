import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // 欄位 1：使用者姓名
  name: {
    type: String, 
  },
  email: {
    type: String,   
    required: true, 
    unique: true             
  },
  age: {
    type: Number, 
  },
});

const User = mongoose.model('User', userSchema);
export default User;