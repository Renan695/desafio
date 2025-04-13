import express from 'express';
import db from './config/db.js'; 
import dotenv from 'dotenv';
import cors from 'cors';

/* Configurações iniciais */
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

/* Criar cliente */
app.post('/cliente', async (req, res) => {
  const { nome, email, telefone, cpf } = req.body;

  if (!nome || !email || !telefone || !cpf) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO cliente (nome, email, telefone, cpf, data_criacao) VALUES (?, ?, ?, ?, NOW())',
      [nome, email, telefone, cpf]
    );

    res.status(201).json({
      id: results.insertId,
      nome,
      email,
      telefone,
      cpf
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Atualizar cliente */
app.put('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, cpf } = req.body;

  const campos = [];
  const valores = [];

  if (nome) {
    campos.push("nome = ?");
    valores.push(nome);
  }
  if (email) {
    campos.push("email = ?");
    valores.push(email);
  }
  if (telefone) {
    campos.push("telefone = ?");
    valores.push(telefone);
  }
  if (cpf) {
    campos.push("cpf = ?");
    valores.push(cpf);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado." });
  }

  try {
    const sql = `UPDATE cliente SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    const [result] = await db.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    res.status(200).json({ message: "Cliente atualizado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Deletar cliente */
app.delete('/cliente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM cliente WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    res.status(200).json({ message: "Cliente deletado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Listar clientes */
app.get('/cliente', async (req, res) => {
  try {
    const [clientes] = await db.query('SELECT * FROM cliente');
    res.status(200).json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Criar locação */
app.post('/locacao', async (req, res) => {
  const { nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo } = req.body;

  if (!nome || !tipo || !valor_hora || !tempo_minimo || !tempo_maximo) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, tipo, valor_hora, tempo_minimo e tempo_maximo." });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO locacao (nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo, data_criacao) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo]
    );

    res.status(201).json({
      id: results.insertId,
      nome,
      tipo,
      descricao,
      valor_hora,
      tempo_minimo,
      tempo_maximo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
