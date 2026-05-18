import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const recents = async (req, res) => {
  try {

    const dashboard = await prisma.pedido.findMany({
      where: {
        usuarioId: req.usuario.id,
        createdAt: {
          gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        createdAt: "desc"
      },include:{
        cliente:true
      }
    })

    res.json(dashboard)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const estoqueCritico = async (req, res) => {
  try {

    const produtos = await prisma.produto.findMany({
      where: {
        usuarioId: req.usuario.id
      }
    })

    const dashboard = produtos.filter(
      produto => produto.qtdEstoque < produto.qtdMinima
    )

    res.json(dashboard)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const produtoEmEstoque = async (req, res) => {
  try {

    const produtos = await prisma.produto.count({
      where: {
        usuarioId: req.usuario.id
      }
    })

    res.json(produtos)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const clientes = async (req, res) => {
  try {

    const clientes = await prisma.cliente.count({
      where: {
        usuarioId: req.usuario.id
      }
    })

    res.json(clientes)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const fornecedores = async (req, res) => {
  try {

    const fornecedores = await prisma.fornecedor.count({
      where: {
        usuarioId: req.usuario.id
      }
    })

    res.json(fornecedores)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const pedidosMes = async (req, res) => {
  try {

    const inicioMes = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )

    const fimMes = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    )

    const pedidosDoMes = await prisma.pedido.findMany({
      where: {
        usuarioId: req.usuario.id,
        createdAt: {
          gte: inicioMes,
          lt: fimMes
        }
      }
    })

    res.json(pedidosDoMes)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const getPedidosDia = async (req, res) => {
  try {
    const { date } = req.query;

    const baseDate = date ? new Date(date) : new Date();

    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(baseDate);
    end.setHours(23, 59, 59, 999);

    const pedidos = await prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        cliente: true,
      },
    });

    return res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

export const getFornecedoresDia = async (req, res) => {
  try {
    const { date } = req.query;

    const baseDate = date ? new Date(date) : new Date();

    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(baseDate);
    end.setHours(23, 59, 59, 999);

    const fornecedores = await prisma.fornecedor.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return res.json(fornecedores);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
};
export const getClienteDia = async (req, res) => {
  try {
    const { date } = req.query;

    const baseDate = date ? new Date(date) : new Date();

    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(baseDate);
    end.setHours(23, 59, 59, 999);

    const clientes = await prisma.cliente.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return res.json(clientes);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};
export const getProdutoDia = async (req, res) => {
  try {
    const { date } = req.query;

    const baseDate = date ? new Date(date) : new Date();

    const start = new Date(baseDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(baseDate);
    end.setHours(23, 59, 59, 999);

    const produtos = await prisma.produto.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};