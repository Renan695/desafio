import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';

// Rotas
import clienteRoutes from './routes/clienteRoutes.js';
import locacaoRoutes from './routes/locacaoRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com o banco de dados
db.getConnection()
  .then(() => console.log('Banco de dados conectado.'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Usar rotas
app.use(clienteRoutes);
app.use(locacaoRoutes);
app.use(reservaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
