import { useState, useRef } from 'react';
import './style.css';
import api from '../../services/api';

function Disponiveis() {
  const [locacoesDisponiveis, setLocacoesDisponiveis] = useState([]);

  const inputDataInicio = useRef();
  const inputDataFim = useRef();

  /* Função para buscar locações disponíveis com base nas datas */
  async function buscarLocacoes() {
    const dataInicio = inputDataInicio.current.value;
    const dataFim = inputDataFim.current.value;

    try {
      /* Requisição à API para buscar as locações disponíveis */
      const response = await api.get('/locacao/disponiveis', {
        params: {
          data_inicio: dataInicio,
          data_fim: dataFim
        }
      });
      /* Atualiza o estado com as locações recebidas da API */
      setLocacoesDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar locações disponíveis:', error);
    }
  }

  return (
    <section className="container">
      <form>
        <h1>Buscar Locações Disponíveis</h1>

        {/* Campo para input de data de início */}
        <input
          type="datetime-local"
          placeholder="Data Início"
          ref={inputDataInicio}
        />
        
        {/* Campo para input de data de fim */}
        <input
          type="datetime-local"
          placeholder="Data Fim"
          ref={inputDataFim}
        />

        {/* Botão para disparar a função de buscar locações */}
        <button type="button" onClick={buscarLocacoes}>Buscar</button>
      </form>

      {/* Exibe a lista de locações disponíveis */}
      <section className="listagem">
        {locacoesDisponiveis.map(locacao => (
          <article key={locacao.id} className="card">
            <div>
              {/* Exibição das informações de cada locação */}
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
