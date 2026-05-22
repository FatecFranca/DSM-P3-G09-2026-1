"use client"
import { Card, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProdutos, deleteProduto, createProduto, updateProduto, getProdutoById, addFornecedorProduto, removeFornecedorProduto } from "@/services/produtosService"
import { getFornecedores } from "@/services/fornecedoresService"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Trash2, FilePenLine, X, Eye } from 'lucide-react';

function InfoBox({ label, value }) {
  return (
    <div className="bg-zinc-800 rounded-lg px-4 py-3">
      <span className="text-zinc-500 text-xs uppercase tracking-wider">{label}</span>
      <p className="text-white mt-1 break-words text-sm">
        {value ?? <span className="text-zinc-600 italic">Não informado</span>}
      </p>
    </div>
  )
}

export default function ProdutosPage() {

  const [openEditar, setOpenEditar] = useState(false)
  const [openCriar, setOpenCriar] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openVer, setOpenVer] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [imagem, setImagem] = useState(null)
  const [descricao, setDescricao] = useState("")
  const [marca, setMarca] = useState("")
  const [precoCusto, setprecoCusto] = useState("")
  const [precoUnitario, setprecoUnitario] = useState("")
  const [qtdMinima, setQtdMinima] = useState("")
  const [todosProdutos, setTodosProdutos] = useState([])
  const [filtro, setFiltro] = useState("todos")
  const [pesquisa, setPesquisa] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [tipoMensagem, setTipoMensagem] = useState("")
  const [fornecedores, setFornecedores] = useState([])
  const [fornecedorId, setFornecedorId] = useState("")
  const [removendoFornecedor, setRemovendoFornecedor] = useState(null)

  async function handleRemoverFornecedor(produtoId, fornecedorId) {
    setRemovendoFornecedor(fornecedorId)
    try {
      await removeFornecedorProduto(produtoId, fornecedorId)
      setProdutoSelecionado(prev => ({
        ...prev,
        fornecedores: prev.fornecedores.filter(
          v => v.fornecedor.id !== fornecedorId
        )
      }))
      await carregarProdutos()
      setMensagem("Fornecedor removido com sucesso!")
      setTipoMensagem("sucesso")
      setTimeout(() => setMensagem(""), 3000)
    } catch (error) {
      setMensagem("Erro ao remover fornecedor!")
      setTipoMensagem("erro")
      setTimeout(() => setMensagem(""), 3000)
      console.error(error)
    } finally {
      setRemovendoFornecedor(null)
    }
  }

  async function carregarProdutos() {
    try {
      const data = await getProdutos()
      setTodosProdutos(data)
    } catch (error) {
      console.error(error)
    }
  }

  const produtosFiltrados = todosProdutos.filter((produto) => {
    const nomeMatch = produto.descricao.toLowerCase().includes(pesquisa.toLowerCase())
    const marcaMatch = produto.marca.toLowerCase().includes(pesquisa.toLowerCase())
    const pesquisaMatch = nomeMatch || marcaMatch
    if (filtro === "critico") return produto.qtdEstoque <= produto.qtdMinima && pesquisaMatch
    if (filtro === "ok") return produto.qtdEstoque > produto.qtdMinima && pesquisaMatch
    return pesquisaMatch
  })

  useEffect(() => { carregarProdutos() }, [])

  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const data = await getFornecedores()
        setFornecedores(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregarFornecedores()
  }, [])

  async function abrirEditar(id) {
    try {
      const produto = await getProdutoById(id)
      setProdutoSelecionado(produto)
      setDescricao(produto.descricao || "")
      setMarca(produto.marca || "")
      setprecoCusto(produto.precoCusto?.toString() || "")
      setprecoUnitario(produto.precoUnitario?.toString() || "")
      setQtdMinima(produto.qtdMinima?.toString() || "")
      setFornecedorId("")
    } catch (error) {
      console.error(error)
    }
  }

  async function abrirCriar() {
    setProdutoSelecionado(null)
    setImagem(null)
    setDescricao("")
    setMarca("")
    setprecoCusto("")
    setprecoUnitario("")
    setQtdMinima("")
    setFornecedorId("")
  }

  async function abrirDelete(id) {
    try {
      const produto = await getProdutoById(id)
      setProdutoSelecionado(produto)
    } catch (error) {
      console.error(error)
    }
  }

  async function abrirVer(id) {
    try {
      const produto = await getProdutoById(id)
      setProdutoSelecionado(produto)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {mensagem && (
        <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300
          ${tipoMensagem === "sucesso" ? "bg-green-500" : "bg-red-500"}`}>
          {mensagem}
        </div>
      )}
      <div className="flex flex-col px-4 md:px-8 lg:px-13">
        <div>
          <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">catálogo</h3>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-3">
          <h1 className="text-white text-3xl font-black">PRODUTOS</h1>
          <Button className="bg-orange-500 cursor-pointer p-5" onClick={async () => {
            await abrirCriar()
            setOpenCriar(true)
          }}>
            + Novo Produto
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-13 pt-6 gap-3">
        <Input placeholder="Pesquisar produto..." className="w-full md:flex-1 p-5 background-sidebar border border-zinc-600 text-white hover:border-orange-500" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500" onClick={() => setFiltro("todos")}>TODOS</Button>
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500" onClick={() => setFiltro("critico")}>CRITICO</Button>
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500" onClick={() => setFiltro("ok")}>OK</Button>
      </div>
      <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-13 pt-5">
        <div className="flex-3 w-full">
          <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-zinc-500 overflow-hidden">
            <CardTitle className="flex justify-between p-2 pl-4 -mt-2 pr-4">
              <h1 className="text-white">Produtos</h1>
            </CardTitle>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-t-2 border-t-zinc-500 hover:bg-zinc-900">
                  <TableRow className="bg-zinc-900">
                    <TableHead className="text-white pl-4">Imagem</TableHead>
                    <TableHead className="text-white">PRODUTO / MARCA</TableHead>
                    <TableHead className="text-white">FORNECEDOR</TableHead>
                    <TableHead className="text-white">PREÇO CUSTO</TableHead>
                    <TableHead className="text-white">PREÇO UNIT.</TableHead>
                    <TableHead className="text-white">QTD. ESTOQUE</TableHead>
                    <TableHead className="text-white">MIN. ESTOQUE</TableHead>
                    <TableHead className="text-white">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border border-zinc-700">
                          <img src={produto.imagemUrl} alt={produto.descricao} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{produto.descricao}</span>
                          <span className="text-zinc-400 text-sm">{produto.marca}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {produto.fornecedores?.map((vinculo) => (
                          <div key={vinculo.id}>{vinculo.fornecedor.nomeFantasia}</div>
                        ))}
                      </TableCell>
                      <TableCell>R$ {produto.precoCusto.toFixed(2)}</TableCell>
                      <TableCell>R$ {produto.precoUnitario.toFixed(2)}</TableCell>
                      <TableCell>{produto.qtdEstoque}</TableCell>
                      <TableCell>{produto.qtdMinima}</TableCell>
                      <TableCell>
                        <div className="flex flex-row md:flex-col gap-2 p-1">
                          <Button
                            variant="outline"
                            className="background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500"
                            onClick={async () => {
                              await abrirVer(produto.id)
                              setOpenVer(true)
                            }}
                          >
                            <Eye />
                          </Button>
                          <Button className="bg-amber-500 cursor-pointer" onClick={async () => {
                            await abrirEditar(produto.id)
                            setOpenEditar(true)
                          }}>
                            <FilePenLine />
                          </Button>
                          <Button className="bg-red-500 cursor-pointer" onClick={async () => {
                            await abrirDelete(produto.id)
                            setOpenDelete(true)
                          }}>
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/*Modal de visualizaçãp*/}
      <AlertDialog open={openVer} onOpenChange={setOpenVer}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[90vw] md:!max-w-[90vw] lg:!w-[82vw] lg:!max-w-[82vw] max-h-[92vh] overflow-y-auto p-4 md:p-8">
          <AlertDialogHeader>
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                <img
                  src={produtoSelecionado?.imagemUrl}
                  alt={produtoSelecionado?.descricao}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <AlertDialogTitle className="text-white text-xl font-black truncate">
                  {produtoSelecionado?.descricao}
                </AlertDialogTitle>
                <p className="text-zinc-400 text-sm mt-0.5">{produtoSelecionado?.marca}</p>
              </div>
              <div className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold border
                ${produtoSelecionado?.qtdEstoque <= produtoSelecionado?.qtdMinima
                  ? "bg-red-500/20 text-red-400 border-red-700"
                  : "bg-green-500/20 text-green-400 border-green-700"
                }`}>
                {produtoSelecionado?.qtdEstoque <= produtoSelecionado?.qtdMinima ? "Crítico" : "OK"}
              </div>
            </div>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                Identificação
              </p>
              <InfoBox label="Descrição" value={produtoSelecionado?.descricao} />
              <InfoBox label="Marca" value={produtoSelecionado?.marca} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                Preços e Estoque
              </p>
              <InfoBox label="Preço Custo" value={`R$ ${produtoSelecionado?.precoCusto}`} />
              <InfoBox label="Preço Venda" value={`R$ ${produtoSelecionado?.precoUnitario}`} />
              <InfoBox label="Qtd. em Estoque" value={produtoSelecionado?.qtdEstoque} />
              <InfoBox label="Qtd. Mínima" value={produtoSelecionado?.qtdMinima} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                Fornecedores vinculados
              </p>
              {produtoSelecionado?.fornecedores?.length === 0 && (
                <p className="text-zinc-600 text-sm italic">Nenhum fornecedor vinculado.</p>
              )}
              {produtoSelecionado?.fornecedores?.map((vinculo) => (
                <div
                  key={vinculo.id}
                  className="bg-zinc-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-medium truncate">
                      {vinculo.fornecedor.nomeFantasia}
                    </span>
                    <span className="text-zinc-500 text-xs truncate">
                      {vinculo.fornecedor.cnpj}
                    </span>
                  </div>
                  <button
                    disabled={removendoFornecedor === vinculo.fornecedor.id}
                    onClick={() => handleRemoverFornecedor(
                      produtoSelecionado.id,
                      vinculo.fornecedor.id
                    )}
                    className="shrink-0 p-1.5 rounded-md border border-red-500/40 text-red-400
                      hover:bg-red-500 hover:text-white hover:border-red-500
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all cursor-pointer"
                  >
                    {removendoFornecedor === vinculo.fornecedor.id
                      ? <span className="text-xs px-1">...</span>
                      : <X size={14} />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter className="pt-2 border-t border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*Modal de Editar*/}
      <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Editar Produto</AlertDialogTitle>
            <div className="text-zinc-400">
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Preço Custo" value={precoCusto} onChange={(e) => setprecoCusto(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Preço Venda" value={precoUnitario} onChange={(e) => setprecoUnitario(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Quantidade Minima" value={qtdMinima} onChange={(e) => setQtdMinima(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} className="bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3">
                  <option value="">Selecione um fornecedor (opcional)</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>{f.nomeFantasia}</option>
                  ))}
                </select>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="!bg-amber-500 hover:bg-amber-600 cursor-pointer" onClick={async () => {
              try {
                const formData = new FormData()
                if (imagem) formData.append("imagem", imagem)
                formData.append("descricao", descricao)
                formData.append("marca", marca)
                formData.append("precoCusto", precoCusto.replace(",", "."))
                formData.append("precoUnitario", precoUnitario.replace(",", "."))
                formData.append("qtdMinima", qtdMinima)
                const produtoAtualizado = await updateProduto(produtoSelecionado.id, formData)
                if (fornecedorId) await addFornecedorProduto(produtoAtualizado.id, fornecedorId)
                await carregarProdutos()
                setMensagem("Produto editado com sucesso!")
                setTipoMensagem("sucesso")
                setTimeout(() => setMensagem(""), 3000)
                setOpenEditar(false)
              } catch (error) {
                setMensagem("Erro ao editar produto!")
                setTipoMensagem("erro")
                setTimeout(() => setMensagem(""), 3000)
                console.error(error)
              }
            }}>
              Editar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*Modal de Criar*/}
      <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Novo Produto</AlertDialogTitle>
            <div className="text-zinc-400">
              <div className="flex flex-col gap-4 mt-4">
                <Input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Preço Custo" value={precoCusto} onChange={(e) => setprecoCusto(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Preço Venda" value={precoUnitario} onChange={(e) => setprecoUnitario(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <Input placeholder="Quantidade Minima" value={qtdMinima} onChange={(e) => setQtdMinima(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
                <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} className="bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3">
                  <option value="">Selecione um fornecedor (opcional)</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>{f.nomeFantasia}</option>
                  ))}
                </select>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="!bg-green-500 hover:bg-green-600 cursor-pointer" onClick={async () => {
              try {
                const formData = new FormData()
                if (imagem) formData.append("imagem", imagem)
                formData.append("descricao", descricao)
                formData.append("marca", marca)
                formData.append("precoCusto", precoCusto.replace(",", "."))
                formData.append("precoUnitario", precoUnitario.replace(",", "."))
                formData.append("qtdMinima", qtdMinima)
                const produtoCriado = await createProduto(formData)
                if (fornecedorId) await addFornecedorProduto(produtoCriado.id, fornecedorId)
                await carregarProdutos()
                setMensagem("Produto criado com sucesso!")
                setTipoMensagem("sucesso")
                setTimeout(() => setMensagem(""), 3000)
                setOpenCriar(false)
              } catch (error) {
                setMensagem("Erro ao criar produto, descrição ja existente!")
                setTipoMensagem("erro")
                setTimeout(() => setMensagem(""), 3000)
                console.error(error)
              }
            }}>
              Criar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*Modal de deletar*/}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Essa ação irá deletar o produto permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={async () => {
              try {
                await deleteProduto(produtoSelecionado.id)
                await carregarProdutos()
                setMensagem("Produto deletado com sucesso!")
                setTipoMensagem("sucesso")
                setTimeout(() => setMensagem(""), 3000)
                setOpenDelete(false)
              } catch (error) {
                setMensagem("Erro ao deletar produto!")
                setTipoMensagem("erro")
                setTimeout(() => setMensagem(""), 3000)
                console.error(error)
              }
            }}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}