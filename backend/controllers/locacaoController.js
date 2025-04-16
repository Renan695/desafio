import db from '../config/db.js';

// Criar nova locação
export const criarLocacao = async (req, res) => {
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
};

// Listar todas as locações
export const listarLocacoes = async (req, res) => {
  try {
    const [locacoes] = await db.query('SELECT * FROM locacao');
    res.status(200).json(locacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar locação existente
export const atualizarLocacao = async (req, res) => {
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
};

// Deletar locação
export const deletarLocacao = async (req, res) => {
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
};

// Listar locações disponíveis entre datas
export const listarLocacoesDisponiveis = async (req, res) => {
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
};
