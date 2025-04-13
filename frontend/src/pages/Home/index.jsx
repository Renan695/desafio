import { useEffect, useState, useRef } from 'react';
import './style.css';
import Lixeira from '../../assets/lixeira.svg';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]); // Estado para armazenar os usuários
  const [message, setMessage] = useState(''); // Estado para mensagens de feedback
  const [editando, setEditando] = useState(false); // Estado para controlar se está editando
  const [idEditando, setIdEditando] = useState(null); // Estado para armazenar o id do usuário que está sendo editado

  // Referências para os inputs
  const inputNome = useRef();
  const inputEmail = useRef();
  const inputTelefone = useRef();
  const inputCPF = useRef();

  // Chama a função de buscar os usuários ao carregar o componente
  useEffect(() => {
    getUsers();
  }, []);

  /* Função para buscar os usuários da API */
  async function getUsers() {
    try {
      const response = await api.get('/cliente');
      setUsers(response.data); // Atualiza a lista de usuários
    } catch (error) {
      setMessage('Erro ao buscar usuários!');
      setTimeout(() => setMessage(''), 2000); // Limpa a mensagem após 2 segundos
    }
  }

  /* Função para criar um novo usuário */
  async function createUsers() {
    const nome = inputNome.current.value.trim();
    const email = inputEmail.current.value.trim();
    const telefone = limparMascara(inputTelefone.current.value);
    const cpf = limparMascara(inputCPF.current.value);

    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !telefone || !cpf) {
      setMessage('Preencha todos os campos!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Valida o formato do e-mail
    if (!isEmailValido(email)) {
      setMessage('E-mail inválido!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Valida o formato do telefone e CPF
    if (telefone.length !== 11 || cpf.length !== 11) {
      setMessage('Telefone ou CPF inválidos!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      await api.post('/cliente', { nome, email, telefone, cpf });
      limparCampos(); // Limpa os campos após o cadastro
      setMessage('Usuário cadastrado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers(); // Atualiza a lista de usuários
    } catch (error) {
      setMessage('Erro ao cadastrar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  /* Função para atualizar um usuário existente */
  async function updateUsers() {
    const nome = inputNome.current.value.trim();
    const email = inputEmail.current.value.trim();
    const telefone = limparMascara(inputTelefone.current.value);
    const cpf = limparMascara(inputCPF.current.value);

    try {
      await api.put(`/cliente/${idEditando}`, { nome, email, telefone, cpf });
      limparCampos(); // Limpa os campos após a atualização
      setMessage('Usuário atualizado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers(); // Atualiza a lista de usuários
      setEditando(false); // Desativa o modo de edição
    } catch (error) {
      setMessage('Erro ao atualizar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  /* Função para preencher o formulário com os dados do usuário que será editado */
  function preencherFormulario(user) {
    inputNome.current.value = user.nome;
    inputEmail.current.value = user.email;
    inputTelefone.current.value = user.telefone;
    inputCPF.current.value = user.cpf;

    setEditando(true);
    setIdEditando(user.id);
  }

  /* Função para resetar o formulário e desmarcar o modo de edição */
  function resetForm() {
    inputNome.current.value = '';
    inputEmail.current.value = '';
    inputTelefone.current.value = '';
    inputCPF.current.value = '';

    setEditando(false);
    setIdEditando(null);
  }

  /* Função para deletar um usuário */
  async function deleteUsers(id) {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await api.delete(`/cliente/${id}`);
      setMessage('Usuário deletado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers(); // Atualiza a lista de usuários
    } catch (error) {
      setMessage('Erro ao deletar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  /* Função para formatar o telefone enquanto o usuário digita */
  function handleTelefoneChange(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      e.target.value = value;
      return;
    }
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1');
    }
    e.target.value = value;
  }

  /* Função para formatar o CPF enquanto o usuário digita */
  function handleCPFChange(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    }
    e.target.value = value;
  }

  /* Função para remover as máscaras de CPF e telefone */
  function limparMascara(valor) {
    return valor.replace(/\D/g, '');
  }

  /* Função para limpar os campos de input */
  function limparCampos() {
    inputNome.current.value = '';
    inputEmail.current.value = '';
    inputTelefone.current.value = '';
    inputCPF.current.value = '';
  }

  /* Função para validar o formato de e-mail */
  function isEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <section className="container">
      <form>
        <h1>{editando ? 'Editar Usuário' : 'Cadastro de Usuários'}</h1>

        <input placeholder="Nome" type="text" ref={inputNome} />
        <input placeholder="E-mail" type="email" ref={inputEmail} />
        <input
          placeholder="Telefone"
          type="text"
          ref={inputTelefone}
          onChange={handleTelefoneChange}
        />
        <input
          placeholder="CPF"
          type="text"
          ref={inputCPF}
          onChange={handleCPFChange}
        />
        <button type="button" onClick={editando ? updateUsers : createUsers}>
          {editando ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
        </button>

        {editando && (
          <button type="button" onClick={resetForm}>
            Cancelar Edição
          </button>
        )}
      </form>

      {message && <p className="message">{message}</p>}

      {/* Exibe a lista de usuários cadastrados */}
      <section className="listagem">
        {users.map((user) => (
          <article key={user.id} className="card">
            <div>
              <p>Nome: <span>{user.nome}</span></p>
              <p>Email: <span>{user.email}</span></p>
              <p>Telefone: <span>{user.telefone}</span></p>
              <p>CPF: <span>{user.cpf}</span></p>
            </div>
            <div className="botoes">
              <button onClick={() => preencherFormulario(user)}>Editar</button>
              <button onClick={() => deleteUsers(user.id)}>
                <img src={Lixeira} alt="Ícone de lixeira" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

export default Home;
