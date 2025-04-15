import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import './style.css';
import Lixeira from '../../assets/lixeira.svg';

function Reserva() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [message, setMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const inputClienteId = useRef();
  const inputLocacaoId = useRef();
  const inputDataInicio = useRef();
  const inputDataFim = useRef();
  const inputValorFinal = useRef();
  const inputSituacao = useRef();

  useEffect(() => {
    getReservas();
    getClientes();
    getLocacoes();
  }, []);

  async function getReservas() {
    try {
      const response = await api.get('/reserva');
      setReservas(response.data);
    } catch (error) {
      setMessage('Erro ao buscar reservas!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function getClientes() {
    try {
      const response = await api.get('/cliente');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  async function getLocacoes() {
    try {
      const response = await api.get('/locacao');
      setLocacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar locações:', error);
    }
  }

  async function createReserva() {
    try {
      await api.post('/reserva', {
        cliente_id: inputClienteId.current.value,
        locacao_id: inputLocacaoId.current.value,
        data_inicio: inputDataInicio.current.value,
        data_fim: inputDataFim.current.value,
        valor_final: parseFloat(inputValorFinal.current.value),
        situacao: inputSituacao.current.value
      });

      limparFormulario();
      setMessage('Reserva cadastrada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getReservas();
    } catch (error) {
      setMessage('Erro ao cadastrar reserva!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function updateReserva() {
    try {
      await api.put(`/reserva/${idEditando}`, {
        data_inicio: inputDataInicio.current.value,
        data_fim: inputDataFim.current.value,
        valor_final: parseFloat(inputValorFinal.current.value),
        situacao: inputSituacao.current.value
      });

      limparFormulario();
      setMessage('Reserva atualizada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getReservas();
    } catch (error) {
      setMessage('Erro ao atualizar reserva!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  function preencherFormulario(reserva) {
    inputClienteId.current.value = reserva.cliente_id;
    inputLocacaoId.current.value = reserva.locacao_id;
    inputDataInicio.current.value = reserva.data_inicio.slice(0, 16);
    inputDataFim.current.value = reserva.data_fim.slice(0, 16);
    inputValorFinal.current.value = reserva.valor_final;
    inputSituacao.current.value = reserva.situacao;

    setEditando(true);
    setIdEditando(reserva.id);
  }

  function limparFormulario() {
    inputClienteId.current.value = '';
    inputLocacaoId.current.value = '';
    inputDataInicio.current.value = '';
    inputDataFim.current.value = '';
    inputValorFinal.current.value = '';
    inputSituacao.current.value = '';

    setEditando(false);
    setIdEditando(null);
  }

  async function deleteReserva(id) {
    if (!window.confirm('Tem certeza que deseja deletar esta reserva?')) return;

    try {
      await api.delete(`/reserva/${id}`);
      setMessage('Reserva deletada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getReservas();
    } catch (error) {
      setMessage('Erro ao deletar reserva!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  return (
    <section className="container reserva">
      <form>
        <h1>{editando ? 'Editar Reserva' : 'Cadastro de Reservas'}</h1>

        <select ref={inputClienteId} defaultValue="" disabled={editando}>
          <option value="" disabled>Selecione o Cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <select ref={inputLocacaoId} defaultValue="" disabled={editando}>
          <option value="" disabled>Selecione a Locação</option>
          {locacoes.map(locacao => (
            <option key={locacao.id} value={locacao.id}>
              {locacao.nome}
            </option>
          ))}
        </select>

        <input type="datetime-local" ref={inputDataInicio} />
        <input type="datetime-local" ref={inputDataFim} />
        <input type="number" step="0.01" placeholder="Valor Final" ref={inputValorFinal} />

        <select ref={inputSituacao} defaultValue="">
          <option value="" disabled>Selecione a Situação</option>
          <option value="ativa">Ativa</option>
          <option value="cancelada">Cancelada</option>
          <option value="finalizada">Finalizada</option>
        </select>

        <button type="button" onClick={editando ? updateReserva : createReserva}>
          {editando ? 'Atualizar Reserva' : 'Cadastrar Reserva'}
        </button>

        {editando && (
          <button type="button" className="cancelar" onClick={limparFormulario}>
            Cancelar Edição
          </button>
        )}
      </form>

      {message && <p className="message">{message}</p>}

      <section className="reserva-listagem">
        {reservas.map((reserva) => (
          <article key={reserva.id} className="reserva-card">
            <p><strong>ID Cliente:</strong> {reserva.cliente_id}</p>
            <p><strong>ID Locação:</strong> {reserva.locacao_id}</p>
            <p><strong>Data Início:</strong> {new Date(reserva.data_inicio).toLocaleString()}</p>
            <p><strong>Data Fim:</strong> {new Date(reserva.data_fim).toLocaleString()}</p>
            <p><strong>Valor Final:</strong> R$ {parseFloat(reserva.valor_final).toFixed(2)}</p>
            <p><strong>Situação:</strong> {reserva.situacao}</p>
            <div className="reserva-actions">
              <button onClick={() => preencherFormulario(reserva)}>Editar</button>
              <button onClick={() => deleteReserva(reserva.id)}>
                <img src={Lixeira} alt="Ícone de lixeira" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default Reserva;
