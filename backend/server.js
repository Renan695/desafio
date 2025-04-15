import express from 'express';
import db from './config/db.js'; 
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Criar Cliente
app.post('/cliente', async (req, res) => {
  const { nome, email, telefone, cpf } = req.body;

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

// Atualizar Cliente
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

// Deletar Cliente
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

// Listar Clientes
app.get('/cliente', async (req, res) => {
  try {
    const [clientes] = await db.query('SELECT * FROM cliente');
    res.status(200).json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar Locação
app.post('/locacao', async (req, res) => {
  const { nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo } = req.body;

  try {
    const [results] = await db.query(
      'INSERT INTO locacao (nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo, data_criacao) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nome, tipo, descricao || null, valor_hora, tempo_minimo, tempo_maximo]
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

// Listar Locações
app.get('/locacao', async (req, res) => {
  try {
    const [locacoes] = await db.query('SELECT * FROM locacao');
    res.status(200).json(locacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar Locação
app.put('/locacao/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo } = req.body;

  const campos = [];
  const valores = [];

  if (nome) {
    campos.push("nome = ?");
    valores.push(nome);
  }
  if (tipo) {
    campos.push("tipo = ?");
    valores.push(tipo);
  }
  if (descricao !== undefined) {
    campos.push("descricao = ?");
    valores.push(descricao);
  }
  if (valor_hora) {
    campos.push("valor_hora = ?");
    valores.push(valor_hora);
  }
  if (tempo_minimo) {
    campos.push("tempo_minimo = ?");
    valores.push(tempo_minimo);
  }
  if (tempo_maximo) {
    campos.push("tempo_maximo = ?");
    valores.push(tempo_maximo);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado." });
  }

  try {
    const sql = `UPDATE locacao SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    const [result] = await db.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Locação não encontrada." });
    }

    res.status(200).json({ message: "Locação atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar Locação
app.delete('/locacao/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM locacao WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Locação não encontrada." });
    }

    res.status(200).json({ message: "Locação deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar Reserva
app.post('/reserva', async (req, res) => {
  const { cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao } = req.body;

  try {
    const [results] = await db.query(
      'INSERT INTO reserva (cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao, data_criacao) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao]
    );

    res.status(201).json({
      id: results.insertId,
      cliente_id,
      locacao_id,
      data_inicio,
      data_fim,
      valor_final,
      situacao
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar Reservas
app.get('/reserva', async (req, res) => {
  try {
    const [reservas] = await db.query('SELECT * FROM reserva');
    res.status(200).json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar Reserva
app.put('/reserva/:id', async (req, res) => {
  const { id } = req.params;
  const { data_inicio, data_fim, valor_final, situacao } = req.body;

  const campos = [];
  const valores = [];

  if (data_inicio) {
    campos.push("data_inicio = ?");
    valores.push(data_inicio);
  }
  if (data_fim) {
    campos.push("data_fim = ?");
    valores.push(data_fim);
  }
  if (valor_final) {
    campos.push("valor_final = ?");
    valores.push(valor_final);
  }
  if (situacao) {
    campos.push("situacao = ?");
    valores.push(situacao);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado." });
  }

  try {
    const sql = `UPDATE reserva SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(id);

    const [result] = await db.query(sql, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json({ message: "Reserva atualizada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar Reserva
app.delete('/reserva/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM reserva WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json({ message: "Reserva deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar uma reserva específica por ID
app.get('/reserva/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [reservas] = await db.query('SELECT * FROM reserva WHERE id = ?', [id]);

    if (reservas.length === 0) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.status(200).json(reservas[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar Locações Disponíveis
app.get('/locacao/disponiveis', async (req, res) => {
  const { data_inicio, data_fim } = req.query;

  if (!data_inicio || !data_fim) {
    return res.status(400).json({ error: "Você precisa informar data_inicio e data_fim no formato YYYY-MM-DD HH:MM:SS" });
  }

  try {
    const [locacoesDisponiveis] = await db.query(`
      SELECT l.*
      FROM locacao l
      WHERE l.id NOT IN (
        SELECT r.locacao_id
        FROM reserva r
        WHERE NOT (
          r.data_fim <= ? OR r.data_inicio >= ?
        )
      )
    `, [data_inicio, data_fim]);

    res.status(200).json(locacoesDisponiveis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
