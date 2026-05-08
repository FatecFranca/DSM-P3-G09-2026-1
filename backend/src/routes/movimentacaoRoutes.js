import { Router } from "express";
import * as movimentacaoControllers from "../controllers/movimentacaoControllers.js";

const router = Router();

router.get('/',movimentacaoControllers.retrieveAll);
router.post('/',movimentacaoControllers.create);
router.get('/:id',movimentacaoControllers.retrieveOne);

export default router;  