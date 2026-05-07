import { Router } from "express";
import * as fornecedoresControllers from "../controllers/fornecedoresControllers";

const router = Router();

router.get('/',fornecedoresControllers.retrieveAll);
router.post('/',fornecedoresControllers.create);
router.get('/:id',fornecedoresControllers.retrieveOne);
router.put('/:id',fornecedoresControllers.update);
router.delete('/:id',fornecedoresControllers.deleteFornecedor);

export default router;  