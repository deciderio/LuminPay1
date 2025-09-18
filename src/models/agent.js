const db = require('../db/lumina.db');

class Agent {
    /**
     * Crea un nuevo agente en la base de datos.
     * @param {string} name - El nombre del agente.
     * @returns {Promise<object>} El objeto del agente creado.
     */
    static async create(name) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO agents (name) VALUES (?)',
                [name],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        name: name
                    });
                }
            );
        });
    }

    /**
     * Busca un agente por su ID.
     * @param {number} id - El ID del agente.
     * @returns {Promise<object|null>} El objeto del agente o null si no se encuentra.
     */
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM agents WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Busca un agente por su nombre.
     * @param {string} name - El nombre del agente.
     * @returns {Promise<object|null>} El objeto del agente o null si no se encuentra.
     */
    static async findByName(name) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM agents WHERE name = ?', [name], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

module.exports = Agent;