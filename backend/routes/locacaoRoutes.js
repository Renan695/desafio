import express from 'express';
import {
  criarLocacao,
  listarLocacoes,
  atualizarLocacao,
  deletarLocacao,
  listarLocacoesDisponiveis
} from '../controllers/locacaoController.js';

const router = express.Router();

// Criar nova locação
router.post('/locacao', criarLocacao);

// Listar todas as locações
router.get('/locacao', listarLocacoes);

// Atualizar locação existente
router.put('/locacao/:id', atualizarLocacao);

// Deletar locação
router.delete('/locacao/:id', deletarLocacao);

// Listar locações disponíveis (por data)
router.get('/locacao/disponiveis', listarLocacoesDisponiveis);

export default router;
