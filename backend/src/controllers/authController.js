import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()
export async function register(req, res) {

  try {

    const { nome, email, senha } = req.body

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (usuarioExiste) {
      return res.status(400).json({
        error: "E-mail já cadastrado"
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash
      }
    })

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

export async function login(req, res) {

  try {

    const { email, senha, } = req.body

    const usuario = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (!usuario) {
      return res.status(400).json({
        error: "Usuário não encontrado"
      })
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    )

    if (!senhaCorreta) {
      return res.status(400).json({
        error: "Senha inválida"
      })
    }

    const token = jwt.sign(
  {
    id: usuario.id,
    admin: usuario.admin
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
)

res.status(200).json({
  token,

  usuario: {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    admin: usuario.admin
  }
})

  } catch (error) {

    res.status(500).json({
      error: "Erro ao fazer login"
    })

  }

}

export async function getAll(req, res){
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true
      }
    })

    res.status(200).json(usuarios)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteUsuario(req, res) {
  try {
    const { id } = req.params

    await prisma.usuario.delete({
      where: { id }
    })

    res.status(204).end()

  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }
    res.status(500).json({ error: error.message })
  }
}