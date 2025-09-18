const Agent = require('../models/agent');
const Wallet = require('../models/wallet');

/**
 * Registra un nuevo agente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.registerAgent = async (req, res) => {
    try {
        const { name } = req.body;
        const existingAgent = await Agent.findByName(name);

        if (existingAgent) {
            return res.status(409).json({ message: 'El nombre del agente ya existe.' });
        }

        const newAgent = await Agent.create(name);

        // Crear una billetera para el nuevo agente.
        await Wallet.create(null, newAgent.id);

        res.status(201).json({ message: 'Agente registrado exitosamente', agentId: newAgent.id });
    } catch (error) {
        console.error('Error al registrar agente:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * Obtiene la información de un agente por su ID.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await Agent.findById(id);

        if (!agent) {
            return res.status(404).json({ message: 'Agente no encontrado.' });
        }

        res.status(200).json(agent);
    } catch (error) {
        console.error('Error al obtener agente:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};