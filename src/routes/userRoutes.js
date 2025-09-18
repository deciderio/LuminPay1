const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
// POST /api/users/register
router.post('/register', userController.registerUser);

// Ruta para el inicio de sesión del usuario
// POST /api/users/login
router.post('/login', userController.loginUser);

module.exports = router;