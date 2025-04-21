import db from '../config/db.js';

// Criar nova locação
export const criarLocacao = async (req, res) => {
  const { nome, tipo, descricao, valor_hora, tempo_minimo, tempo_maximo } = req.body;

  if (tempo_maximo < tempo_minimo) {
    return res.status(400).json({ error: "O tempo máximo não pode ser menor que o tempo mínimo." });
  }

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

  // Verifica se algum dos tempos foi enviado
  if (tempo_minimo !== undefined || tempo_maximo !== undefined) {
    try {
      const [rows] = await db.query('SELECT tempo_minimo, tempo_maximo FROM locacao WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Locação não encontrada." });
      }

      const locacao = rows[0];
      const tempoMin = tempo_minimo !== undefined ? tempo_minimo : locacao.tempo_minimo;
      const tempoMax = tempo_maximo !== undefined ? tempo_maximo : locacao.tempo_maximo;

      if (tempoMax < tempoMin) {
        return res.status(400).json({ error: "O tempo máximo não pode ser menor que o tempo mínimo." });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

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
  if (tempo_minimo !== undefined) {
    campos.push("tempo_minimo = ?");
    valores.push(tempo_minimo);
  }
  if (tempo_maximo !== undefined) {
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

// Listar todas as locações com dias disponíveis entre datas
export const listarLocacoesDisponiveis = async (req, res) => {
  const { data_inicio, data_fim } = req.query;

  if (!data_inicio || !data_fim) {
    return res.status(400).json({
      error: "Você precisa informar data_inicio e data_fim no formato YYYY-MM-DD HH:MM:SS"
    });
  }

  try {
    const [locacoes] = await db.query(`SELECT * FROM locacao`);

    const [reservas] = await db.query(`
      SELECT locacao_id, data_inicio, data_fim FROM reserva
      WHERE (
        (data_inicio BETWEEN ? AND ?) OR
        (data_fim BETWEEN ? AND ?) OR
        (? BETWEEN data_inicio AND data_fim) OR
        (? BETWEEN data_inicio AND data_fim)
      ) AND situacao = 'ativa'
    `, [data_inicio, data_fim, data_inicio, data_fim, data_inicio, data_fim]);

    const reservasMap = {};
    reservas.forEach(({ locacao_id, data_inicio, data_fim }) => {
      if (!reservasMap[locacao_id]) reservasMap[locacao_id] = [];
      reservasMap[locacao_id].push({ data_inicio, data_fim });
    });

    const gerarDiasDisponiveis = (inicio, fim, reservas) => {
      const diasDisponiveis = [];
      const current = new Date(inicio);
      const end = new Date(fim);

      while (current <= end) {
        const diaAtual = current.toISOString().slice(0, 10);
        const ocupado = reservas.some(reserva => {
          const ini = new Date(reserva.data_inicio);
          const fim = new Date(reserva.data_fim);
          return current >= ini && current <= fim;
        });

        if (!ocupado) diasDisponiveis.push(diaAtual);
        current.setDate(current.getDate() + 1);
      }

      return diasDisponiveis;
    };

    const locacoesComDisponibilidade = locacoes.map(loc => {
      const reservasLocacao = reservasMap[loc.id] || [];
      const dias_disponiveis = gerarDiasDisponiveis(data_inicio, data_fim, reservasLocacao);
      return {
        ...loc,
        dias_disponiveis
      };
    });

    res.status(200).json(locacoesComDisponibilidade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
