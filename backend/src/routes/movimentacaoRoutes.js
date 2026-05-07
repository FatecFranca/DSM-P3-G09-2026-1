import { Router } from "express";
import * as movimentacaoControllers from "../controllers/movimentacaoControllers.js";

const router = Router();

router.get('/',movimentacaoControllers.retrieveAll);
router.post('/',movimentacaoControllers.create);
router.get('/:id',movimentacaoControllers.retrieveOne);
router.put('/:id',movimentacaoControllers.update);
router.delete('/:id',movimentacaoControllers.deleteMovimentacao);

export default router;  