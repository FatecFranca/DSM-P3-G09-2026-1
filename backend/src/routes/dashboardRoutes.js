import { Router } from "express";
import * as dashboardControllers from "../controllers/dashboardControllers.js";

const router = Router();

router.get('/recents',dashboardControllers.recents);
router.get('/estoque-critico',dashboardControllers.estoqueCritico);
router.get('/produto-em-estoque',dashboardControllers.produtoEmEstoque);
router.get('/clientes',dashboardControllers.clientes);
router.get('/fornecedores',dashboardControllers.fornecedores);
router.get('/pedidos-mes',dashboardControllers.pedidosMes);

export default router;  