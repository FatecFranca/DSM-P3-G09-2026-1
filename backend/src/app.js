import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientesRoutes.js';
import fornecedoresRoutes from './routes/fornecedoresRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import movimentacoesRoutes from './routes/movimentacaoRoutes.js';
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

const app = express();

app.use(cors({
    origin: ['http://localhost:3000']
}));

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

app.use("/auth", authRoutes)

app.use("/admin", adminRoutes)

export default app;