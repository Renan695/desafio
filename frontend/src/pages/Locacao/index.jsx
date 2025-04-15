import { useEffect, useState, useRef } from 'react';
import './style.css';
import Lixeira from '../../assets/lixeira.svg';
import api from '../../services/api';

function Locacao() {
  const [locacoes, setLocacoes] = useState([]);
  const [message, setMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const inputNome = useRef();
  const inputTipo = useRef();
  const inputDescricao = useRef();
  const inputValorHora = useRef();
  const inputTempoMinimo = useRef();
  const inputTempoMaximo = useRef();

  useEffect(() => {
    getLocacoes();
  }, []);

  // Carrega as locações
  async function getLocacoes() {
    try {
      const locacoesFromApi = await api.get('/locacao');
      setLocacoes(locacoesFromApi.data);
    } catch (error) {
      setMessage('Erro ao buscar locações!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  // Cadastra uma nova locação
  async function createLocacao() {
    const nome = inputNome.current.value.trim();
    const tipo = inputTipo.current.value.trim();
    const descricao = inputDescricao.current.value.trim();
    const valorHora = parseFloat(inputValorHora.current.value);
    const tempoMinimo = parseInt(inputTempoMinimo.current.value);
    const tempoMaximo = parseInt(inputTempoMaximo.current.value);

    // Valida os campos obrigatórios
    if (!nome || !tipo || isNaN(valorHora) || isNaN(tempoMinimo) || isNaN(tempoMaximo)) {
      setMessage('Preencha todos os campos obrigatórios!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (valorHora <= 0 || tempoMinimo <= 0 || tempoMaximo <= 0 || tempoMinimo > tempoMaximo) {
      setMessage('Verifique os valores inseridos!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      await api.post('/locacao', {
        nome,
        tipo,
        descricao,
        valor_hora: valorHora,
        tempo_minimo: tempoMinimo,
        tempo_maximo: tempoMaximo
      });

      resetForm();
      setMessage('Locação cadastrada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getLocacoes();
    } catch (error) {
      setMessage('Erro ao cadastrar locação!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  // Atualiza uma locação existente
  async function updateLocacao() {
    const nome = inputNome.current.value.trim();
    const tipo = inputTipo.current.value.trim();
    const descricao = inputDescricao.current.value.trim();
    const valorHora = parseFloat(inputValorHora.current.value);
    const tempoMinimo = parseInt(inputTempoMinimo.current.value);
    const tempoMaximo = parseInt(inputTempoMaximo.current.value);

    try {
      await api.put(`/locacao/${idEditando}`, {
        nome,
        tipo,
        descricao,
        valor_hora: valorHora,
        tempo_minimo: tempoMinimo,
        tempo_maximo: tempoMaximo
      });

      resetForm();
      setMessage('Locação atualizada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getLocacoes();
    } catch (error) {
      setMessage('Erro ao atualizar locação!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  // Preenche o formulário para edição
  function preencherFormulario(locacao) {
    inputNome.current.value = locacao.nome;
    inputTipo.current.value = locacao.tipo;
    inputDescricao.current.value = locacao.descricao;
    inputValorHora.current.value = locacao.valor_hora;
    inputTempoMinimo.current.value = locacao.tempo_minimo;
    inputTempoMaximo.current.value = locacao.tempo_maximo;

    setEditando(true);
    setIdEditando(locacao.id);
  }

  // Limpa o formulário
  function resetForm() {
    inputNome.current.value = '';
    inputTipo.current.value = '';
    inputDescricao.current.value = '';
    inputValorHora.current.value = '';
    inputTempoMinimo.current.value = '';
    inputTempoMaximo.current.value = '';

    setEditando(false);
    setIdEditando(null);
  }

  // Deleta uma locação
  async function deleteLocacao(id) {
    if (!window.confirm('Tem certeza que deseja deletar esta locação?')) return;

    try {
      await api.delete(`/locacao/${id}`);
      setMessage('Locação deletada com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getLocacoes();
    } catch (error) {
      setMessage('Erro ao deletar locação!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  return (
    <section className="container locacao">
      <form>
        <h1>{editando ? 'Editar Locação' : 'Cadastro de Locações'}</h1>

        <input placeholder="Nome" type="text" ref={inputNome} />
        <input placeholder="Tipo" type="text" ref={inputTipo} />
        <input placeholder="Descrição" type="text" ref={inputDescricao} />
        <input placeholder="Valor por Hora" type="number" step="0.01" ref={inputValorHora} />
        <input placeholder="Tempo Mínimo (Horas)" type="number" ref={inputTempoMinimo} />
        <input placeholder="Tempo Máximo (Horas)" type="number" ref={inputTempoMaximo} />

        <button type="button" onClick={editando ? updateLocacao : createLocacao}>
          {editando ? 'Atualizar Locação' : 'Cadastrar Locação'}
        </button>

        {editando && (
          <button type="button" onClick={resetForm}>Cancelar Edição</button>
        )}
      </form>

      {message && <p className="message">{message}</p>}

      <section className="locacao-listagem">
        {locacoes.map((locacao) => (
          <article key={locacao.id} className="locacao-card">
            <p><strong>Nome:</strong> {locacao.nome}</p>
            <p><strong>Tipo:</strong> {locacao.tipo}</p>
            <p><strong>Descrição:</strong> {locacao.descricao}</p>
            <p><strong>Valor Hora:</strong> R$ {parseFloat(locacao.valor_hora).toFixed(2)}</p>
            <p><strong>Tempo Mínimo:</strong> {locacao.tempo_minimo}h</p>
            <p><strong>Tempo Máximo:</strong> {locacao.tempo_maximo}h</p>
            <div className="locacao-actions">
              <button onClick={() => preencherFormulario(locacao)}>Editar</button>
              <button onClick={() => deleteLocacao(locacao.id)}>
                <img src={Lixeira} alt="Ícone de lixeira" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default Locacao;
