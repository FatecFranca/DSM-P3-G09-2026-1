import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const retrieveAll = async (req,res) => {
  try{
    const produto = await prisma.produto.findMany({
      where:{usuarioId:req.usuario.id},
    })

    res.json(produto)

  }catch(error){ 
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const update = async (req,res) => {
  try{
    const {id} = req.params
    const {descricao,marca,detalhes} = req.body
    let imagemUrl =null

    if(!id){
      return res.status(400).json({erro:"O id do produto é obrigatório!"})
    }

    const produtoExiste = await prisma.produto.findFirst({
      where:{id,usuarioId:req.usuario.id}
    })

    if(!produtoExiste){
      return res.status(404).json({error:"Produto não encontrado"})
    }
    if (req.file) {
      imagemUrl = req.file.path
    }

    const produto = await prisma.produto.update({
      where:{id},
      data:{
        descricao,
        marca,
        imagemUrl,
        detalhes,
        precoCusto : parseFloat(req.body.precoCusto),
        precoUnitario : parseFloat(req.body.precoUnitario),
        qtdMinima : parseFloat(req.body.qtdMinima),
      }
    })

    res.json(produto)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const create = async (req,res) => {
  try{

    console.log(req.body)
    console.log(req.file)
    console.log(req.usuario)

    const {descricao,marca,detalhes} = req.body
    let imagemUrl =null

    const consulta = await prisma.produto.findFirst({
      where:{
        descricao,
        usuarioId:req.usuario.id
      }
    })
  
    if(consulta){
      return res.status(400).json({erro:"Ja existe um produto com esta descricao"})
    }
    if (req.file) {
      imagemUrl = req.file.path
    }

    const produto = await prisma.produto.create({
      data:{
        descricao,
        marca,
        imagemUrl,
        detalhes,
        precoCusto : parseFloat(req.body.precoCusto),
        precoUnitario : parseFloat(req.body.precoUnitario),
        qtdMinima : parseFloat(req.body.qtdMinima),
        usuarioId:req.usuario.id
      }
    })
    console.log("BODY:", req.body)
console.log("FILE:", req.file)
    res.json(produto)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const retrieveOne = async (req,res) => {
  try{
    const {id} = req.params

    if(!id){
      return res.status(400).json({erro:"O id do produto é obrigatório!"})
    }

    const produto = await prisma.produto.findFirst({
      where:{
        id,
        usuarioId:req.usuario.id
      }
    })

    res.json(produto)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const deleteProduto = async (req,res) => {
  try{
    const {id} = req.params

    if(!id){
      return res.status(400).json({erro:"O id do produto é obrigatório!"})
    }

    const produtoExiste = await prisma.produto.findFirst({
      where:{id,usuarioId:req.usuario.id}
    })

    if(!produtoExiste){
      return res.status(404).json({error:"Produto não encontrado"})
    }

    const produto = await prisma.produto.delete({
      where:{id}
    })

    res.json(produto)

  }catch(error){
    if(error?.code === 'P2025'){
      res.status(404).end()
    }else{
      console.error(error)
      res.status(500).send(error)
    }
  }
}

export const addFornecedor = async (req,res) => {
  try{
    const {id} = req.params
    const {fornecedorId,precoUltimaCompra} = req.body

    const produto = await prisma.produto.findFirst({
      where:{id,usuarioId:req.usuario.id}
    })

    if(!produto){
      return res.status(404).json({error:"Produto não encontrado"})
    }

    const fornecedor = await prisma.fornecedor.findFirst({
      where:{id:fornecedorId,usuarioId:req.usuario.id}
    })

    if(!fornecedor){
      return res.status(404).json({error:"Fornecedor não encontrado"})
    }

    const vinculo = await prisma.produtoFornecedor.upsert({
      where:{
        produtoId_fornecedorId:{
          produtoId:id,
          fornecedorId
        }
      },
      update:{precoUltimaCompra},
      create:{
        produtoId:id,
        fornecedorId,
        precoUltimaCompra
      }
    })

    res.json(vinculo)

  }catch(error){
    console.error(error)
    res.status(500).json({error:error.message})
  }
}

export const removeFornecedor = async (req,res) => {
  try{
    const {id,fornecedorId} = req.params

    await prisma.produtoFornecedor.delete({
      where:{
        produtoId_fornecedorId:{
          produtoId:id,
          fornecedorId
        }
      }
    })

    res.status(204).end()

  }catch(error){
    if(error?.code === 'P2025'){
      return res.status(404).end()
    }

    res.status(500).json({error:error.message})
  }
}