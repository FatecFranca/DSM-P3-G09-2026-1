import { Router } from "express";
import * as clienteControllers from "../controllers/clientesControllers.js";

const router = Router();

router.get('/',clienteControllers.retrieveAll);
router.post('/',clienteControllers.create);
router.get('/:id',clienteControllers.retrieveOne);
router.put('/:id',clienteControllers.update);
router.delete('/:id',clienteControllers.deleteCliente);

export default router;  