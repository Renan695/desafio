# Banco de Dados - Desafio Técnico

A aplicação utiliza **MySQL** como banco de dados.

## 📄 Como Configurar o Banco de Dados

1. Crie um banco de dados vazio no MySQL:

```sql
CREATE DATABASE reservas;
```

2. Importe o arquivo `Dump20250410.sql` dentro do banco criado.

Se estiver usando linha de comando:

```bash
mysql -u seu_usuario -p nome_do_banco < Dump20250410.sql
```

Ou use ferramentas como **phpMyAdmin** ou **MySQL Workbench** para importar o arquivo `.sql`.

> **Importante:** Atualize o nome do banco e as credenciais no arquivo `.env` do backend.

## 🛠️ Conexão no Backend

As configurações de conexão MySQL são definidas no arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservas
DB_PORT=3307
PORT=3000
```

Certifique-se que o serviço MySQL esteja ativo e funcionando corretamente.