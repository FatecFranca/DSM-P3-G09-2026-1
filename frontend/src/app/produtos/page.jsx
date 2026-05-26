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
//Componente auxiliar de campo de formulário
function FormField({ label, placeholder, value, onChange, colSpan, type }) {
  return (
    <div className={colSpan ? "lg:col-span-" + colSpan : ""}>
      <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        type={type ?? "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800 border-zinc-700 text-white"
      />
    </div>
  )
}
//Grade de campos do formulário (igual para Criar e Editar)
function FormGrid({
  descricao,
  setDescricao,
  marca,
  setMarca,
  setImagem,
  precoCusto,
  setPrecoCusto,
  precoUnitario,
  setPrecoUnitario,
  setQtdMinima,
  qtdMinima,
  fornecedorId,
  setFornecedorId,
  fornecedores,
  fornecedoresSelecionados,
  setFornecedoresSelecionados
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
      <div className="flex flex-col gap-4">
        <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
          Identificação
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-1.5">
            Imagem do Produto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImagem(file)
              }
            }}
            className="bg-zinc-800 -mt-2 border border-zinc-700 text-white rounded-md  file:bg-orange-500 file:border-0 file:text-white file:px-3 file:py-1 file:rounded-md"
          />
        </div>
        <FormField label="Nome do Produto" placeholder="Nome do Produto" value={descricao} onChange={setDescricao} />
        <FormField label="Marca do Produto" placeholder="Marca do Produto" value={marca} onChange={setMarca} />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
          Preços e Estoque
        </p>
        <FormField label="Preço de custo" placeholder="0" value={precoCusto} onChange={setPrecoCusto} />
        <FormField label="Preço de Venda" placeholder="0" value={precoUnitario} onChange={setPrecoUnitario} />
        <FormField label="Quantidade Minima" placeholder="0" value={qtdMinima} onChange={setQtdMinima} />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
          Fornecedores Vinculados
        </p>
        <div className="flex gap-2">
          <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3">
            <option value="">
              Selecione um fornecedor
            </option>
            {fornecedores.map((fornecedor) => (
              <option
                key={fornecedor.id}
                value={fornecedor.id}
              >
                {fornecedor.nomeFantasia}
              </option>
            ))}
          </select>
          <Button type="button" className="bg-orange-500 hover:bg-orange-600" onClick={() => {
            if (!fornecedorId) return
            const fornecedorExiste = fornecedoresSelecionados.some(
              (v) => v.fornecedor?.id === fornecedorId
            )
            if (fornecedorExiste) return
            const fornecedorEncontrado = fornecedores.find(
              (f) => f.id === fornecedorId
            )
            if (!fornecedorEncontrado) return
            setFornecedoresSelecionados([
              ...fornecedoresSelecionados,
              {
                fornecedor: fornecedorEncontrado
              }
            ])
            setFornecedorId("")
          }}
          >
            +
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {fornecedoresSelecionados.length === 0 && (
            <p className="text-zinc-500 text-sm italic">
              Nenhum fornecedor vinculado
            </p>
          )}
          {fornecedoresSelecionados.map((vinculo, index) => (
            <div
              key={index}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-white text-sm">
                  {vinculo.fornecedor.nomeFantasia}
                </span>

                <span className="text-zinc-500 text-xs">
                  {vinculo.fornecedor.cnpj}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFornecedoresSelecionados(
                    fornecedoresSelecionados.filter(
                      (_, i) => i !== index
                    )
                  )
                }}
                className="text-red-400 hover:text-red-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//Classes compartilhadas do AlertDialogContent 
const MODAL_CLASSES = "bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[82vw] xl:!max-w-[82vw] 2xl:!w-[75vw] 2xl:!max-w-[75vw] max-h-[92vh] overflow-y-auto p-4 md:p-8"

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
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState([])

  function exibirMensagem(texto, tipo) {
    setMensagem(texto)
    setTipoMensagem(tipo)
    setTimeout(() => setMensagem(""), 3000)
  }

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
    if (filtro === "Critico") return produto.qtdEstoque <= produto.qtdMinima && pesquisaMatch
    if (filtro === "OK") return produto.qtdEstoque > produto.qtdMinima && pesquisaMatch
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
      setFornecedoresSelecionados(produto.fornecedores || [])
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
    setFornecedoresSelecionados([])
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

  function ModalHeader({ titulo, subtitulo, badge }) {
    return (
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
        <div className="bg-black p-3 rounded-xl aspect-[4/3] flex items-center justify-center">
          {produtoSelecionado?.imagemUrl ? (
            <img
              src={produtoSelecionado.imagemUrl}
              alt={produtoSelecionado.descricao}
              className="h-20 md:h-30 w-auto object-cover"
            />
          ) : (
            <span className="text-zinc-500 text-sm">
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <AlertDialogTitle className="text-white text-xl font-black truncate">
            {titulo}
          </AlertDialogTitle>
          {subtitulo && (
            <p className="text-zinc-400 text-sm mt-0.5 truncate">{subtitulo}</p>
          )}
        </div>
        {badge && (
          <div className="shrink-0 bg-orange-500/20 px-3 py-1.5 rounded-lg text-orange-500 border border-amber-700 text-sm font-semibold">
            {badge}
          </div>
        )}
      </div>
    )
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
          <Button className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 p-5 rounded-lg font-semibold  shadow-lg shadow-orange-500/20" onClick={async () => {
            await abrirCriar()
            setOpenCriar(true)
          }}>
            + Novo Produto
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-13 pt-6 gap-3">
        <Input placeholder="Pesquisar produto..." className="w-full md:flex-1 p-5 transition-all background-sidebar border border-zinc-800 text-white hover:border-orange-500 hover:text-orange-500" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
        {["Todos", "Critico", "OK"].map((item) => (
          <button
            key={item}
            onClick={() => setFiltro(item)}
            className={`
              px-4 py-2 rounded-lg border transition-all
              ${filtro === item
                ? "border-orange-500 text-orange-500 bg-orange-500/10"
                : "border-zinc-800 text-zinc-400 hover:border-orange-500 hover:text-orange-500"
              }`}>
            {item}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-13 pt-5">
        <div className="flex-3 w-full">
          <Card className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0F0F10]">
                  <TableRow className="border-b border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider pl-6">
                      Imagem
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Produto / Marca
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Fornecedor
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Preço Custo
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Preço Unit.
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Estoque
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Min. Estoque
                    </TableHead>
                    <TableHead className="text-zinc-400 uppercase text-[11px] tracking-wider">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow
                      key={produto.id}
                      className=" border-b border-zinc-800 hover:bg-zinc-900/40 transition-all
            ">
                      <TableCell className="pl-6 py-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-700 bg-black flex items-center justify-center">
                          {produto.imagemUrl ? (
                            <img
                              src={produto.imagemUrl}
                              alt={produto.descricao}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-zinc-500 text-xs">
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-sm">
                            {produto.descricao}
                          </span>
                          <span className="text-zinc-400 text-xs mt-1">
                            {produto.marca}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {produto.fornecedores?.map((vinculo) => (
                            <span
                              key={vinculo.id}
                              className="text-white text-sm"
                            >
                              {vinculo.fornecedor.nomeFantasia}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-300 font-medium">
                          R$ {produto.precoCusto.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-orange-500 font-bold">
                          R$ {produto.precoUnitario.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${produto.qtdEstoque < produto.qtdMinima
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                            }`}>
                          {produto.qtdEstoque}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-400">
                          {produto.qtdMinima}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="bg-transparent border-zinc-700 hover:border-orange-500 hover:text-orange-500 cursor-pointer text-white transition-all"
                            onClick={async () => {
                              await abrirVer(produto.id);
                              setOpenVer(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer transition-all"
                            onClick={async () => {
                              await abrirEditar(produto.id);
                              setOpenEditar(true);
                            }}
                          >
                            <FilePenLine className="w-4 h-4" />
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white  cursor-pointer transition-all"
                            onClick={async () => {
                              await abrirDelete(produto.id);
                              setOpenDelete(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
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
      {/*Modal de visualização*/}
      <AlertDialog open={openVer} onOpenChange={setOpenVer}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[90vw] md:!max-w-[90vw] lg:!w-[82vw] lg:!max-w-[82vw] max-h-[92vh] overflow-y-auto p-4 md:p-8">
          <AlertDialogHeader>
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 shrink-0 bg-black flex items-center justify-center">
                {produtoSelecionado?.imagemUrl ? (
                  <img
                    src={produtoSelecionado.imagemUrl}
                    alt={produtoSelecionado.descricao}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-zinc-500 text-xs">
                  </span>
                )}
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
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
            <AlertDialogCancel className="cursor-pointer">Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*Modal de editar*/}
      <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
        <AlertDialogContent className={MODAL_CLASSES}>
          <AlertDialogHeader>
            <ModalHeader
              titulo="Editar Produto"
              subtitulo={produtoSelecionado?.descricao}
            />
          </AlertDialogHeader>
          <FormGrid
            descricao={descricao}
            setDescricao={setDescricao}
            marca={marca}
            setMarca={setMarca}
            imagem={imagem}
            setImagem={setImagem}
            precoCusto={precoCusto}
            setPrecoCusto={setprecoCusto}
            precoUnitario={precoUnitario}
            setPrecoUnitario={setprecoUnitario}
            qtdMinima={qtdMinima}
            setQtdMinima={setQtdMinima}
            fornecedorId={fornecedorId}
            setFornecedorId={setFornecedorId}
            fornecedores={fornecedores}
            fornecedoresSelecionados={fornecedoresSelecionados}
            setFornecedoresSelecionados={setFornecedoresSelecionados}
          />
          <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="!bg-amber-500 hover:bg-amber-600 cursor-pointer"
              onClick={async () => {
                try {
                  const formData = new FormData()
                  if (imagem) {
                    formData.append("imagem", imagem)
                  }
                  formData.append("descricao", descricao)
                  formData.append("marca", marca)
                  formData.append(
                    "precoCusto",
                    precoCusto.replace(",", ".")
                  )
                  formData.append(
                    "precoUnitario",
                    precoUnitario.replace(",", ".")
                  )
                  formData.append(
                    "qtdMinima",
                    qtdMinima
                  )
                  await updateProduto(
                    produtoSelecionado.id,
                    formData
                  )
                  if (produtoSelecionado?.fornecedores?.length > 0) {
                    for (const vinculo of produtoSelecionado.fornecedores) {

                      await removeFornecedorProduto(
                        produtoSelecionado.id,
                        vinculo.fornecedor.id
                      )
                    }
                  }
                  // Adiciona fornecedores atuais
                  for (const vinculo of fornecedoresSelecionados) {
                    await addFornecedorProduto(
                      produtoSelecionado.id,
                      vinculo.fornecedor.id
                    )
                  }
                  await carregarProdutos()
                  exibirMensagem(
                    "Produto editado com sucesso!",
                    "sucesso"
                  )
                  setOpenEditar(false)
                } catch (error) {
                  exibirMensagem(
                    "Erro ao editar Produto!",
                    "erro"
                  )
                  console.error(error)
                }
              }}
            >
              Editar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*Modal de Criar*/}
      <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
        <AlertDialogContent className={MODAL_CLASSES}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl font-black">
              Novo Produto
            </AlertDialogTitle>
          </AlertDialogHeader>
          <FormGrid
            descricao={descricao}
            setDescricao={setDescricao}
            marca={marca}
            setMarca={setMarca}
            imagem={imagem}
            setImagem={setImagem}
            precoCusto={precoCusto}
            setPrecoCusto={setprecoCusto}
            precoUnitario={precoUnitario}
            setPrecoUnitario={setprecoUnitario}
            qtdMinima={qtdMinima}
            setQtdMinima={setQtdMinima}
            fornecedorId={fornecedorId}
            setFornecedorId={setFornecedorId}
            fornecedores={fornecedores}
            fornecedoresSelecionados={fornecedoresSelecionados}
            setFornecedoresSelecionados={setFornecedoresSelecionados}
          />
          <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="!bg-green-500 hover:bg-green-600 cursor-pointer"
              onClick={async () => {
                try {
                  // Cria produto
                  const formData = new FormData()
                  if (imagem) {
                    formData.append("imagem", imagem)
                  }
                  formData.append("descricao", descricao)
                  formData.append("marca", marca)
                  formData.append(
                    "precoCusto",
                    precoCusto.replace(",", ".")
                  )
                  formData.append(
                    "precoUnitario",
                    precoUnitario.replace(",", ".")
                  )
                  formData.append(
                    "qtdMinima",
                    qtdMinima
                  )
                  const produtoCriado = await createProduto(formData)
                  // Adiciona fornecedores vinculados
                  for (const vinculo of fornecedoresSelecionados) {
                    await addFornecedorProduto(
                      produtoCriado.id,
                      vinculo.fornecedor.id
                    )
                  }
                  await carregarProdutos()
                  setImagem(null)
                  setDescricao("")
                  setMarca("")
                  setprecoCusto("")
                  setprecoUnitario("")
                  setQtdMinima("")
                  setFornecedorId("")
                  setFornecedoresSelecionados([])
                  exibirMensagem(
                    "Produto criado com sucesso!",
                    "sucesso"
                  )
                  setOpenCriar(false)
                } catch (error) {
                  console.error(error)
                  exibirMensagem(
                    "Erro ao criar produto!",
                    "erro"
                  )
                }
              }}
            >
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
              Essa ação irá deletar o produto <strong className="text-white">{produtoSelecionado?.descricao}</strong> permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900">
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
              onClick={async () => {
                try {
                  await deleteProduto(produtoSelecionado.id)
                  await carregarProdutos()
                  exibirMensagem("Produto deletado com sucesso!", "sucesso")
                  setOpenDelete(false)
                } catch (error) {
                  exibirMensagem("Erro ao deletar Produto!", "erro")
                  console.error(error)
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}