import db from '../config/db.js';

// Função para criar uma nova reserva
export async function criarReserva(req, res) {
  try {
    const { cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao } = req.body;

    const [result] = await db.execute(
      `INSERT INTO reserva (cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao, data_criacao)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [cliente_id, locacao_id, data_inicio, data_fim, valor_final, situacao]
    );

    res.status(201).json({ message: 'Reserva criada com sucesso!', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro ao criar reserva' });
  }
}

// Função para listar todas as reservas
export async function listarReservas(req, res) {
  try {
    const [reservas] = await db.execute('SELECT * FROM reserva');

    res.status(200).json(reservas);
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({ message: 'Erro ao listar reservas' });
  }
}

// Função para atualizar uma reserva existente
export async function atualizarReserva(req, res) {
  const { id } = req.params;
  const { data_inicio, data_fim, valor_final, situacao } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE reserva 
       SET data_inicio = ?, data_fim = ?, valor_final = ?, situacao = ?
       WHERE id = ?`,
      [data_inicio, data_fim, valor_final, situacao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.status(200).json({ message: 'Reserva atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ message: 'Erro ao atualizar reserva' });
  }
}

// Função para deletar uma reserva
export async function deletarReserva(req, res) {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM reserva WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.status(200).json({ message: 'Reserva deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar reserva:', error);
    res.status(500).json({ message: 'Erro ao deletar reserva' });
  }
}
