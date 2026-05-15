import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image"
import logo from "@/assets/autoStockLogo.png"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar }
  from "@/components/app-sidebar";

import { LoginSidebar } from "@/components/login-sidebar"; 

export default function LoginPage() {

  return (
    <div className="
      flex
      justify-center
      min-h-screen
    ">
        <div className="flex-wrap p-13 w-full">
            <div>
            <Image
              src={logo}
              alt="AutoStock Logo"
              width={180}
              height={180}
              className="mr-2"
            />
            </div>
            <div className="mt-40 p-3 w-140">
                <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">gestão inteligente</h3>
                <div className="mt-5">
                <h1 className="text-white text-6xl font-black">Controle total do seu estoque</h1>
                </div>
                <div className="mt-10 w-107">
                <h1 className="text-zinc-500 text-1xl font-black">Gerencie produtos, pedidos, clientes e fornecedores em um único lugar. Simples, rápido e preciso.</h1>
                </div>
            </div>
            <div className="mt-10 p-3  w-160 flex flex-wrap gap-5">
                <Card className="h-10 flex-1 background-sidebar border border-zinc-600 text-center flex items-center justify-center rounded-2xl">
                        <CardTitle className="text-1xl text-zinc-400 align-center text-center">Estoque em tempo real</CardTitle>
                </Card>
                <Card className="h-10 flex-1 background-sidebar border border-zinc-600 text-center flex items-center justify-center rounded-2xl">
                        <CardTitle className="text-1xl text-zinc-400">Pedidos automatizados</CardTitle>
                </Card>
                <Card className="h-10 flex-1 background-sidebar border border-zinc-600 text-center flex items-center justify-center rounded-2xl">
                        <CardTitle className="text-1xl text-zinc-400">Relatórios detalhados</CardTitle>
                </Card>
            </div>
            <div className="mt-27 p-3">
                <h1 className="text-zinc-700">
                    © 2026 AutoStock Pro · Todos os direitos reservados
                </h1>
            </div>


        </div>
        

        <SidebarProvider>
      <main className="
        background-login
        min-h-screen
        w-full
      ">
        <LoginSidebar />
      </main>
      </SidebarProvider> 
    </div>
  );
}