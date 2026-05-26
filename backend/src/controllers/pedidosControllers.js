import { PrismaClient } from '@prisma/client'
import { registrarSaida, atualizarSaida, cancelarSaida } from '../services/movimentacaoService.js'

const prisma = new PrismaClient()

export const retrieveAll = async (req, res) => {
  try {

    const pedido = await prisma.pedido.findMany({
      where: {
        usuarioId: req.usuario.id
      },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.json(pedido)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error.message
    })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const {
      status,
      formaPagamento
    } = req.body
    const pedido = await prisma.pedido.findFirst({
      where: {
        id,
        usuarioId: req.usuario.id
      },
      include: {
        itens: true
      }
    })
    if (!pedido) {
      return res.status(404).json({
        error: "Pedido não encontrado"
      })
    }
    // DEVOLVER ESTOQUE AO CANCELAR
    if (
      status === "Cancelado" &&
      pedido.status !== "Cancelado"
    ) {
      for (const item of pedido.itens) {
        const produto =
          await prisma.produto.findUnique({
            where: {
              id: item.produtoId
            }
          })
        await prisma.produto.update({
          where: {
            id: item.produtoId
          },
          data: {
            qtdEstoque:
              produto.qtdEstoque + item.quantidade
          }
        })
        // REGISTRA MOVIMENTAÇÃO
        await prisma.movimentacao.create({
          data: {
            justificativa:
              "Cancelamento do pedido",

            quantidade:
              item.quantidade,

            produtoId:
              item.produtoId,

            itemPedidoId:
              item.id,

            usuarioId:
              req.usuario.id
          }
        })
      }
    }
    const pedidoAtualizado =
      await prisma.pedido.update({
        where: {
          id
        },
        data: {
          status,
          formaPagamento
        }
      })
    return res.json(pedidoAtualizado)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: "Erro ao atualizar pedido"
    })
  }
}
export const create = async (req, res) => {
  try {
    const { formaPagamento, clienteId } = req.body
    const cliente = await prisma.cliente.findFirst({
      where: {
        id: clienteId,
        usuarioId: req.usuario.id
      }
    })
    if (!cliente) {
      return res.status(404).json({
        error: "Cliente não encontrado"
      })
    }
    // busca último pedido
    const ultimoPedido = await prisma.pedido.findFirst({
      where: {
        usuarioId: req.usuario.id
      },
      orderBy: {
        numPedido: "desc"
      }
    })
    // incrementa automaticamente
    const proximoNumero = ultimoPedido
      ? ultimoPedido.numPedido + 1
      : 1
    const pedido = await prisma.pedido.create({
      data: {
        numPedido: proximoNumero,
        formaPagamento,
        clienteId,
        valorTotal: 0,
        usuarioId: req.usuario.id,
        status: "Pendente"
      }
    })
    res.json(pedido)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error.message
    })
  }
} 

export const retrieveOne = async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        erro: "O id do pedido é obrigatório!"
      })
    }
    const pedido = await prisma.pedido.findFirst({
      where: {
        id,
        usuarioId: req.usuario.id
      },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true
          }
        }
      }
    })
    res.json(pedido)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error.message
    })
  }
}
// ira ser usado caso criado algum pedido errado, nao deve-se deletar pedidos,
export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params
    const { justificativa } = req.body
    if (!id) {
      return res.status(400).json({ erro: "O id do pedido é obrigatório!" })
    }
    const pedidoExiste = await prisma.pedido.findFirst({
      where: { id, usuarioId: req.usuario.id }
    })
    if (!pedidoExiste) {
      return res.status(404).json({ error: "Pedido não encontrado" })
    }
    // transacao atomica para deletar um pedido
    await prisma.$transaction(async (tx) => {
      const itens = await tx.itemPedido.findMany({
        where: { pedidoId: id }
      })

      for (const item of itens) {
        const produto = await tx.produto.findFirst({
          where: {
            id: item.produtoId,
            usuarioId: req.usuario.id
          }
        })
        if (!produto) {
          throw new Error("Produto não encontrado")
        }
        //cancelamento das baixas no produto
        await cancelarSaida(
          tx,
          item.produtoId,
          item.quantidade,
          item.id,
          justificativa,
          req.usuario.id
        )
      }
      // deleta todos itenspedidos do pedido
      await tx.itemPedido.deleteMany({
        where: { pedidoId: id }
      })
      // deleta o pedido
      await tx.pedido.delete({
        where: { id }
      })
    })
    res.json({
      message: "Pedido removido com sucesso"
    })
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end()
    } else {
      console.error(error)
      res.status(500).send(error)
    }
  }
}

export const createItemPedido = async (req, res) => {
  try {
    const { numItem, quantidade, pedidoId, produtoId, justificativa } = req.body
    const pedido = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        usuarioId: req.usuario.id
      }
    })
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" })
    }
    const produto = await prisma.produto.findFirst({
      where: {
        id: produtoId,
        usuarioId: req.usuario.id
      }
    })
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" })
    }
    const resultado = await prisma.$transaction(async (tx) => {
      const valorUnitario = produto.precoUnitario
      const valorTotal = quantidade * valorUnitario
      const itemPedido = await tx.itemPedido.create({
        data: {
          numItem,
          quantidade,
          valorUnitario,
          valorTotal,
          pedidoId,
          produtoId,

        }
      })
      // subtrai os produtos desse pedido
      await registrarSaida(
        tx,
        produtoId,
        quantidade,
        itemPedido.id,
        justificativa,
        req.usuario.id
      )
      const soma = await tx.itemPedido.aggregate({
        where: { pedidoId },
        _sum: { valorTotal: true }
      })
      await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          valorTotal: soma._sum.valorTotal || 0
        }
      })
      return itemPedido
    })
    res.json(resultado)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error.message
    })
  }
}

export const updateItemPedido = async (req, res) => {
  try {
    const { id } = req.params
    const { numItem, quantidade, pedidoId, produtoId, justificativa } = req.body
    const pedido = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        usuarioId: req.usuario.id
      }
    })
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" })
    }
    const produto = await prisma.produto.findFirst({
      where: {
        id: produtoId,
        usuarioId: req.usuario.id
      }
    })
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" })
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
        where: { id },
        data: {
          numItem,
          quantidade,
          valorUnitario,
          valorTotal,
          pedidoId,
          produtoId
        }
      })
      const soma = await tx.itemPedido.aggregate({
        where: { pedidoId },
        _sum: { valorTotal: true }
      })
      await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          valorTotal: soma._sum.valorTotal || 0
        }
      })
      return itemPedido
    })
    res.json(resultado)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: error.message
    })
  }
}

export const getDia = async (req, res) => {
  try {
    const hoje = new Date()
    // Início e fim do dia no horário local do servidor
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0)
    const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59)
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: req.usuario.id,
        createdAt: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json(pedidos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
};
