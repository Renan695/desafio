import express from 'express';
import { criarReserva } from '../controllers/reservaController.js';

const router = express.Router();

/* Definição das rotas para reservas */
router.post('/reservas', criarReserva);

export default router;
