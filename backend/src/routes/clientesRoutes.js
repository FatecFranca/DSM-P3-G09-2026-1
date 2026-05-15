import { Router } from "express";
import * as clienteControllers from "../controllers/clientesControllers.js";
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router();

router.get('/',authMiddleware,clienteControllers.retrieveAll);
router.post('/',authMiddleware,clienteControllers.create);
router.get('/:id',authMiddleware,clienteControllers.retrieveOne);
router.put('/:id',authMiddleware,clienteControllers.update);
router.delete('/:id',authMiddleware,clienteControllers.deleteCliente);

export default router;  