import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const retrieveAll = async (req, res) => {
  try {
    const fornecedor = await prisma.fornecedor.findMany({
      where: { usuarioId: req.usuario.id },
      include: { _count: { select: { produtos: true } } }
    })
    res.json(fornecedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { razaoSocial, nomeFantasia, cnpj, email, logradouro, numImovel, complemento, bairro, municipio, uf, cep, telefone1, telefone2, categoria } = req.body
    if (!id) {
      return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" })
    }
    const consulta = await prisma.fornecedor.findFirst({
      where: {
        cnpj,
        usuarioId: req.usuario.id,
        NOT: { id }
      }
    })
    if (consulta) {
      return res.status(400).json({ erro: "Ja existe um fornecedor com este cnpj" })
    }
    const fornecedorExiste = await prisma.fornecedor.findFirst({
      where: { id, usuarioId: req.usuario.id }
    })
    if (!fornecedorExiste) {
      return res.status(404).json({ error: "Fornecedor não encontrado" })
    }
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: {
        razaoSocial,
        nomeFantasia,
        cnpj,
        email,
        logradouro,
        numImovel,
        complemento,
        bairro,
        municipio,
        uf,
        cep,
        telefone1,
        telefone2,
        categoria
      }
    })
    res.json(fornecedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  try {
    const { razaoSocial, nomeFantasia, cnpj, email, logradouro, numImovel, complemento, bairro, municipio, uf, cep, telefone1, telefone2, categoria } = req.body

    const consulta = await prisma.fornecedor.findFirst({
      where: {
        cnpj,
        usuarioId: req.usuario.id
      }
    })
    if (consulta) {
      return res.status(400).json({ erro: "Ja existe um fornecedor com este cnpj" })
    }
    const fornecedor = await prisma.fornecedor.create({
      data: {
        razaoSocial,
        nomeFantasia,
        cnpj,
        email,
        logradouro,
        numImovel,
        complemento,
        bairro,
        municipio,
        uf,
        cep,
        telefone1,
        telefone2,
        categoria,
        usuarioId: req.usuario.id
      }
    })
    res.json(fornecedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const retrieveOne = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" })
    }
    const fornecedor = await prisma.fornecedor.findFirst({
      where: {
        id,
        usuarioId: req.usuario.id
      },
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      }
    })
    res.json(fornecedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteFornecedor = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" })
    }
    const fornecedorExiste = await prisma.fornecedor.findFirst({
      where: { id, usuarioId: req.usuario.id }
    })
    if (!fornecedorExiste) {
      return res.status(404).json({ error: "Fornecedor não encontrado" })
    }
    const fornecedor = await prisma.fornecedor.delete({
      where: { id }
    })
    res.json(fornecedor)
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end()
    } else {
      console.error(error)
      res.status(500).send(error)
    }
  }
}

export const getDia = async (req, res) => {
  try {
    const hoje = new Date()
    // Início e fim do dia no horário local do servidor
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0)
    const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59)
    const fornecedores = await prisma.fornecedor.findMany({
      where: {
        usuarioId: req.usuario.id,
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(fornecedores)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
};