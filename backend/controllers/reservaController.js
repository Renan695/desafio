import db from '../db.js';

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
