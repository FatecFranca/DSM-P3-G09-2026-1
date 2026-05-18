import { Router } from "express";
import * as dashboardControllers from "../controllers/dashboardControllers.js";
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router();

router.get('/recents',authMiddleware,dashboardControllers.recents);
router.get('/estoque-critico',authMiddleware,dashboardControllers.estoqueCritico);
router.get('/produto-em-estoque',authMiddleware,dashboardControllers.produtoEmEstoque);
router.get('/clientes',authMiddleware,dashboardControllers.clientes);
router.get('/fornecedores',authMiddleware,dashboardControllers.fornecedores);
router.get('/pedidos-mes',authMiddleware,dashboardControllers.pedidosMes);

router.get("/dashboard/pedidos-dia",authMiddleware, dashboardControllers.getPedidosDia);
router.get("/dashboard/clientes-dia", authMiddleware,dashboardControllers.getClienteDia);
router.get("/dashboard/fornecedores-dia",authMiddleware, dashboardControllers.getFornecedoresDia);
router.get("/dashboard/produtos-dia",authMiddleware, dashboardControllers.getProdutoDia);

export default router;  