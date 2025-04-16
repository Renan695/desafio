import express from 'express';
import { criarCliente, atualizarCliente, deletarCliente, listarClientes } from '../controllers/clienteController.js'; // Importando funções do controller

const router = express.Router();

// Rota para criar um cliente
router.post('/cliente', criarCliente);

// Rota para atualizar um cliente
router.put('/cliente/:id', atualizarCliente);

// Rota para deletar um cliente
router.delete('/cliente/:id', deletarCliente);

// Rota para listar todos os clientes
router.get('/cliente', listarClientes);

export default router;
