import { useState, useRef } from 'react';
import './style.css';
import api from '../../services/api';

function Disponiveis() {
  const [locacoesDisponiveis, setLocacoesDisponiveis] = useState([]);

  const inputDataInicio = useRef();
  const inputDataFim = useRef();

  // Função para formatar a data do input para o formato esperado pela API
  function formatarData(data) {
    if (!data) return '';
    return data.replace('T', ' ') + ':00';
  }

  // Função para buscar as locações disponíveis com base nas datas fornecidas
  async function buscarLocacoes() {
    const dataInicio = formatarData(inputDataInicio.current.value);
    const dataFim = formatarData(inputDataFim.current.value);

    if (!dataInicio || !dataFim) {
      alert("Preencha as datas corretamente.");
      return;
    }

    try {
      const response = await api.get('/locacao/disponiveis', {
        params: {
          data_inicio: dataInicio,
          data_fim: dataFim
        }
      });
      setLocacoesDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar locações disponíveis:', error.response?.data || error.message);
      alert("Erro ao buscar locações. Verifique as datas e tente novamente.");
    }
  }

  return (
    <section className="container">
      <form>
        <h1>Buscar Locações Disponíveis</h1>

        {/* Campos para o usuário selecionar as datas de início e fim */}
        <input
          type="datetime-local"
          placeholder="Data Início"
          ref={inputDataInicio}
        />
        <input
          type="datetime-local"
          placeholder="Data Fim"
          ref={inputDataFim}
        />

        {/* Botão para disparar a busca das locações */}
        <button type="button" onClick={buscarLocacoes}>Buscar</button>
      </form>

      {/* Exibição das locações disponíveis em forma de cards */}
      <section className="listagem">
        {locacoesDisponiveis.length === 0 ? (
          <p>Nenhuma locação disponível para o período informado.</p>
        ) : (
          locacoesDisponiveis.map(locacao => (
            <article key={locacao.id} className="card">
              <div>
                <p>Nome: <span>{locacao.nome}</span></p>
                <p>Tipo: <span>{locacao.tipo}</span></p>
                <p>Descrição: <span>{locacao.descricao}</span></p>
                <p>Valor Hora: <span>R$ {parseFloat(locacao.valor_hora).toFixed(2)}</span></p>
                <p>Tempo Mínimo: <span>{locacao.tempo_minimo}h</span></p>
                <p>Tempo Máximo: <span>{locacao.tempo_maximo}h</span></p>
              </div>
            </article>
          ))
        )}
      </section>
    </section>
  );
}

export default Disponiveis;
