# Backend - Desafio Técnico

Este projeto é a API desenvolvida em **Node.js** e **Express** para gerenciamento de reservas.

## 🚀 Como Rodar

```bash
cd backend
npm install
npm start
```

> O servidor estará disponível em **http://localhost:3000**.

## 📄 Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservas
DB_PORT=3307
PORT=3000
```

## 📋 Endpoints Principais

- `POST /clientes` — Criar cliente
- `GET /clientes` — Listar clientes
- `POST /locacao` — Criar tipo de locação
- `GET /locacao` — Listar tipos de locação
- `POST /reserva` — Criar reserva
- `GET /reserva` — Listar reservas
- `GET /disponiveis/:data` — Listar locações disponíveis por data