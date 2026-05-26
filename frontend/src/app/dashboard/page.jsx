"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, Building2, TriangleAlert,ArrowBigUp  } from "lucide-react"
import { getPedidosMes, getRecentes, getEstoqueCritico, getProdutosEmEstoque, getTotalClientes, getTotalFornecedores, getFornecedoresHoje, getPedidosHoje, getClientesHoje, getProdutosHoje } from "@/services/dashboardService"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashBoardPage() {

  const [produtos, setProdutos] = useState(0)
  const [pedidos, setPedidos] = useState(0)
  const [fornecedores, setFornecedores] = useState(0)
  const [clientes, setClientes] = useState(0)
  const [estoqueCritico, setEstoqueCritico] = useState([])
  const [recentes, setRecentes] = useState([])
  const [estoqueDia, setEstoqueDia] = useState(0)
  const [pedidosDia, setPedidosDia] = useState(0)
  const [clienteDia, setClienteDia] = useState(0)
  const [fornecedoresDia, setFornecedoresDia] = useState(0)

  const router = useRouter()

  function RegistarEntrada() {
    router.push("/entradas")
  }

  const horario = new Date().toLocaleTimeString("pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getProdutosEmEstoque()
        setProdutos(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getPedidosMes()
        setPedidos(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getTotalFornecedores()
        setFornecedores(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getTotalClientes()
        setClientes(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getRecentes()
        setRecentes(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getEstoqueCritico()
        setEstoqueCritico(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getProdutosHoje()
        setEstoqueDia(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getPedidosHoje()
        setPedidosDia(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getClientesHoje()
        setClienteDia(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getFornecedoresHoje()
        setFornecedoresDia(data)
      } catch (error) {
        console.error(error)
      }
    }
    carregar()
  }, [])

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col pl-13">
        <div>
          <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">VISÃO GERAL</h3>
        </div>
        <div className="flex flex-wrap pt-3 justify-between">
          <h1 className="text-white text-3xl font-black">DASHBOARD</h1>
          <span className="pr-15"><Card className="p-2 background-sidebar border border-zinc-600 rounded-xa">
            <CardContent>
              {horario}
            </CardContent>
          </Card></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 pt-13 pl-13 pr-13">
        <div className="flex-4">
          <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                  <Package className="text-orange-500" size={20} />
                </div>
                <span className="flex items-center justify-center text-xs font-semibold text-green-400 bg-green-400/15 px-2 py-1 rounded-full">
                  + {estoqueDia.length ?? 0} hoje
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center pb-2 h-12">
              <div className="mt-13 text-orange-500">{produtos}</div>
            </CardContent>
            <CardFooter className="background-sidebar">
              Produtos em estoque
            </CardFooter>
          </Card>
        </div>
        <div className="flex-4">
          <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <ShoppingCart className="text-green-500" size={20} />
                </div>
                <span className="flex items-center justify-center text-xs font-semibold text-green-400 bg-green-400/15 px-2 py-1 rounded-full">
                  + {pedidosDia.length ?? 0} hoje
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center pb-2 h-12">
              <div className="mt-13 text-green-500">{pedidos}</div>
            </CardContent>
            <CardFooter className="background-sidebar ">
              Pedidos do Mês
            </CardFooter>
          </Card>
        </div>
        <div className="flex-4">
          <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Users className="text-purple-500" size={20} />
                </div>
                <span className="flex items-center justify-center text-xs font-semibold text-green-400 bg-green-400/15 px-2 py-1 rounded-full">
                  + {clienteDia.length ?? 0} hoje
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center pb-2 h-12">
              <div className="mt-13 text-purple-500">{clientes}</div>
            </CardContent>
            <CardFooter className="background-sidebar">
              Clientes Ativos
            </CardFooter>
          </Card>
        </div>
        <div className="flex-4">
          <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <Building2 className="text-cyan-500" size={20} />
                </div>
                <span className="flex items-center justify-center text-xs font-semibold text-green-400 bg-green-400/15 px-2 py-1 rounded-full">
                  + {fornecedoresDia.length ?? 0} hoje
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center pb-2 h-12">
              <div className="mt-13 text-cyan-500">{fornecedores}</div>
            </CardContent>
            <CardFooter className="background-sidebar">
              Fornecedores
            </CardFooter>
          </Card>
        </div>
      </div>
      <div>
        <div className="flex flex-col xl:flex-row gap-4 p-4 xl:p-13">
          <div className="w-full xl:flex-[3] min-w-0">
            <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 h-[420px] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#0F0F10]">
                <div>
                  <h1 className="text-white text-xl font-bold">
                    Todos os Pedidos
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    Últimos pedidos registrados no sistema
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/pedidos")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer">
                  Ver Todos os Pedidos
                </Button>
              </div>
              <div className="overflow-auto h-full">
                 <Table  className="min-w-[700px]">
                  <TableHeader className="bg-[#111114] sticky top-0 z-10">
                    <TableRow className="border-b border-zinc-800 hover:bg-[#111114]">
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs pl-6">
                        Pedido
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs">
                        Cliente
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs">
                        Valor
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs">
                        Data
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentes.map((pedido) => (
                      <TableRow
                        key={pedido.id}
                        className="border-b border-zinc-800 hover:bg-zinc-900/40 transition-all">
                        <TableCell className="pl-6 font-semibold text-orange-500">
                          PED-{pedido.numPedido}
                        </TableCell>
                        <TableCell className="text-white">
                          {pedido?.cliente?.nomeRazaoSocial}
                        </TableCell>
                        <TableCell className="font-semibold text-white">
                          {Number(pedido.valorTotal).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {new Date(
                            pedido.createdAt
                          ).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
          <div className="w-full xl:flex-1">
            <Card className="w2.5/10 h-105 background-sidebar border border-zinc-600 border-t-3 border-t-red-500">
              <CardHeader className=' border-b border-zinc-600 pb-4'>
                <CardTitle className="flex justify-start gap-5">
                  <TriangleAlert className="text-red-500"></TriangleAlert>
                  <div className="text-red-500">Estoque Critico</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-60 overflow-y-auto flex flex-col gap-3 pt-2">
                {estoqueCritico.map((produto) => {
                  const porcentagem = Math.min((produto.qtdEstoque / produto.qtdMinima) * 100, 100);
                  const corTexto =
                    porcentagem <= 30 ? "text-red-500" : "text-yellow-500";
                  const corBarra =
                    porcentagem <= 30 ? "bg-red-500" : "bg-yellow-500";
                  return (
                    <div key={produto.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                      <p className="text-sm text-white font-medium mb-2 leading-tight">
                        {produto.descricao}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-zinc-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${corBarra}`}
                            style={{ width: `${porcentagem}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold tabular-nums ${corTexto}`}>
                          {produto.qtdEstoque}/{produto.qtdMinima}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="background-sidebar mt-10">
                <Button variant="outline" className="w-full background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group" onClick={RegistarEntrada}><ArrowBigUp className="w-4 h-4 mr-2 group-hover:text-orange-500" /><span className=" group-hover:text-orange-500 ">Registrar Entrada</span></Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}