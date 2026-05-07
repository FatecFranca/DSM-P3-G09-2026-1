import { Router } from "express";
import * as produtoControllers from "../controllers/produtosControllers.js";

const router = Router();

router.get('/',produtoControllers.retrieveAll);
router.post('/',produtoControllers.create);
router.get('/:id',produtoControllers.retrieveOne);
router.put('/:id',produtoControllers.update);
router.delete('/:id',produtoControllers.deleteProduto);

export default router;  