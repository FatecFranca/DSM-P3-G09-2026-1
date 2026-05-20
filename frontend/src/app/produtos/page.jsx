"use client"
import { Card, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input";
import { getProdutos, deleteProduto, createProduto, updateProduto, getProdutoById, } from "@/services/produtosService"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Trash2, FilePenLine } from 'lucide-react';

export default function ProdutosPage() {

  const router = useRouter()
  const [openEditar, setOpenEditar] = useState(false)
  const [openCriar, setOpenCriar] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
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

  async function carregarProdutos() {
    try {
      const data = await getProdutos()

      setTodosProdutos(data)

    } catch (error) {
      console.error(error)
    }
  }
  const produtosFiltrados = todosProdutos.filter((produto) => {

    const nomeMatch =
      produto.descricao
        .toLowerCase()
        .includes(pesquisa.toLowerCase())

    const marcaMatch =
      produto.marca
        .toLowerCase()
        .includes(pesquisa.toLowerCase())

    const pesquisaMatch = nomeMatch || marcaMatch

    if (filtro === "critico") {
      return (
        produto.qtdEstoque <= produto.qtdMinima &&
        pesquisaMatch
      )
    }

    if (filtro === "ok") {
      return (
        produto.qtdEstoque > produto.qtdMinima &&
        pesquisaMatch
      )
    }

    return pesquisaMatch
  })

  useEffect(() => {
    carregarProdutos()
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
  }
  async function abrirDelete(id) {

    try {
      const produto = await getProdutoById(id)

      setProdutoSelecionado(produto)

    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="flex flex-col w-full ">

    {mensagem && (
      <div
        className={`
          fixed top-5 right-5
          px-4 py-3 rounded-lg
          text-white font-medium
          shadow-lg z-50
          transition-all duration-300

          ${
            tipoMensagem === "sucesso"
              ? "bg-green-500"
              : "bg-red-500"
          }
        `}
      >
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
        <Input placeholder="Pesquisar produto..." className=" w-full md:flex-1 p-5 background-sidebar border border-zinc-600 text-white hover:border-orange-500" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500p" onClick={() => setFiltro("todos")}>TODOS</Button>
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500p" onClick={() => setFiltro("critico")}>CRITICO</Button>
        <Button className="w-full md:w-auto px-6 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500p" onClick={() => setFiltro("ok")}>OK</Button>
      </div>
      <div>
      </div>
      <div>
        <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-13 pt-5">
          <div className="flex-3">
            <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-zinc-500 overflow-hidden">
              <CardTitle className=" flex justify-between p-2 pl-4 -mt-2 pr-4">
                <h1 className="text-white ">Produtos</h1>
              </CardTitle>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-t-2 border-t-zinc-500 hover:bg-zinc-900">
                  <TableRow className="bg-zinc-900">
                    <TableHead className="text-white pl-4">Imagem</TableHead>
                    <TableHead className="text-white ">PRODUTO / MARCA</TableHead>
                    <TableHead className="text-white ">PREÇO CUSTO</TableHead>
                    <TableHead className="text-white ">PREÇO UNIT.</TableHead>
                    <TableHead className="text-white ">QTD. ESTOQUE</TableHead>
                    <TableHead className="text-white ">MIN. ESTOQUE</TableHead>
                    <TableHead className="text-white ">AÇÔES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody  className="max-h-[500px] overflow-y-auto">
                  {produtosFiltrados.map((produto) => (

                    <TableRow key={produto.id}>
                      <TableCell>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border border-zinc-700">
                          <img src={produto.imagemUrl} alt={produto.descricao} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {produto.descricao}
                          </span>
                          <span className="text-zinc-400 text-sm">
                            {produto.marca}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {produto.precoCusto}
                      </TableCell>
                      <TableCell>
                        {produto.precoUnitario}
                      </TableCell>
                      <TableCell>
                        {produto.qtdEstoque}
                      </TableCell>
                      <TableCell>
                        {produto.qtdMinima}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row md:flex-col gap-2 p-1">
                          <Button className="bg-red-500 cursor-pointer" onClick={async () => {
                            await abrirDelete(produto.id)
                            setOpenDelete(true)
                          }}>
                            <Trash2></Trash2>
                          </Button>
                          <Button className="bg-amber-500 cursor-pointer" onClick={async () => {
                            await abrirEditar(produto.id)
                            setOpenEditar(true)
                          }}>
                            <FilePenLine></FilePenLine>
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
      </div>

      <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Editar Produto
            </AlertDialogTitle>
            <div className="text-zinc-400">
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Imagem URL"
                  onChange={(e) => setImagem(e.target.files[0])}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Marca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Preço Custo"
                  value={precoCusto}
                  onChange={(e) => setprecoCusto(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Preço Venda"
                  value={precoUnitario}
                  onChange={(e) => setprecoUnitario(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Quantidade Minima"
                  value={qtdMinima}
                  onChange={(e) => setQtdMinima(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />


              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
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
    formData.append("precoCusto", precoCusto.replace(",", "."))
    formData.append("precoUnitario", precoUnitario.replace(",", "."))
    formData.append("qtdMinima", qtdMinima)

    await updateProduto(
      produtoSelecionado.id,
      formData
    )

    await carregarProdutos()

    setMensagem("Produto editado com sucesso!")
    setTipoMensagem("sucesso")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    setOpenEditar(false)

  } catch (error) {

    setMensagem("Erro ao editar produto!")
    setTipoMensagem("erro")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    console.error(error)
  }
}}
            >
              Editar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700  w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Novo Produto
            </AlertDialogTitle>
            <div className="text-zinc-400">
              <div className="flex flex-col gap-4 mt-4">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Imagem URL"
                  onChange={(e) => setImagem(e.target.files[0])}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Marca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Preço Custo"
                  value={precoCusto}
                  onChange={(e) => setprecoCusto(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Preço Venda"
                  value={precoUnitario}
                  onChange={(e) => setprecoUnitario(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <Input
                  placeholder="Quantidade Minima"
                  value={qtdMinima}
                  onChange={(e) => setQtdMinima(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />


              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className="!bg-green-500 hover:bg-green-600 cursor-pointer" onClick={async () => {

  try {

    const formData = new FormData()

    if (imagem) {
      formData.append("imagem", imagem)
    }

    formData.append("descricao", descricao)
    formData.append("marca", marca)
    formData.append("precoCusto", precoCusto.replace(",", "."))
    formData.append("precoUnitario", precoUnitario.replace(",", "."))
    formData.append("qtdMinima", qtdMinima)

    await createProduto(formData)

    await carregarProdutos()

    setMensagem("Produto criado com sucesso!")
    setTipoMensagem("sucesso")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    setOpenCriar(false)

  } catch (error) {

    setMensagem("Erro ao criar produto, descrição ja existente!")
    setTipoMensagem("erro")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    console.error(error)
  }
}}>
              Criar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700  w-[95%] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Tem certeza?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 bg-zinc-900 border-zinc-700">
              Essa acao ira deletar o produto permanente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={async () => {

  try {

    await deleteProduto(produtoSelecionado.id)

    await carregarProdutos()

    setMensagem("Produto deletado com sucesso!")
    setTipoMensagem("sucesso")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    setOpenDelete(false)

  } catch (error) {

    setMensagem("Erro ao deletar produto!")
    setTipoMensagem("erro")

    setTimeout(() => {
      setMensagem("")
    }, 3000)

    console.error(error)
  }
}}>
              confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

