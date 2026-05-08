import { Router } from "express";
import * as pedidosControllers from "../controllers/pedidosControllers.js";

const router = Router();

router.get('/',pedidosControllers.retrieveAll);
router.post('/',pedidosControllers.create);
router.get('/:id',pedidosControllers.retrieveOne);
router.put('/:id',pedidosControllers.update);
router.delete('/:id',pedidosControllers.deletePedido);

export default router;  