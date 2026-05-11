import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientesRoutes.js';
import fornecedoresRoutes from './routes/fornecedoresRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import movimentacoesRoutes from './routes/movimentacaoRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando'
    });
});

app.use('/clientes', clientesRoutes);

app.use('/fornecedores', fornecedoresRoutes);

app.use('/produtos', produtosRoutes);

app.use('/pedidos', pedidosRoutes);

app.use('/dashboard', dashboardRoutes);

app.use('/movimentacoes', movimentacoesRoutes);

export default app;