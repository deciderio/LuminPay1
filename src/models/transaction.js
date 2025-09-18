const db = require('../db/lumina.db');

class Transaction {
    /**
     * Crea un nuevo registro de transacción.
     * @param {number} fromWalletId - ID de la billetera de origen.
     * @param {number} toWalletId - ID de la billetera de destino.
     * @param {number} amount - El monto de la transacción.
     * @param {string} currency - La moneda de la transacción.
     * @param {string} status - El estado de la transacción (e.g., 'pending', 'completed', 'failed').
     * @returns {Promise<object>} El objeto de la transacción creada.
     */
    static async create(fromWalletId, toWalletId, amount, currency, status) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO transactions (fromWalletId, toWalletId, amount, currency, status) VALUES (?, ?, ?, ?, ?)',
                [fromWalletId, toWalletId, amount, currency, status],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        fromWalletId: fromWalletId,
                        toWalletId: toWalletId,
                        amount: amount,
                        currency: currency,
                        status: status
                    });
                }
            );
        });
    }

    /**
     * Busca una transacción por su ID.
     * @param {number} id - El ID de la transacción.
     * @returns {Promise<object|null>} El objeto de la transacción o null.
     */
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Actualiza el estado de una transacción.
     * @param {number} id - El ID de la transacción.
     * @param {string} newStatus - El nuevo estado.
     * @returns {Promise<void>}
     */
    static async updateStatus(id, newStatus) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE transactions SET status = ? WHERE id = ?',
                [newStatus, id],
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

module.exports = Transaction;