import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
export default async function home(){


    return(
        <div className="flex flex-col ">
            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">catálogo</h3>
                </div>
                <div className="flex flex-wrap pt-3 pr-13 justify-between">
                    <h1 className="text-white text-3xl font-black">PRODUTOS</h1>
                            <Button className="p-5 cursor-pointer bg-orange-500"><span className="">+ Novo Produto</span></Button>
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
                    <Card className="w10/10 h-170 background-sidebar border border-zinc-600">
                        <CardContent className="h-66 overflow-y-auto">
                            api.map
                        </CardContent>
                    </Card>
                </div>
            </div>
            </div>
            <div></div>
        </div>
    )
}