import { Router } from "express";
import * as produtoControllers from "../controllers/produtosControllers.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = Router();

router.get('/',produtoControllers.retrieveAll);
router.post('/',produtoControllers.create);
router.get('/:id',produtoControllers.retrieveOne);
router.put('/:id',produtoControllers.update);
router.delete('/:id',produtoControllers.deleteProduto);
router.put('/:id/fornecedor',produtoControllers.addFornecedor);
router.delete('/:id/fornecedor/:fornecedorId',produtoControllers.removeFornecedor);
router.post('/:id/imagem',upload.single('imagem'),produtoControllers.uploadImagem);

export default router;  