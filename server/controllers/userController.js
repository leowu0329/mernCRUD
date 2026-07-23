import User from '../models/user.js'; 

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const { limit } = req.query;
      const users = await User.find().limit(limit);

      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createUser: async (req, res) => {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });

    try {
      const savedUser = await newUser.save();
      return res.status(200).json(savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  deleteUser: async (req, res) => {
    const { userId } = req.params;
    
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ 
        message: 'User deleted successfully', 
        deletedUser 
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { name, email, age } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, age },
        { new: true } 
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ 
        message: 'User updated successfully', 
        updatedUser 
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

};

export default userController;