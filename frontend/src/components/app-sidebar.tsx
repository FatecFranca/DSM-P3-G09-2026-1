"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import logo from "@/assets/autoStockLogo.png"
import BotaoLogout from "@/components/ui/buttonLogOut"
import {
  LayoutDashboard,
  Box,
  Users,
  Building,
  ShoppingBag,
  ArrowDownUp
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Produtos",
    href: "/produtos",
    icon: Box
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users
  },
  {
    title: "Fornecedores",
    href: "/fornecedores",
    icon: Building
  },
  {
    title: "Pedidos",
    href: "/pedidos",
    icon: ShoppingBag
  },
  {
    title: "Movimentação",
    href: "/movimentacao",
    icon: ArrowDownUp
  }
]

export function AppSidebar() {

  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-zinc-600 flex">

      <SidebarContent className="background-sidebar flex">

        <SidebarGroup>

          <SidebarGroupLabel className="flex items-center h-16 pt-2">

            <Image
              src={logo}
              alt="Logo"
              width={160}
              height={40}
            />

          </SidebarGroupLabel>

          <div className="w-[calc(100%+2rem)] -mx-4 border-b border-zinc-600 my-3" />

          <SidebarGroupContent>

            <SidebarMenu>

              <SidebarGroupLabel className="text-zinc-500 px-3">
                MENU
              </SidebarGroupLabel>

              <div className="mt-2 flex flex-col gap-1">

                {menuItems.map((item) => {

                  const Icon = item.icon

                  const isActive = pathname === item.href

                  return (

                    <SidebarMenuItem key={item.href}>

                      <SidebarMenuButton
                        asChild
                        className="p-0 h-auto"
                      >

                        <Link
                          href={item.href}
                          className={`
                            flex items-center gap-3
                            px-4 py-3
                            border-l-4
                            transition-all duration-200
                            active:scale-[0.98]

                            ${
                              isActive
  ? "border-orange-500 bg-orange-500/15 text-white"
  : "border-transparent text-zinc-300 hover:bg-orange-500/15 hover:border-orange-500 hover:text-zinc-800 hover:translate-x-1"
                            }
                          `}
                        >

                          <Icon className="w-4 h-4" />

                          <span className="text-sm font-medium">
                            {item.title}
                          </span>

                        </Link>

                      </SidebarMenuButton>
                            
                    </SidebarMenuItem>
                  )
                })}

              </div>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto mb-2">
        <BotaoLogout/>
        </div>
      </SidebarContent>

    </Sidebar>
  )
}