const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Ruta para realizar una transferencia de dinero interna entre usuarios
// POST /api/transactions/transfer
router.post('/transfer', transactionController.transferMoney);

// Ruta para enviar un pago a un Payment Pointer ILP
// POST /api/transactions/ilp-pay
router.post('/ilp-pay', transactionController.sendIlpPayment);

// Ruta para recibir pagos entrantes a través de un webhook (normalmente de un conector ILP)
// POST /api/transactions/ilp-receive
router.post('/ilp-receive', transactionController.handleIlpIncomingPayment);

module.exports = router;