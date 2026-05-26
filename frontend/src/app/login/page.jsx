import { Card, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import logo from "@/assets/estokai_logo_final.svg"
import { SidebarProvider } from "@/components/ui/sidebar"
import { LoginSidebar } from "@/components/login-sidebar"

export default function LoginPage() {

  return (
    <div className=" flex flex-col lg:flex-row min-h-screen">
      <div className=" w-full lg:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-between">
        <div>
          <Image
            src={logo}
            alt="Estokai Logo"
            width={300}
            height={300}
            className="w-56 md:w-100 lg:w-80"
          />
          <div className="mt-10 lg:mt-24 max-w-2xl">
            <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
              gestão inteligente
            </h3>
            <div className="mt-5">
              <h1 className="text-white font-black leading-tight text-4xl md:text-5xl lg:text-6xl">
                Controle total do seu estoque
              </h1>
            </div>
            <div className="mt-8 max-w-xl">
              <h2 className="text-zinc-500 text-base md:text-lg font-semibold">
                Gerencie produtos, pedidos, clientes e fornecedores em um único lugar. Simples, rápido e preciso.
              </h2>
            </div>
          </div>
          <div className=" mt-10 flex flex-col md:flex-row gap-4 w-full">
            <Card className="h-12 flex-1 background-sidebar border border-zinc-600 rounded-2xl flex items-center justify-center">
              <CardTitle className="text-sm md:text-base text-zinc-400 text-center">
                Estoque em tempo real
              </CardTitle>
            </Card>
            <Card className=" h-12 flex-1 background-sidebar border border-zinc-600 rounded-2xl flex items-center justify-center">
              <CardTitle className="text-sm md:text-base text-zinc-400 text-center">
                Pedidos automatizados
              </CardTitle>
            </Card>
            <Card className="h-12 flex-1 background-sidebar border border-zinc-600 rounded-2xl flex items-center justify-center">
              <CardTitle className="text-sm md:text-base text-zinc-400 text-center">
                Relatórios detalhados
              </CardTitle>
            </Card>
          </div>
        </div>
        <div className="mt-10 lg:mt-0">
          <h1 className="text-zinc-700 text-sm">
            © 2026 Estokai · Todos os direitos reservados
          </h1>
        </div>
      </div>
      <SidebarProvider>
        <main className="background-login w-full lg:w-1/2 min-h-screen flex items-center justify-center">
          <LoginSidebar />
        </main>
      </SidebarProvider>
    </div>
  )
}