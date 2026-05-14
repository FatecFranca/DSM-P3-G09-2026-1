import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
export default async function home(){


    return(
        <div className="flex flex-col ">
            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">vendas</h3>
                </div>
                <div className="flex flex-wrap pr-13 pt-3 justify-between">
                    <h1 className="text-white text-3xl font-black">PEDIDOS</h1>
                    <Button className="p-5 cursor-pointer bg-orange-500"><span className="">+ Novo Pedido</span></Button>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap gap-4 p-13">
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