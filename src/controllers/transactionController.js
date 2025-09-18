const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');
const ilpHelper = require('../utils/ilpHelper');
const PaymentPointer = require('../models/paymentPointer');
const PendingIlpTransfer = require('../models/pendingIlpTransfer');

/**
 * Realiza una transferencia de dinero.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.transferMoney = async (req, res) => {
    const { fromUserId, toUserId, amount, currency } = req.body;

    try {
        const fromWallet = await Wallet.findByUserId(fromUserId);
        const toWallet = await Wallet.findByUserId(toUserId);

        if (!fromWallet || !toWallet) {
            return res.status(404).json({ message: 'Una o ambas billeteras no existen.' });
        }

        if (fromWallet.balance < amount) {
            return res.status(400).json({ message: 'Saldo insuficiente.' });
        }

        // 1. Crear la transacción como pendiente.
        const newTransaction = await Transaction.create(fromWallet.id, toWallet.id, amount, currency, 'pending');

        // 2. Realizar las actualizaciones de saldo de forma atómica (usando una transacción de base de datos).
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION;');
                db.run('UPDATE wallets SET balance = balance - ? WHERE id = ?;', [amount, fromWallet.id]);
                db.run('UPDATE wallets SET balance = balance + ? WHERE id = ?;', [amount, toWallet.id]);
                db.run('UPDATE transactions SET status = "completed" WHERE id = ?;', [newTransaction.id]);
                db.run('COMMIT;', (err) => {
                    if (err) {
                        db.run('ROLLBACK;');
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        res.status(200).json({ message: 'Transferencia completada exitosamente', transactionId: newTransaction.id });

    } catch (error) {
        console.error('Error en la transferencia:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Procesa un pago saliente a un Payment Pointer ILP.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.sendIlpPayment = async (req, res) => {
    const { fromUserId, toPaymentPointer, amount, currency } = req.body;

    try {
        const fromWallet = await Wallet.findByUserId(fromUserId);
        if (!fromWallet) {
            return res.status(404).json({ message: 'Billetera de origen no encontrada.' });
        }

        // Simula la llamada a la lógica de envío de ILP.
        const transfer = await ilpHelper.sendIlpTransfer(fromWallet, toPaymentPointer, amount, currency);

        // Crea un registro de la transferencia pendiente.
        await PendingIlpTransfer.create(transfer.id, amount, currency, toPaymentPointer, 'pending', null);

        res.status(202).json({
            message: 'Pago ILP iniciado. Esperando confirmación.',
            transferId: transfer.id
        });

    } catch (error) {
        console.error('Error al enviar pago ILP:', error);
        res.status(500).json({ message: 'Error al iniciar el pago ILP.' });
    }
};

/**
 * Maneja las notificaciones de pagos entrantes (webhook desde el conector ILP).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.handleIlpIncomingPayment = async (req, res) => {
    // Aquí se recibiría el webhook del conector ILP (ej. Moneyd)
    // Se valida la firma de la solicitud y se procesa el pago.

    try {
        const { paymentPointer, amount, currency } = req.body;

        const receivingPointer = await PaymentPointer.findByIlpAddress(paymentPointer);
        if (!receivingPointer) {
            return res.status(404).json({ message: 'Payment Pointer no encontrado.' });
        }

        const receivingWallet = await Wallet.findById(receivingPointer.walletId);
        
        // Simulación de la actualización atómica del saldo.
        await Wallet.updateBalance(receivingWallet.id, receivingWallet.balance + amount);

        // Se registra la transacción entrante.
        await Transaction.create(null, receivingWallet.id, amount, currency, 'completed');

        res.status(200).json({ message: 'Pago entrante procesado.' });
    } catch (error) {
        console.error('Error al procesar el pago entrante ILP:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el pago.' });
    }
};