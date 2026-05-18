import { PrismaClient } from '@prisma/client'
import { registrarSaida, atualizarSaida, cancelarSaida } from '../services/movimentacaoService.js'

const prisma = new PrismaClient()

export const retrieveAll = async (req,res) => {
  try{
    const pedido = await prisma.pedido.findMany({
      where:{usuarioId:req.usuario.id},
      include:{itens:true,cliente:true}
    })

    res.json(pedido)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const update = async (req,res) => {
  try{
    const {id} = req.params
    const {formaPagamento,clienteId} = req.body

    if(!id){
      return res.status(400).json({erro:"O id do pedido é obrigatório!"})
    }

    const pedidoExiste = await prisma.pedido.findFirst({
      where:{id,usuarioId:req.usuario.id}
    })

    if(!pedidoExiste){
      return res.status(404).json({error:"Pedido não encontrado"})
    }

    const cliente = await prisma.cliente.findFirst({
      where:{id:clienteId,usuarioId:req.usuario.id}
    })

    if(!cliente){
      return res.status(404).json({error:"Cliente não encontrado"})
    }

    const pedido = await prisma.pedido.update({
      where:{id},
      data:{
        formaPagamento,
        clienteId
      }
    })

    res.json(pedido)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const create = async (req,res) => {
  try{
    const {numPedido,formaPagamento,clienteId} = req.body

    const consulta = await prisma.pedido.findFirst({
      where:{
        numPedido,
        usuarioId:req.usuario.id
      }
    })

    if(consulta){
      return res.status(400).json({erro:"Ja existe um pedido com este número"})
    }

    const cliente = await prisma.cliente.findFirst({
      where:{
        id:clienteId,
        usuarioId:req.usuario.id
      }
    })

    if(!cliente){
      return res.status(404).json({error:"Cliente não encontrado"})
    }

    const pedido = await prisma.pedido.create({
      data:{
        numPedido,
        formaPagamento,
        clienteId,
        valorTotal:0,
        usuarioId:req.usuario.id
      }
    })

    res.json(pedido)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const retrieveOne = async (req,res) => {
  try{
    const {id} = req.params

    if(!id){
      return res.status(400).json({erro:"O id do pedido é obrigatório!"})
    }

    const pedido = await prisma.pedido.findFirst({
      where:{
        id,
        usuarioId:req.usuario.id
      },
      include:{itens:true,cliente:true}
    })

    res.json(pedido)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const deletePedido = async (req,res) => {
  try{
    const {id} = req.params
    const {justificativa} = req.body

    if(!id){
      return res.status(400).json({erro:"O id do pedido é obrigatório!"})
    }

    const pedidoExiste = await prisma.pedido.findFirst({
      where:{id,usuarioId:req.usuario.id}
    })

    if(!pedidoExiste){
      return res.status(404).json({error:"Pedido não encontrado"})
    }

    await prisma.$transaction(async (tx) => {

      const itens = await tx.itemPedido.findMany({
        where:{pedidoId:id}
      })

      for(const item of itens){

        const produto = await tx.produto.findFirst({
          where:{
            id:item.produtoId,
            usuarioId:req.usuario.id
          }
        })

        if(!produto){
          throw new Error("Produto não encontrado")
        }

        await cancelarSaida(
          tx,
          item.produtoId,
          item.quantidade,
          item.id,
          justificativa,
          req.usuario.id
        )
      }

      await tx.itemPedido.deleteMany({
        where:{pedidoId:id}
      })

      await tx.pedido.delete({
        where:{id}
      })

    })

    res.json({
      message:"Pedido removido com sucesso"
    })

  }catch(error){

    if(error?.code === 'P2025'){
      res.status(404).end()
    }else{
      console.error(error)
      res.status(500).send(error)
    }
  }
}

export const createItemPedido = async (req,res) => {
  try{
    const {numItem,quantidade,pedidoId,produtoId,justificativa} = req.body

    const pedido = await prisma.pedido.findFirst({
      where:{
        id:pedidoId,
        usuarioId:req.usuario.id
      }
    })

    if(!pedido){
      return res.status(404).json({error:"Pedido não encontrado"})
    }

    const produto = await prisma.produto.findFirst({
      where:{
        id:produtoId,
        usuarioId:req.usuario.id
      }
    })

    if(!produto){
      return res.status(404).json({error:"Produto não encontrado"})
    }

    const resultado = await prisma.$transaction(async (tx) => {

      const valorUnitario = produto.precoUnitario
      const valorTotal = quantidade * valorUnitario

      const itemPedido = await tx.itemPedido.create({
        data:{
          numItem,
          quantidade,
          valorUnitario,
          valorTotal,
          pedidoId,
          produtoId,
          
        }
      })

      await registrarSaida(
        tx,
        produtoId,
        quantidade,
        itemPedido.id,
        justificativa,
        req.usuario.id
      )

      const soma = await tx.itemPedido.aggregate({
        where:{pedidoId},
        _sum:{valorTotal:true}
      })

      await tx.pedido.update({
        where:{id:pedidoId},
        data:{
          valorTotal:soma._sum.valorTotal || 0
        }
      })

      return itemPedido
    })

    res.json(resultado)

  }catch(error){
    console.error(error)

    res.status(500).json({
      error:error.message
    })
  }
}

export const updateItemPedido = async (req,res) => {
  try{
    const {id} = req.params
    const {numItem,quantidade,pedidoId,produtoId,justificativa} = req.body

    const pedido = await prisma.pedido.findFirst({
      where:{
        id:pedidoId,
        usuarioId:req.usuario.id
      }
    })

    if(!pedido){
      return res.status(404).json({error:"Pedido não encontrado"})
    }

    const produto = await prisma.produto.findFirst({
      where:{
        id:produtoId,
        usuarioId:req.usuario.id
      }
    })

    if(!produto){
      return res.status(404).json({error:"Produto não encontrado"})
    }

    const resultado = await prisma.$transaction(async (tx) => {

      const valorUnitario = produto.precoUnitario

      await atualizarSaida(
        tx,
        produtoId,
        quantidade,
        id,
        justificativa,
        req.usuario.id
      )

      const valorTotal = quantidade * valorUnitario

      const itemPedido = await tx.itemPedido.update({
        where:{id},
        data:{
          numItem,
          quantidade,
          valorUnitario,
          valorTotal,
          pedidoId,
          produtoId
        }
      })

      const soma = await tx.itemPedido.aggregate({
        where:{pedidoId},
        _sum:{valorTotal:true}
      })

      await tx.pedido.update({
        where:{id:pedidoId},
        data:{
          valorTotal:soma._sum.valorTotal || 0
        }
      })

      return itemPedido
    })

    res.json(resultado)

  }catch(error){
    console.error(error)

    res.status(500).json({
      error:error.message
    })
  }
}