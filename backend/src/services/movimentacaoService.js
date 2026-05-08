// services/movimentacaoService.js

export async function registrarEntrada(
    tx,
    produtoId,
    quantidade,
    codProduto,
    justificativa
) {
    const produto = await tx.produto.findUnique({
        where: {
            id: produtoId   
        }
    });

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    await tx.movimentacao.create({
        data: {
            justificativa,
            quantidade,
            produtoId,
            codProduto
        }
    });

    await tx.produto.update({
        where: {
            id: produtoId
        },

        data: {
            qtdEstoque: produto.qtdEstoque + quantidade
        }
    });
}

export async function registrarSaida(
    tx,
    produtoId,
    quantidade,
    itemPedidoId,
    codProduto,
    justificativa
) {

    const produto = await tx.produto.findUnique({
        where: {
            id: produtoId
        }
    });

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    if (produto.qtdEstoque < quantidade ) {
        throw new Error("Quantidade insuficiente em estoque");
    }

    await tx.movimentacao.create({
        data: {
            justificativa,
            quantidade,
            produtoId,
            codProduto,
            itemPedidoId
        }
        }
    );

    await tx.produto.update({
        where: {
            id: produtoId
        },

        data: {
            qtdEstoque: produto.qtdEstoque - quantidade
        }
    });
}
export async function atualizarSaida(
    tx,
    produtoId,
    novaQuantidade,
    itemPedidoId,
    codProduto,
    justificativa
) {

    const itemAntigo = await tx.itemPedido.findUnique({
        where: {
            id: itemPedidoId
        }
    });

    if (!itemAntigo) {
        throw new Error("Item do pedido não encontrado");
    }

    const produto = await tx.produto.findUnique({
        where: {
            id: produtoId
        }
    });

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    const diferenca =
        novaQuantidade - itemAntigo.quantidade;

    if (diferenca === 0) {
        return;
    }
    if (
        diferenca > 0 &&
        produto.qtdEstoque < diferenca
    ) {
        throw new Error("Quantidade insuficiente em estoque");
    }

    await tx.produto.update({
        where: {
            id: produtoId
        },

        data: {
            qtdEstoque:diferenca > 0 ? produto.qtdEstoque - diferenca : produto.qtdEstoque + Math.abs(diferenca)
        }
    });

    await tx.movimentacao.create({
        data: {
            justificativa,
            quantidade: Math.abs(diferenca),
            produtoId,
            codProduto,
            itemPedidoId
        }
    });
}
export async function cancelarSaida(
    tx,
    produtoId,
    quantidade,
    itemPedidoId,
    codProduto,
    justificativa
) {
    const produto = await tx.produto.findUnique({
        where: {
            id: produtoId
        }
    });

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    await tx.produto.update({
        where: {
            id: produtoId
        },
        data: {
            qtdEstoque:
                produto.qtdEstoque + quantidade
        }
    });

    await tx.movimentacao.create({
        data: {
            justificativa,
            quantidade,
            produtoId,
            codProduto,
            itemPedidoId
        }
    });
}