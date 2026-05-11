import { PrismaClient } from '@prisma/client'
import {registrarSaida,atualizarSaida,cancelarSaida} from '../services/movimentacaoService.js';

const prisma = new PrismaClient()

export const retrieveAll = async (req,res) =>{
    try{
        const pedido= await prisma.pedido.findMany({
      include:{itens:true,cliente:true}
    });
        res.json(pedido)
    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
};
export const update = async (req,res) =>{
    try{
        const {id}= req.params;
        const {formaPagamento,clienteId}=req.body;

        if(!id){
        return res.status(400).json({ erro: "O id do pedido é obrigatório!" });
    }
        
        const pedido = await prisma.pedido.update({
            where: {id},
            data: {formaPagamento:formaPagamento,clienteId:clienteId}
        });
        res.json(pedido);
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 
};
 export const create = async (req,res )=>{

    try{
        const {numPedido,formaPagamento,clienteId}=req.body;

        const consulta= await prisma.pedido.findUnique({where:{numPedido:numPedido}});
        if (consulta){ //Se ja tiver alguem com o mesmo numPedido
            return res.status(400).json({ erro: "Ja existe um pedido com este número" })
        }


        const pedido = await prisma.pedido.create({
            data: {
                numPedido:numPedido,
                formaPagamento:formaPagamento,
                clienteId:clienteId,
                valorTotal:0
            }
        })
        res.json(pedido)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }

 }
 export const retrieveOne = async (req,res)=>{
    try{
        const {id}=req.params

        if(!id){
        return res.status(400).json({ erro: "O id do pedido é obrigatório!" });
    }
        
        const pedido = await prisma.pedido.findUnique({where:{id:id},include:{itens:true,cliente:true}})

        res.json(pedido)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 }
 export const deletePedido = async (req,res)=>{
    try{
        const {id}=req.params
        const {justificativa}=req.body

        if(!id){
        return res.status(400).json({ erro: "O id do pedido é obrigatório!" });
    }

        await prisma.$transaction(async (tx) => {

            const itens = await tx.itemPedido.findMany({
                where: {
                    pedidoId: id
                }
            });

            for (const item of itens) {

                const produto = await tx.produto.findUnique({
                    where: {
                        id: item.produtoId
                    }
                });

                if (!produto) {
                    throw new Error("Produto não encontrado");
                }

                await cancelarSaida(
                    tx,
                    item.produtoId,
                    item.quantidade,
                    item.id,
                    justificativa
                );
            }
            await tx.itemPedido.deleteMany({
                where: {
                    pedidoId: id
                }
            });
            await tx.pedido.delete({
                where: {
                    id
                }
            });

        });

        res.json({
            message: "Pedido removido com sucesso"
        });

    } catch(error) {

        if(error?.code === 'P2025') {

            res.status(404).end();

        } else {

            console.error(error);

            res.status(500).send(error);
        }
    }
}

export const createItemPedido = async (req,res) => {
    try{
        const {numItem,quantidade,pedidoId,produtoId,justificativa}=req.body;
        const resultado = await prisma.$transaction(async (tx) => {
            const produto = await tx.produto.findUnique({
                where: {
                    id: produtoId
                }
            });
            const valorUnitario = produto.precoUnitario;
            const valorTotal =quantidade * valorUnitario;
            const itemPedido =
                await tx.itemPedido.create({
                data: {
                    numItem,
                    quantidade,
                    valorUnitario,
                    valorTotal,
                    pedidoId,
                    produtoId
                }
            });
            await registrarSaida(
                tx,
                produtoId,
                quantidade,
                itemPedido.id,
                justificativa
            );
            const soma =
                await tx.itemPedido.aggregate({
                where: {
                    pedidoId
                },
                _sum: {
                    valorTotal: true
                }
            });
            await tx.pedido.update({
                where: {
                    id: pedidoId
                },
                data: {
                    valorTotal:
                        soma._sum.valorTotal || 0
                }
            });
            return itemPedido;
        });

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        }); 
    }
}

export const updateItemPedido = async (req,res) => {
    try{
        const {id} = req.params;
        const {numItem,quantidade,pedidoId,produtoId,justificativa}=req.body;
        
        const resultado = await prisma.$transaction(async (tx) => {

            const produto = await tx.produto.findUnique({
                where: {
                    id: produtoId
                }
            });
            const valorUnitario = produto.precoUnitario;
            await atualizarSaida(
                tx,
                produtoId,
                quantidade,
                id,
                justificativa
            );

            const valorTotal =quantidade * valorUnitario;

            const itemPedido =await tx.itemPedido.update({
                where: {
                    id
                },
                data: {
                    numItem,
                    quantidade,
                    valorUnitario,
                    valorTotal,
                    pedidoId,
                    produtoId
                }
            });
            const soma =
                await tx.itemPedido.aggregate({
                where: {
                    pedidoId
                },
                _sum: {
                    valorTotal: true
                }
            })
            await tx.pedido.update({
                where: {
                    id: pedidoId
                },
                data: {
                    valorTotal:
                        soma._sum.valorTotal || 0
                }
            });

            return itemPedido;
        });

        res.json(resultado);

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
}