import { useState, useRef } from 'react';
import './style.css';
import api from '../../services/api';

function Disponiveis() {
  const [locacoesDisponiveis, setLocacoesDisponiveis] = useState([]);

  const inputDataInicio = useRef();
  const inputDataFim = useRef();

  async function buscarLocacoes() {
    const dataInicio = inputDataInicio.current.value;
    const dataFim = inputDataFim.current.value;

    try {
      const response = await api.get('/locacao/disponiveis', {
        params: {
          data_inicio: dataInicio,
          data_fim: dataFim
        }
      });
      setLocacoesDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar locações disponíveis:', error);
    }
  }

  return (
    <section className="container">
      <form>
        <h1>Buscar Locações Disponíveis</h1>

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

        <button type="button" onClick={buscarLocacoes}>Buscar</button>
      </form>

      {/* Listagem de cards */}
      <section className="listagem">
        {locacoesDisponiveis.map(locacao => (
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
        ))}
      </section>
    </section>
  );
}

export default Disponiveis;
