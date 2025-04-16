# Backend - Desafio Técnico

Este projeto é a API desenvolvida em **Node.js** e **Express** para gerenciamento de reservas.

## Como Rodar

```bash
cd backend
npm install
npm start
```

> O servidor estará disponível em **http://localhost:3000**.

## Variáveis de Ambiente

O projeto já inclui um arquivo `.env` com as seguintes configurações:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservas
DB_PORT=3307
PORT=3000
```

> Caso seu MySQL esteja rodando na porta padrão (`3306`), você pode alterar o valor de `DB_PORT` conforme necessário.

## Endpoints Principais

- `POST /clientes` — Criar cliente  
- `GET /clientes` — Listar clientes  
- `POST /locacoes` — Criar tipo de locação  
- `GET /locacoes` — Listar tipos de locação  
- `POST /reservas` — Criar reserva  
- `GET /reservas` — Listar reservas  
- `GET /disponiveis/:data` — Listar locações disponíveis por data
