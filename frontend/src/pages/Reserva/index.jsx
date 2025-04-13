import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import './style.css';
import Lixeira from '../../assets/lixeira.svg'; // ícone de lixeira

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

  // Obtém as reservas, clientes e locações
  useEffect(() => {
    getReservas();
    getClientes();
    getLocacoes();
  }, []);

  // Função para buscar as reservas da API
  async function getReservas() {
    try {
      const response = await api.get('/reserva');
      setReservas(response.data);
    } catch (error) {
      setMessage('Erro ao buscar reservas!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  // Função para buscar os clientes da API
  async function getClientes() {
    try {
      const response = await api.get('/cliente');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  // Função para buscar as locações da API
  async function getLocacoes() {
    try {
      const response = await api.get('/locacao');
      setLocacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar locações:', error);
    }
  }

  // Função para criar uma nova reserva
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
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
      getReservas();
    } catch (error) {
      setMessage('Erro ao cadastrar reserva!');
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
    }
  }

  // Função para atualizar uma reserva existente
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
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
      getReservas();
    } catch (error) {
      setMessage('Erro ao atualizar reserva!');
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
    }
  }

  // Função para preencher o formulário com os dados de uma reserva
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

  // Função para limpar o formulário
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

  // Função para deletar uma reserva
  async function deleteReserva(id) {
    if (!window.confirm('Tem certeza que deseja deletar esta reserva?')) {
      return;
    }

    try {
      await api.delete(`/reserva/${id}`);
      setMessage('Reserva deletada com sucesso!');
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
      getReservas();
    } catch (error) {
      setMessage('Erro ao deletar reserva!');
      setTimeout(() => setMessage(''), 2000); // Esconde a mensagem após 2 segundos
    }
  }

  return (
    <section className="container">
      <form>
        <h1>{editando ? 'Editar Reserva' : 'Cadastro de Reservas'}</h1>

        {/* Cliente */}
        <select ref={inputClienteId} defaultValue="" className="selecao" disabled={editando}>
          <option value="" disabled>Selecione o Cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        {/* Locação */}
        <select ref={inputLocacaoId} defaultValue="" className="selecao" disabled={editando}>
          <option value="" disabled>Selecione a Locação</option>
          {locacoes.map(locacao => (
            <option key={locacao.id} value={locacao.id}>
              {locacao.nome}
            </option>
          ))}
        </select>

        <input placeholder="Data Início" type="datetime-local" ref={inputDataInicio} />
        <input placeholder="Data Fim" type="datetime-local" ref={inputDataFim} />
        <input placeholder="Valor Final" type="number" step="0.01" ref={inputValorFinal} />

        {/* Situação */}
        <select ref={inputSituacao} defaultValue="" className="selecao">
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

      {/* Lista de Reservas */}
      <section className="listagem">
        {reservas.map(reserva => (
          <article key={reserva.id} className="card">
            <div>
              <p>ID Cliente: <span>{reserva.cliente_id}</span></p>
              <p>ID Locação: <span>{reserva.locacao_id}</span></p>
              <p>Data Início: <span>{new Date(reserva.data_inicio).toLocaleString()}</span></p>
              <p>Data Fim: <span>{new Date(reserva.data_fim).toLocaleString()}</span></p>
              <p>Valor Final: <span>R$ {parseFloat(reserva.valor_final).toFixed(2)}</span></p>
              <p>Situação: <span>{reserva.situacao}</span></p>
            </div>
            <div className="botoes">
              <button onClick={() => preencherFormulario(reserva)}>
                Editar
              </button>
              <button onClick={() => deleteReserva(reserva.id)}>
                <img src={Lixeira} alt="Ícone de deletar" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default Reserva;
