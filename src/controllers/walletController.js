const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const ilpHelper = require('../utils/ilpHelper');
const PaymentPointer = require('../models/paymentPointer');
const PendingIlpTransfer = require('../models/pendingIlpTransfer');

/**
 * Obtiene el saldo de una billetera.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getWalletBalance = async (req, res) => {
    try {
        const { userId } = req.params; // Suponiendo que el ID del usuario está en la URL.
        const wallet = await Wallet.findByUserId(userId);

        if (!wallet) {
            return res.status(404).json({ message: 'Billetera no encontrada.' });
        }

        res.status(200).json({ balance: wallet.balance, currency: 'USD' }); // Ejemplo con USD
    } catch (error) {
        console.error('Error al obtener el saldo:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};