import { Router } from "express";
import * as pedidosControllers from "../controllers/pedidosControllers.js";

const router = Router();

router.get('/',pedidosControllers.retrieveAll);
router.post('/',pedidosControllers.create);
router.get('/:id',pedidosControllers.retrieveOne);
router.put('/:id',pedidosControllers.update);
router.delete('/:id',pedidosControllers.deletePedido);
router.post('/item', pedidosControllers.createItemPedido);
router.put('/item/:id', pedidosControllers.updateItemPedido);

export default router;  