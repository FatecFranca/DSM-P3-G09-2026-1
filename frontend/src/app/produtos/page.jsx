"use client"
import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation"
import {Input} from "@/components/ui/input";
import {getProdutos,deleteProduto,createProduto} from "@/services/produtosService"
import { useEffect,useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default  function ProdutosPage(){
    const router =useRouter()

     const [produtos,setProdutos]= useState([])
      async function carregarProdutos() {
    
      try {
        console.log(produtos)
        const data = await getProdutos()
    
        setProdutos(data)
    
      } catch(error) {
    
        console.error(error)
    
      }
    }
    
    useEffect(() => {
    
      carregarProdutos()
    
    }, [])

    const [imagem,setImagem]= useState(null)
    const [descricao,setDescricao]= useState("")
    const [marca,setMarca]= useState("")
    const [unidade,setUnidade]= useState("")
    const [precoCusto,setprecoCusto]= useState("")
    const [precoUnitario,setprecoUnitario]= useState("")
    const [qtdMinima,setQtdMinima]= useState("")

    return(
        <div className="flex flex-col ">
            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">catálogo</h3>
                </div>
                <div className="flex flex-wrap pt-3 pr-13 justify-between">
                    <h1 className="text-white text-3xl font-black">PRODUTOS</h1>
                            <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button className="bg-orange-500 cursor-pointer p-5">
                      + Novo Produto
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-700">
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
                          placeholder="UN"
                          value={unidade}
                          onChange={(e) => setUnidade(e.target.value)}
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
                      <AlertDialogAction className="!bg-green-500 hover:bg-green-600 cursor-pointer" onClick={async () => {const formData = new FormData()
                        if (imagem) {
                            formData.append("imagem", imagem)
                        }
                        formData.append("descricao", descricao)
                        formData.append("marca", marca)
                        formData.append("unidadeMedida", unidade)
                        formData.append("precoCusto", precoCusto)
                        formData.append("precoUnitario", precoUnitario)
                        formData.append("qtdMinima", qtdMinima)
                        await createProduto(formData)  
                        await carregarProdutos()}}>
                        Criar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>
            </div>
            <div className="flex flex-wrap pl-13 pr-13 pt-10 gap-3">
                <Input placeholder="Pesquisar produto..." className="flex-10 p-5 w6/10 background-sidebar border border-zinc-600 text-white hover:border-orange-500 " />
                <Button className="flex-1 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500 group"><span className="group-hover:text-orange-500">TODOS</span></Button>
                <Button className="flex-1 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500 group"><span className="group-hover:text-orange-500">CRITICO</span></Button>
                <Button className="flex-1 p-5 cursor-pointer background-sidebar border-zinc-500 hover:border-orange-500 hover:text-orange-500 group"><span className="group-hover:text-orange-500">OK</span></Button>
            </div>
            <div> 
            </div>
            <div>
                <div className="flex flex-wrap gap-4 pl-13 pr-13 pt-5 ">
                <div className="flex-3">
                <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-zinc-500 h-170 overflow-y-auto">
                    <CardTitle className=" flex justify-between p-2 pl-4 -mt-2 pr-4">
                        <h1 className="text-white ">Produtos</h1>
                    </CardTitle>
                        <Table>
                    
        <TableHeader className="border-t-2 border-t-zinc-500 hover:bg-zinc-900">

          <TableRow className="bg-zinc-900">
            <TableHead className="text-white pl-4">Imagem</TableHead>
            <TableHead className="text-white ">PRODUTO / MARCA</TableHead>
            <TableHead className="text-white ">UNID</TableHead>
            <TableHead className="text-white ">PREÇO CUSTO</TableHead>
            <TableHead className="text-white ">PREÇO UNIT.</TableHead>
            <TableHead className="text-white ">QTD. ESTOQUE</TableHead>
            <TableHead className="text-white ">MIN. ESTOQUE</TableHead>
            <TableHead className="text-white ">AÇÔES</TableHead>
          </TableRow>

        </TableHeader>

        <TableBody>

          {produtos.map((produtos) => (

            <TableRow key={produtos.id}>

              <TableCell>

                <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-700">
                    <img src={produtos.imagemUrl} alt={produtos.descricao} className="w-full h-full object-cover"/>
                </div>

                </TableCell>

              <TableCell>

                <div className="flex flex-col">

                <span className="text-white font-medium">
                {produtos.descricao}
                </span>

                <span className="text-zinc-400 text-sm">
                {produtos.marca}
                </span>

                </div>

            </TableCell>
              <TableCell>
                {produtos.unidadeMedida}
              </TableCell>
              <TableCell>                
                {produtos.precoCusto}
              </TableCell>
              <TableCell>
                {produtos.precoUnitario}
              </TableCell>
              <TableCell>
                {produtos.qtdEstoque}
              </TableCell>
              <TableCell>
                {produtos.qtdMinima}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button className="bg-red-500 cursor-pointer">
                      Delete
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-700">
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
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={async () => {await deleteProduto(produtos.id),  await carregarProdutos()}}>
                        confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

                </Card>
                </div>
            </div>
            </div>
            <div></div>
        </div>
    )
}