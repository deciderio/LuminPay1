const db = require('../db/lumina.db');

class PendingIlpTransfer {
    /**
     * Crea un registro de transferencia ILP pendiente.
     * @param {string} transferId - El ID de la transferencia ILP.
     * @param {number} amount - El monto de la transferencia.
     * @param {string} currency - La moneda.
     * @param {string} destination - La dirección de destino ILP.
     * @param {string} status - Estado de la transferencia (e.g., 'pending', 'fulfilled').
     * @param {number} transactionId - ID de la transacción asociada.
     * @returns {Promise<object>} El objeto de la transferencia pendiente.
     */
    static async create(transferId, amount, currency, destination, status, transactionId) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO pendingIlpTransfers (transferId, amount, currency, destination, status, transactionId) VALUES (?, ?, ?, ?, ?, ?)',
                [transferId, amount, currency, destination, status, transactionId],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        transferId: transferId,
                        amount: amount,
                        currency: currency,
                        destination: destination,
                        status: status,
                        transactionId: transactionId
                    });
                }
            );
        });
    }

    /**
     * Busca una transferencia pendiente por su ID de transferencia ILP.
     * @param {string} transferId - El ID de la transferencia ILP.
     * @returns {Promise<object|null>} El objeto de la transferencia pendiente.
     */
    static async findByTransferId(transferId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pendingIlpTransfers WHERE transferId = ?', [transferId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Actualiza el estado de una transferencia pendiente.
     * @param {string} transferId - El ID de la transferencia ILP.
     * @param {string} newStatus - El nuevo estado.
     * @returns {Promise<void>}
     */
    static async updateStatus(transferId, newStatus) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE pendingIlpTransfers SET status = ? WHERE transferId = ?',
                [newStatus, transferId],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }
            );
        });
    }
}

module.exports = PendingIlpTransfer;