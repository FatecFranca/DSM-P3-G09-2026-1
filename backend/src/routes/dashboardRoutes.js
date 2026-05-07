import { Router } from "express";
import * as dashboardControllers from "../controllers/dashboardControllers.js";

const router = Router();

router.get('/',dashboardControllers.recents);
router.get('/',dashboardControllers.estoqueCritico);
router.get('/',dashboardControllers.produtoEmEstoque);
router.get('/',dashboardControllers.clientes);
router.get('/',dashboardControllers.fornecedores);
router.get('/',dashboardControllers.pedidosMes);

export default router;  