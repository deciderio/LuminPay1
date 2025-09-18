const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Ruta para registrar un nuevo agente
// POST /api/agents/register
router.post('/register', agentController.registerAgent);

// Ruta para obtener la información de un agente por su ID
// GET /api/agents/:id
router.get('/:id', agentController.getAgentById);

module.exports = router;