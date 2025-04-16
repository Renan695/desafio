import express from 'express';
import { criarReserva, listarReservas, atualizarReserva, deletarReserva } from '../controllers/reservaController.js';

const router = express.Router();

// Rota para criar uma reserva
router.post('/reserva', criarReserva);

// Rota para listar todas as reservas
router.get('/reserva', listarReservas);

// Rota para atualizar uma reserva
router.put('/reserva/:id', atualizarReserva);

// Rota para deletar uma reserva
router.delete('/reserva/:id', deletarReserva);

export default router;
