import { useState, useRef } from 'react';
import './style.css';
import api from '../../services/api';

function Disponiveis() {
  const [locacoesDisponiveis, setLocacoesDisponiveis] = useState([]);

  const inputDataInicio = useRef();
  const inputDataFim = useRef();

  function formatarData(data) {
    if (!data) return '';
    return data.replace('T', ' ') + ':00';
  }

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

      <section className="listagem">
        {locacoesDisponiveis.length === 0 ? (
          <p>Nenhuma locação disponível para o período informado.</p>
        ) : (
          locacoesDisponiveis.map(locacao => (
            <article key={locacao.id} className="card">
              <div>
                <p><strong>Nome:</strong> <span>{locacao.nome}</span></p>
                <p><strong>Tipo:</strong> <span>{locacao.tipo}</span></p>
                <p><strong>Descrição:</strong> <span>{locacao.descricao}</span></p>
                <p><strong>Valor Hora:</strong> <span>R$ {parseFloat(locacao.valor_hora).toFixed(2)}</span></p>
                <p><strong>Tempo Mínimo:</strong> <span>{locacao.tempo_minimo}h</span></p>
                <p><strong>Tempo Máximo:</strong> <span>{locacao.tempo_maximo}h</span></p>
              </div>

              {locacao.dias_disponiveis && locacao.dias_disponiveis.length > 0 && (
                <div className="calendario">
                  <p><strong>Dias disponíveis:</strong></p>
                  <ul className="dias-disponiveis">
                    {locacao.dias_disponiveis.map((dia, index) => (
                      <li key={index}>{dia}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </section>
  );
}

export default Disponiveis;