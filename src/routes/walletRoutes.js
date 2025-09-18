const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Ruta para obtener el saldo de la billetera de un usuario
// GET /api/wallets/:userId/balance
router.get('/:userId/balance', walletController.getWalletBalance);

module.exports = router;