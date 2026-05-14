import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
export default async function home(){


    return(
        <div className="flex flex-col ">
            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">cadastro</h3>
                </div>
                <div className="flex flex-wrap pt-3 pr-13 justify-between">
                    <h1 className="text-white text-3xl  font-black">FORNECEDORES</h1>
                    <Button className="p-5 cursor-pointer bg-orange-500"><span className="">+ Novo Fornecedor</span></Button>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap gap-4 p-13">
                        <Card className="w-80 h-80 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 cursor-pointer hover:border-orange-500 hover:text-orange-500 hover:border-2 hover:-translate-y-2">
                        <CardHeader className=' pb-4'>
                            <CardTitle className="flex justify-between ">
                                <div><b>Icone</b></div>
                                <div><a href="#fornecedores" className="hover:border-orange-500 hover:text-orange-500">24 pedidos</a></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-66 gap-1 flex flex-col">
                                <h1 className=" text-1xl font-black text-white">nome do lugar</h1>
                                <h3 className="border-b-1 pb-1">cpnj</h3>
                                <h3>email</h3>
                                <h3>telefone</h3>
                                <h3>cidade - estado</h3>
                                <h3>Categoria</h3>
                        </CardContent>
                        <CardFooter className="background-sidebar gap-3 flex justify-end">
                            <Button variant="outline" className="w-57 background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group"><span className=" group-hover:text-orange-500 ">Editar</span></Button>
                            <Button variant="outline" className="w-10 background-sidebar cursor-pointer border-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800 group"><span className=" group-hover:text-red-800 text-red-500">R</span></Button>
                        </CardFooter>
                    </Card>
                    
                    
            </div>
            </div>
            <div></div>
        </div>
    )
}