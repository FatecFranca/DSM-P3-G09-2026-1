"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMovimentacoes } from "@/services/movimentacaoService"
import { ArrowDown, ArrowUp, Package } from "lucide-react"
export default function MovimentacaoPage() {

    const [movimentacoes, setMovimentacoes] = useState([])

    async function carregarMovimentacoes() {
        try {
            const data = await getMovimentacoes()
            setMovimentacoes(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        carregarMovimentacoes()
    }, [])

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col px-4 md:px-8 lg:px-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                        controle
                    </h3>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-3">
                    <h1 className="text-white text-3xl font-black">
                        MOVIMENTAÇÕES
                    </h1>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-13 pt-5">
                <div className="flex-3 w-full">
                    <Card className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#0F0F10]">
                                    <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider pl-6">
                                            Tipo
                                        </TableHead>
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                                            Produto
                                        </TableHead>
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                                            Quantidade
                                        </TableHead>
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                                            Justificativa
                                        </TableHead>
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                                            Pedido
                                        </TableHead>
                                        <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                                            Data
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movimentacoes.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-zinc-500 py-10"
                                            >
                                                Nenhuma movimentação encontrada
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {movimentacoes.map((movimentacao) => {
                                        const entrada = movimentacao.quantidade > 0
                                        return (
                                            <TableRow
                                                key={movimentacao.id}
                                                className="border-b border-zinc-800 hover:bg-zinc-900/40 transition-all">
                                                <TableCell className="pl-6 py-4">
                                                    <div
                                                        className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-xs font-semibold border
                                                         ${entrada
                                                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                                : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                                                        {entrada ? (
                                                            <ArrowUp className="w-3 h-3" />
                                                        ) : (
                                                            <ArrowDown className="w-3 h-3" />
                                                        )}
                                                        {entrada ? "ENTRADA" : "SAÍDA"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                                                            {movimentacao.produto?.imagemUrl ? (
                                                                <img
                                                                    src={movimentacao.produto.imagemUrl}
                                                                    alt={movimentacao.produto.descricao}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-5 h-5 text-zinc-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-semibold text-sm">
                                                                {movimentacao.produto?.descricao}
                                                            </span>
                                                            <span className="text-zinc-400 text-xs mt-1">
                                                                {movimentacao.produto?.marca}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`font-black text-sm
                                                            ${entrada
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                            }`}>
                                                        {entrada ? "+" : ""}
                                                        {movimentacao.quantidade}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-zinc-300 text-sm">
                                                        {movimentacao.justificativa}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-orange-500 font-semibold">
                                                        {movimentacao.itemPedido?.pedido?.numPedido
                                                            ? `PED-${movimentacao.itemPedido.pedido.numPedido}`
                                                            : "-"
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-white text-sm">
                                                            {new Date(
                                                                movimentacao.createdAt
                                                            ).toLocaleDateString("pt-BR")}
                                                        </span>
                                                        <span className="text-zinc-500 text-xs">
                                                            {new Date(
                                                                movimentacao.createdAt
                                                            ).toLocaleTimeString("pt-BR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}