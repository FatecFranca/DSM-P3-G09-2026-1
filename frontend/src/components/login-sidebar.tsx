"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

import { Input } from "./ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "./ui/button"

export function LoginSidebar() {
  const [showPassword, setShowPassword] = useState(false)
  const router=useRouter()
  return (

    <Sidebar side="right" className="border-r w-140 border-zinc-600">
      <SidebarContent className="background-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center h-16 pt-2">
          </SidebarGroupLabel>
          <div className="w-[calc(100%+2rem)] -mx-4 border-zinc-600 my-3" />
          <SidebarGroupContent>
            <div className="flex flex-col pl-12 pt-33 pr-12 pb-10 gap-4">
              <div>
                <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                  Bem-vindo de volta
                </h3>
              </div>
              <div>
                <h1 className="text-white text-4xl font-black">
                  Entrar na conta
                </h1>
              </div>
              <div>
                <h1 className="text-sm text-zinc-400">
                  Acesse o painel de controle do seu estoque
                </h1>
              </div>
            </div>

            <div className="flex flex-col pl-12 pr-12 gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-400 text-xs tracking-[0.1em] font-semibold uppercase">
                  E-mail
                </h3>
                <div className="relative transition-all duration-200 rounded-xl focus-within:shadow-lg focus-within:shadow-orange-500/10">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 peer-focus:text-orange-400 transition" />
                  <Input
                    placeholder="seu@email.com"
                    className="peer bg-zinc-800 border-zinc-700 pl-10 pr-10 h-12 text-white transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-400 text-xs tracking-[0.1em] font-semibold uppercase">
                  Senha
                </h3>
                <div className="relative transition-all duration-200 rounded-xl focus-within:shadow-lg focus-within:shadow-orange-500/10">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 peer-focus:text-orange-400 transition" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="········"
                    className="peer bg-zinc-800 border-zinc-700 pl-10 pr-10 h-12 text-white transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 peer-focus:text-orange-400 hover:text-orange-400 transition"
                  >
                    {
                      showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
                
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mt-3 pl-12 pr-12 gap-2">
                <Checkbox id="remember" className="data-[state=checked]:bg-orange-400" />
                <label htmlFor="remember" className="text-sm text-zinc-400">
                  Lembrar de mim
                </label>
              </div>
              <div className="flex items-center mt-3 pl-12 pr-12 gap-2 ">
                    <Button onClick={()=>router.push("/dashboard")} className="p-6 flex w-full cursor-pointer text-center bg-orange-500 hover:shadow-lg
    hover:shadow-orange-500/20 hover:bg-orange-400 ">ENTRAR <ArrowRight/></Button>
              </div>

              
              
            </div>
          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  )
}