import express from 'express';
import {
  criarReserva,
  listarReservas,
  atualizarReserva,
  deletarReserva,
  verificarDisponibilidade
} from '../controllers/reservaController.js';

const router = express.Router();

router.get('/reserva', listarReservas);
router.post('/reserva', criarReserva);
router.put('/reserva/:id', atualizarReserva);
router.delete('/reserva/:id', deletarReserva);
router.get('/verificar-disponibilidade', verificarDisponibilidade);

export default router;

