import { PrismaClient } from '@prisma/client'
import { registrarEntrada } from '../services/movimentacaoService.js';
const prisma = new PrismaClient()

export const retrieveAll = async (req,res) =>{
    try{
        const movimentacao= await prisma.movimentacao.findMany({
      include:{produto:true,itemPedido:true}
    });
        res.json(movimentacao)
    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
};
 export const create = async (req,res )=>{

    try{
        const {quantidade,justificativa,produtoId}=req.body;

        await prisma.$transaction(async (tx) => {
            await registrarEntrada(
                tx,
                produtoId,
                quantidade,
                justificativa)
        }
    )
        res.json({message:"Movimentação registrada com sucesso!"})
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }

 }
 export const retrieveOne = async (req,res)=>{
    try{
       const {id}= req.params;

       if(!id){
        return res.status(400).json({ erro: "O id da movimentacao é obrigatório!" });
       }

        const movimentacao = await prisma.movimentacao.findUnique({where:{id:id},include:{produto:true,itemPedido:true}})
        res.json(movimentacao)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 }
 