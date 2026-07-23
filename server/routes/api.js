import express from 'express';
const router = express.Router();

import UserController from '../controllers/userController.js';

router.get('/users', UserController.getAllUsers);
router.post('/addUser', UserController.createUser);
router.delete('/users/:userId', UserController.deleteUser);
router.put('/users/:userId', UserController.updateUser);

export default router;