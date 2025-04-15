import express from 'express';
import { criarReserva } from '../controllers/reservaController.js'; // puxa o controller

const router = express.Router();

router.post('/reservas', criarReserva); // cria a rota POST

export default router;
