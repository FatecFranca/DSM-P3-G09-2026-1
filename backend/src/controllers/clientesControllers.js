import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const retrieveAll = async (req, res) => {
    try {
        const cliente = await prisma.cliente.findMany({
            where: {
                usuarioId: req.usuario.id
            },include:{_count:{select:{pedidos:true}}}
        });
        res.json(cliente)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
};
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { cnpj, nomeRazaoSocial, cpfCnpj, email, dataCadastro, logradouro, numImovel, complemento, bairro, municipio, uf, cep, celular1, celular2 } = req.body;

        if (!id) {
            return res.status(400).json({ erro: "O id do cliente é obrigatório!" });
        }

        const consulta = await prisma.cliente.findFirst({ where: { cpfCnpj: cpfCnpj, usuarioId: req.usuario.id, NOT: { id } } });
        if (consulta) { //Se ja tiver alguem com o mesmo cnpj ou cpf
            return res.status(400).json({ erro: "Ja existe um cliente com este cpf/cnpj" })
        }

        const clienteExiste = await prisma.cliente.findFirst({ where: { id, usuarioId: req.usuario.id } })

        if (!clienteExiste) {
            return res.status(404).json({ error: "Cliente não encontrado" })
        }

        const cliente = await prisma.cliente.update({
            where: { id },
            data: { cnpj: cnpj, nomeRazaoSocial: nomeRazaoSocial, cpfCnpj: cpfCnpj, email: email, dataCadastro: dataCadastro, logradouro: logradouro, numImovel: numImovel, complemento: complemento, bairro: bairro, municipio: municipio, uf: uf, cep: cep, celular1: celular1, celular2: celular2 }

        });
        res.json(cliente);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }

};
export const create = async (req, res) => {

    try {
        const { cnpj, nomeRazaoSocial, cpfCnpj, email, dataCadastro, logradouro, numImovel, complemento, bairro, municipio, uf, cep, celular1, celular2 } = req.body;

        const consulta = await prisma.cliente.findFirst({ where: { cpfCnpj: cpfCnpj, usuarioId: req.usuario.id } });
        if (consulta) { //Se ja tiver alguem com o mesmo cnpj ou cpf
            return res.status(400).json({ erro: "Ja existe um cliente com este cpf/cnpj" })
        }

        const cliente = await prisma.cliente.create({
            data: {
                cnpj: cnpj,
                nomeRazaoSocial: nomeRazaoSocial,
                cpfCnpj: cpfCnpj,
                email: email,
                dataCadastro: dataCadastro,
                logradouro: logradouro,
                numImovel: numImovel,
                complemento: complemento,
                bairro: bairro,
                municipio: municipio,
                uf: uf,
                cep: cep,
                celular1: celular1,
                celular2: celular2,
                usuarioId: req.usuario.id
            }
        })
        res.json(cliente)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }

}
export const retrieveOne = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ erro: "O id do cliente é obrigatório!" });
        }

        const cliente = await prisma.cliente.findFirst({ where: { id: id, usuarioId: req.usuario.id } })

        res.json(cliente)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ erro: "O id do cliente é obrigatório!" });
        }
        const clienteExiste = await prisma.cliente.findFirst({ where: { id, usuarioId: req.usuario.id } })

        if (!clienteExiste) {
            return res.status(404).json({ error: "Cliente não encontrado" })
        }

        const cliente = await prisma.cliente.delete({ where: { id: id } })

        res.json(cliente)
    } catch (error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if (error?.code === 'P2025') {
            // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
            res.status(404).end()
        }
        else {    // Outros tipos de erro
            // Deu errado: exibe o erro no terminal
            console.error(error)

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            res.status(500).send(error)
        }
    }
}

export const getDia = async (req, res) => {
    try {
        const hoje = new Date();

        // Início e fim do dia no horário local do servidor
        const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
        const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);

        const clientes = await prisma.cliente.findMany({
            where: {usuarioId: req.usuario.id,
                createAt: {
                    gte: inicio,
                    lte: fim,
                }
            },
            orderBy: { createAt: "desc" },
        });

        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: error.message });
    }
};

export const totalPedidosCliente = async (req, res) => {

    try {
        const { id } = req.params
        const total = await prisma.pedido.count({
            where: {
                clienteId: Number(id)
            }
        })
        res.status(200).json({
            totalPedidos: total
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            erro: "Erro ao buscar total de pedidos"
        })
    }
}