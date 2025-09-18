const db = require('../db/lumina.db');

class PaymentPointer {
    /**
     * Crea un nuevo Payment Pointer.
     * @param {string} ilpAddress - La dirección ILP del pointer.
     * @param {number} walletId - ID de la billetera asociada.
     * @returns {Promise<object>} El objeto del pointer creado.
     */
    static async create(ilpAddress, walletId) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO paymentPointers (ilpAddress, walletId) VALUES (?, ?)',
                [ilpAddress, walletId],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        ilpAddress: ilpAddress,
                        walletId: walletId
                    });
                }
            );
        });
    }

    /**
     * Busca un Payment Pointer por su ID.
     * @param {number} id - ID del pointer.
     * @returns {Promise<object|null>} El objeto del pointer.
     */
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM paymentPointers WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Busca un Payment Pointer por la dirección ILP.
     * @param {string} ilpAddress - La dirección ILP.
     * @returns {Promise<object|null>} El objeto del pointer.
     */
    static async findByIlpAddress(ilpAddress) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM paymentPointers WHERE ilpAddress = ?', [ilpAddress], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

module.exports = PaymentPointer;