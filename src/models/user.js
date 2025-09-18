const db = require('../db/lumina.db');

class User {
    /**
     * Crea un nuevo usuario en la base de datos.
     * @param {string} username - El nombre de usuario.
     * @param {string} passwordHash - El hash de la contraseña del usuario.
     * @returns {Promise<object>} El objeto del usuario creado.
     */
    static async create(username, passwordHash) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO users (username, passwordHash) VALUES (?, ?)',
                [username, passwordHash],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        id: this.lastID,
                        username: username
                    });
                }
            );
        });
    }

    /**
     * Busca un usuario por su ID.
     * @param {number} id - El ID del usuario.
     * @returns {Promise<object|null>} El objeto del usuario o null si no se encuentra.
     */
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    /**
     * Busca un usuario por su nombre de usuario.
     * @param {string} username - El nombre de usuario.
     * @returns {Promise<object|null>} El objeto del usuario o null si no se encuentra.
     */
    static async findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

module.exports = User;