"use client"
import Image from "next/image"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import { getProdutos } from "@/services/produtosService"
import { getFornecedores } from "@/services/fornecedoresService"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Trash2, FilePenLine, Eye } from 'lucide-react';
import { toast } from "sonner"

import { ProdutoFormModal } from "@/components/produtos/ProdutoFormModal";
import { ProdutoViewModal } from "@/components/produtos/ProdutoViewModal";
import { ProdutoDeleteModal } from "@/components/produtos/ProdutoDeleteModal";

export default function ProdutosPage() {
    const [todosProdutos, setTodosProdutos] = useState([])
    const [fornecedores, setFornecedores] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit] = useState(8)
    const [pagination, setPagination] = useState(null)
    const [filtro, setFiltro] = useState("Todos")
    const [pesquisa, setPesquisa] = useState("")

    const [pesquisaDebounced, setPesquisaDebounced] = useState("")

    const [openForm, setOpenForm] = useState(false)
    const [openVer, setOpenVer] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)

    async function carregarProdutos(pageParam = page, searchParam = pesquisaDebounced) {
        try {
            setLoading(true)
            // Enviando o parâmetro de busca (ex: search ou q, ajuste conforme seu backend espera)
            const resp = await getProdutos({ page: pageParam, limit, search: searchParam })
            const data = resp?.data ?? resp
            setTodosProdutos(Array.isArray(data) ? data : [])
            setPagination(resp?.pagination ?? null)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao carregar produtos")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setPesquisaDebounced(pesquisa)
            setPage(1) // Sempre reseta para a página 1 ao iniciar uma nova busca
        }, 400)

        return () => clearTimeout(handler)
    }, [pesquisa])

    useEffect(() => {
        carregarProdutos(page, pesquisaDebounced)
    }, [page, pesquisaDebounced])

    useEffect(() => {
        async function carregarFornecedores() {
            try {
                const resp = await getFornecedores();
                const arrayFornecedores = resp?.data ?? resp;
                setFornecedores(Array.isArray(arrayFornecedores) ? arrayFornecedores : []);
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
                setFornecedores([]);
            }
        }
        carregarFornecedores()
    }, [])

    const produtosFiltrados = todosProdutos.filter((produto) => {
        if (filtro === "Critico") return produto.qtdEstoque <= produto.qtdMinima
        if (filtro === "Normal") return produto.qtdEstoque > produto.qtdMinima
        return true
    })

    const handleAbrirAcao = (produto, setModalOpen) => {
        setProdutoSelecionado(produto);
        setModalOpen(true);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col px-4 md:px-8 lg:px-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">catálogo</h3>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-3">
                    <h1 className="text-foreground text-3xl font-black">PRODUTOS</h1>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 p-5 rounded-lg font-semibold shadow-lg shadow-orange-500/20"
                        onClick={() => handleAbrirAcao(null, setOpenForm)}
                    >
                        + Novo Produto
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-13 pt-6 gap-3">
                <Input placeholder="Pesquisar produto no banco..." className="w-full md:flex-1 p-5 transition-all bg-card border border-border text-foreground hover:border-orange-500 hover:text-orange-500" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
                {["Todos", "Critico", "Normal"].map((item) => (
                    <button
                        key={item}
                        onClick={() => setFiltro(item)}
                        className={`px-4 py-2 rounded-lg border transition-all ${filtro === item ? "border-orange-500 text-orange-500 bg-orange-500/10" : "border-border text-muted-foreground hover:border-orange-500 hover:text-orange-500"}`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-13 pt-5">
                <div className="flex-3 w-full">
                    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-card">
                                    <TableRow className="px-6 py-4 uppercase tracking-wider text-muted-foreground">
                                        <TableHead className="text-muted-foreground text-xs tracking-wider pl-6">Imagem</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Produto / Marca</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Fornecedor</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Preço Custo</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Preço Unit.</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Estoque</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Min. Estoque</TableHead>
                                        <TableHead className="text-muted-foreground text-xs tracking-wider">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 8 }).map((_, idx) => (
                                            <TableRow key={`sk-${idx}`} className="border-b border-border">
                                                <TableCell className="pl-6 py-4"><Skeleton className="w-14 h-14 rounded-xl bg-card" /></TableCell>
                                                <TableCell><div className="flex flex-col gap-2"><Skeleton className="h-4 w-40 bg-card" /><Skeleton className="h-3 w-24 bg-card" /></div></TableCell>
                                                <TableCell><Skeleton className="h-4 w-28 bg-card" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20 bg-card" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20 bg-card" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-16 rounded-full bg-card" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-10 bg-card" /></TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="h-9 w-9 rounded-md bg-card" />
                                                        <Skeleton className="h-9 w-9 rounded-md bg-card" />
                                                        <Skeleton className="h-9 w-9 rounded-md bg-card" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : produtosFiltrados.map((produto) => (
                                        <TableRow key={produto.id} className="border-b border-border hover:bg-card/40 transition-all">
                                            <TableCell className="pl-6 py-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-card flex items-center justify-center">
                                                    {produto.imagemUrl && <Image src={produto.imagemUrl} alt={produto.descricao} width={56} height={56} className="w-full h-full object-cover" />}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-foreground font-semibold text-sm">{produto.descricao}</span>
                                                    <span className="text-muted-foreground text-xs mt-1">{produto.marca}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {produto.fornecedores?.map((v, index) => (
                                                        <span key={v.fornecedor?.id || index} className="text-foreground text-sm">{v.fornecedor?.nomeFantasia}</span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="text-muted-foreground font-medium">R$ {produto.precoCusto.toFixed(2)}</span></TableCell>
                                            <TableCell><span className="text-orange-500 font-bold">R$ {produto.precoUnitario.toFixed(2)}</span></TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${produto.qtdEstoque < produto.qtdMinima ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>
                                                    {produto.qtdEstoque}
                                                </span>
                                            </TableCell>
                                            <TableCell><span className="text-muted-foreground">{produto.qtdMinima}</span></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" className="bg-transparent border-zinc-700 hover:border-orange-500 hover:text-orange-500 cursor-pointer text-foreground transition-all" onClick={() => handleAbrirAcao(produto, setOpenVer)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button className="bg-amber-500 hover:bg-amber-600 text-foreground cursor-pointer transition-all" onClick={() => handleAbrirAcao(produto, setOpenForm)}>
                                                        <FilePenLine className="w-4 h-4" />
                                                    </Button>
                                                    <Button className="bg-red-500 hover:bg-red-600 text-foreground cursor-pointer transition-all" onClick={() => handleAbrirAcao(produto, setOpenDelete)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!loading && produtosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center text-muted-foreground py-10 text-sm italic">
                                                Nenhum Produto encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>

            {!loading && (
                <div className="flex items-center justify-center gap-3 px-4 md:px-8 lg:px-13 pb-10 pt-6">
                    <Button variant="outline" className="bg-card border-border" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</Button>
                    <div className="text-sm text-muted-foreground">
                        Página <span className="text-foreground font-semibold">{page}</span>
                        {pagination?.totalPages && <> de <span className="text-foreground font-semibold">{pagination.totalPages}</span></>}
                    </div>
                    <Button variant="outline" className="bg-card border-border" onClick={() => setPage((p) => p + 1)} disabled={(pagination?.totalPages && page >= pagination.totalPages) || (!pagination?.totalPages && todosProdutos.length < limit)}>Próxima</Button>
                </div>
            )}

            <ProdutoFormModal isOpen={openForm} onClose={() => setOpenForm(false)} produtoAtual={produtoSelecionado} fornecedores={fornecedores} refreshList={() => carregarProdutos(page, pesquisaDebounced)} />
            <ProdutoViewModal isOpen={openVer} onClose={() => setOpenVer(false)} onEdit={() => setOpenForm(true)} produto={produtoSelecionado} />
            <ProdutoDeleteModal isOpen={openDelete} onClose={() => setOpenDelete(false)} produto={produtoSelecionado} refreshList={() => carregarProdutos(page, pesquisaDebounced)} />
        </div>
    );
}