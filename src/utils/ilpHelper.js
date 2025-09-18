// src/helpers/ilpHelper.js
const axios = require('axios');
const { getDbConnection } = require('../db/luminaDb'); // función para conectarse a tu SQLite

const ILP_BASE_URL = process.env.ILP_BASE_URL || 'http://localhost:3000';

/**
 * Crear un payment pointer para un usuario registrado en LuminaPay
 * @param {number} userId
 * @returns {Promise<string>} paymentPointer
 */
async function createPaymentPointer(userId) {
    try {
        // Primero, verifica que el usuario exista en la DB
        const db = getDbConnection();
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (!user) throw new Error(`Usuario con ID ${userId} no encontrado.`);

        // Llamada al endpoint ILP
        const response = await axios.post(`${ILP_BASE_URL}/payment_pointers`, { userId });
        const paymentPointer = response.data.paymentPointer;

        // Guarda el payment pointer en la DB de LuminaPay
        db.prepare('INSERT INTO payment_pointers (user_id, pointer) VALUES (?, ?)').run(userId, paymentPointer);

        return paymentPointer;
    } catch (error) {
        console.error('[ILP Helper] Error creando payment pointer:', error.message);
        throw error;
    }
}

/**
 * Obtener balance de un wallet de LuminaPay
 * @param {number} walletId
 * @returns {Promise<number>} balance
 */
async function getBalance(walletId) {
    try {
        const db = getDbConnection();
        const wallet = db.prepare('SELECT * FROM wallets WHERE id = ?').get(walletId);

        if (!wallet) throw new Error(`Wallet con ID ${walletId} no encontrado.`);

        // Suponiendo que tu ILP connector tiene endpoint para balance
        const response = await axios.get(`${ILP_BASE_URL}/wallets/${walletId}/balance`);
        return response.data.balance;
    } catch (error) {
        console.error('[ILP Helper] Error obteniendo balance:', error.message);
        throw error;
    }
}

/**
 * Enviar transferencia ILP
 * @param {number} fromWalletId
 * @param {string} toPaymentPointer
 * @param {number} amount
 * @returns {Promise<Object>} resultado de la transferencia
 */
async function sendTransfer(fromWalletId, toPaymentPointer, amount) {
    try {
        const db = getDbConnection();
        const wallet = db.prepare('SELECT * FROM wallets WHERE id = ?').get(fromWalletId);

        if (!wallet) throw new Error(`Wallet con ID ${fromWalletId} no encontrado.`);
        if (amount <= 0) throw new Error('El monto debe ser mayor a 0');

        const response = await axios.post(`${ILP_BASE_URL}/transfers`, {
            fromWalletId,
            toPaymentPointer,
            amount
        });

        // Guardar transferencia en la DB
        db.prepare(
            `INSERT INTO transactions (from_wallet_id, to_pointer, amount, status, created_at)
             VALUES (?, ?, ?, ?, ?)`
        ).run(fromWalletId, toPaymentPointer, amount, response.data.status, new Date().toISOString());

        return response.data;
    } catch (error) {
        console.error('[ILP Helper] Error enviando transferencia:', error.message);
        throw error;
    }
}

module.exports = {
    createPaymentPointer,
    getBalance,
    sendTransfer
};
