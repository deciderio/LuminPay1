const db = require('../db/lumina.db');

class Wallet {
    /**
     * Crea una nueva billetera.
     * @param {number} userId - ID del usuario.
     * @param {number} agentId - ID del agente.
     * @returns {Promise<object>} La billetera creada.
     */
    static async create(userId, agentId) {
        const initialBalance = 0;
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO wallets (userId, agentId, balance) VALUES (?, ?, ?)',
                [userId, agentId, initialBalance],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        userId: userId,
                        agentId: agentId,
                        balance: initialBalance
                    });
                }
            );
        });
    }

    /**
     * Busca una billetera por ID de usuario.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<object|null>} La billetera del usuario.
     */
    static async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM wallets WHERE userId = ?', [userId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Busca una billetera por ID de agente.
     * @param {number} agentId - ID del agente.
     * @returns {Promise<object|null>} La billetera del agente.
     */
    static async findByAgentId(agentId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM wallets WHERE agentId = ?', [agentId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Actualiza el saldo de una billetera.
     * @param {number} id - ID de la billetera.
     * @param {number} newBalance - El nuevo saldo.
     * @returns {Promise<void>}
     */
    static async updateBalance(id, newBalance) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE wallets SET balance = ? WHERE id = ?',
                [newBalance, id],
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

module.exports = Wallet;