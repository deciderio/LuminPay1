const User = require('../models/user');
const Wallet = require('../models/wallet');
const bcrypt = require('bcrypt');

/**
 * Registra un nuevo usuario.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findByUsername(username);

        if (existingUser) {
            return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create(username, passwordHash);

        // También creamos una billetera para el nuevo usuario.
        await Wallet.create(newUser.id, null);

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Autentica a un usuario.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Aquí se podría generar un JWT o una sesión.
        res.status(200).json({ message: 'Inicio de sesión exitoso', userId: user.id });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ... otros métodos para actualizar perfil, etc.