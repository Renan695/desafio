import { useEffect, useState, useRef } from 'react';
import './style.css';
import Lixeira from '../../assets/lixeira.svg';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const inputNome = useRef();
  const inputEmail = useRef();
  const inputTelefone = useRef();
  const inputCPF = useRef();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const response = await api.get('/cliente');
      setUsers(response.data);
    } catch (error) {
      setMessage('Erro ao buscar usuários!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function createUsers() {
    const nome = inputNome.current.value.trim();
    const email = inputEmail.current.value.trim();
    const telefone = limparMascara(inputTelefone.current.value);
    const cpf = limparMascara(inputCPF.current.value);

    if (!nome || !email || !telefone || !cpf) {
      setMessage('Preencha todos os campos!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (!isEmailValido(email)) {
      setMessage('E-mail inválido!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    if (telefone.length !== 11 || cpf.length !== 11) {
      setMessage('Telefone ou CPF inválidos!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      await api.post('/cliente', { nome, email, telefone, cpf });
      limparCampos();
      setMessage('Usuário cadastrado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers();
    } catch (error) {
      setMessage('Erro ao cadastrar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function updateUsers() {
    const nome = inputNome.current.value.trim();
    const email = inputEmail.current.value.trim();
    const telefone = limparMascara(inputTelefone.current.value);
    const cpf = limparMascara(inputCPF.current.value);

    try {
      await api.put(`/cliente/${idEditando}`, { nome, email, telefone, cpf });
      limparCampos();
      setMessage('Usuário atualizado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers();
      setEditando(false);
    } catch (error) {
      setMessage('Erro ao atualizar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  function preencherFormulario(user) {
    inputNome.current.value = user.nome;
    inputEmail.current.value = user.email;
    inputTelefone.current.value = user.telefone;
    inputCPF.current.value = user.cpf;

    setEditando(true);
    setIdEditando(user.id);
  }

  function resetForm() {
    limparCampos();
    setEditando(false);
    setIdEditando(null);
  }

  async function deleteUsers(id) {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      await api.delete(`/cliente/${id}`);
      setMessage('Usuário deletado com sucesso!');
      setTimeout(() => setMessage(''), 2000);
      getUsers();
    } catch (error) {
      setMessage('Erro ao deletar usuário!');
      setTimeout(() => setMessage(''), 2000);
    }
  }

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

  function limparMascara(valor) {
    return valor.replace(/\D/g, '');
  }

  function limparCampos() {
    inputNome.current.value = '';
    inputEmail.current.value = '';
    inputTelefone.current.value = '';
    inputCPF.current.value = '';
  }

  function isEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <section className="container home">
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

      <section className="home-listagem">
        {users.map((user) => (
          <article key={user.id} className="home-card">
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.telefone}</p>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <div className="home-actions">
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
