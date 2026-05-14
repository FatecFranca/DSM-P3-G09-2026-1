import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
export default async function home(){


    return(
        <div className="flex flex-col ">
            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">VISÃO GERAL</h3>
                </div>
                <div className="flex flex-wrap pt-3 justify-between">
                    <h1 className="text-white text-3xl font-black">DASHBOARD</h1>
                    <span className="pr-15"><Card className="p-2 background-sidebar border border-zinc-600 rounded-xa">
                        <CardContent>
                            horarioaaaaaaa
                        </CardContent>
                        </Card></span>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-13 pl-13 pr-13">
                <div className="flex-4"> 
                    <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
                        <CardHeader>
                            <CardTitle className="flex justify-between ">
                                <div>logo</div>
                                <div>+12</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-12 justify-self-start align-center">
                            api
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
                                <div>logo</div>
                                <div>+12</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-12 justify-self-start align-center">
                            api
                        </CardContent>
                        <CardFooter className="background-sidebar">
                            Pedidos do Mês
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex-4">
                    <Card className="w4/10 background-sidebar border border-zinc-600 border-t-3 border-t-orange-500">
                        <CardHeader>
                            <CardTitle className="flex justify-between ">
                                <div>logo</div>
                                <div>+12</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-12 justify-self-start align-center">
                            api
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
                                <div>logo</div>
                                <div>+12</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-12 justify-self-start align-center">
                            api
                        </CardContent>
                        <CardFooter className="background-sidebar">
                            Fornecedores
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap gap-4 p-13">
                <div className="flex-3">
                    <Card className="w7.5/10 h-100 background-sidebar border border-zinc-600 border-t-3 border-t-zinc-500">
                        <CardHeader className=' border-b border-zinc-600 pb-4'>
                            <CardTitle className="flex justify-between ">
                                <div><b>Pedidos recentes</b></div>
                                <div><a href="#pedidos" className="hover:border-orange-500 hover:text-orange-500">ver todos</a></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-66 overflow-y-auto">
                            api.map
                        </CardContent>
                        <CardFooter className="background-sidebar border-t border-zinc-600">
                        </CardFooter>
                    </Card>
                </div>
                <div className="flex-1">
                    <Card className="w2.5/10 h-100 background-sidebar border border-zinc-600 border-t-3 border-t-red-500">
                        <CardHeader className=' border-b border-zinc-600 pb-4'>
                            <CardTitle className="flex justify-start ">
                                <div className="text-red-500">logo</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-60 overflow-y-auto">
                            api.map
                        </CardContent>
                        <CardFooter className="background-sidebar">
                            <Button variant="outline" className="w-full background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group"><span className=" group-hover:text-orange-500 ">Registrar Movimentacao</span></Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            </div>
            <div></div>
        </div>
    )
}