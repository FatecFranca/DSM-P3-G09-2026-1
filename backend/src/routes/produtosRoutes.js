import {Router} from 'express';
import * as produtoControllers from '../controllers/produtosControllers.js'
import upload from "../middlewares/uploadMiddleware.js";
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router();

router.get('/',authMiddleware,produtoControllers.retrieveAll);
router.post('/',authMiddleware,produtoControllers.create);
router.get('/:id',authMiddleware,produtoControllers.retrieveOne);
router.put('/:id',authMiddleware,produtoControllers.update);
router.delete('/:id',authMiddleware,produtoControllers.deleteProduto);
// prdutoFornecedor
router.post('/:id/fornecedor',authMiddleware,produtoControllers.addFornecedor);
router.delete('/:id/fornecedor/:fornecedorId',authMiddleware,produtoControllers.removeFornecedor);
router.post('/:id/imagem',upload.single('imagem'),authMiddleware,produtoControllers.uploadImagem);

export default router;  