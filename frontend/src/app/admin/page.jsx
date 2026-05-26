"use client"
import { useRouter } from "next/navigation"
import { isAdmin } from "@/services/authService"
import { useEffect, useState } from "react"
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { getAllUsuarios, deleteUsuario, register } from "@/services/authService"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AdminPage() {

  const router = useRouter()
  const [usuarios, setUsuarios] = useState([])
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  useEffect(() => {
    if (!isAdmin()) {
      router.push(
        "/dashboard"
      )
    }
  }, [])

  useEffect(() => {

    carregarUsuarios()

  }, [])

  async function carregarUsuarios() {
    try {
      const data = await getAllUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col pl-13">
        <div>
          <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Administração</h3>
        </div>
        <div className="flex flex-wrap pt-3 pr-13 justify-between">
          <h1 className="text-white text-3xl font-black">CRIAÇÃO DE USUARIOS</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-orange-500 cursor-pointer p-5">
                + Novo Usuario
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Novo Usuario
                </AlertDialogTitle>
                <div className="text-zinc-400">
                  <div className="flex flex-col gap-4 mt-4">
                    <Input
                      placeholder="Nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
                <AlertDialogCancel className="cursor-pointer">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction className="!bg-green-500 hover:bg-green-600 cursor-pointer" onClick={async () => { await register(nome, email, senha), await carregarUsuarios() }}>
                  Criar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-4 p-13">
          <div className="flex-1">
            <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#0F0F10]">
                <div>
                  <h1 className="text-white text-xl font-bold">
                    Usuários do Sistema
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    Gerencie os usuários cadastrados
                  </p>
                </div>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                >
                  {usuarios.length} usuários
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[700px]">
                <Table>
                  <TableHeader className="bg-[#111114] sticky top-0 z-10">
                    <TableRow className="border-b border-zinc-800 hover:bg-[#111114]">
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs pl-6">
                        Nome
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs">
                        Email
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs">
                        Data de Criação
                      </TableHead>
                      <TableHead className="text-zinc-400 uppercase tracking-wider text-xs text-right pr-6">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow
                        key={usuario.id}
                        className=" border-b border-zinc-800 hover:bg-zinc-900/40 transition-all"
                      >
                        <TableCell className="pl-6 font-semibold text-orange-500">
                          {usuario.nome}
                        </TableCell>
                        <TableCell className="text-white">
                          {usuario.email}
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {new Date(
                            usuario.createdAt
                          ).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="bg-red-500/15 hover:bg-red-500 text-red-400  hover:text-white border border-red-500/30 cursor-pointer transition-all"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">
                                  Tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                  Essa ação irá deletar o usuário permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className=" bg-red-500 hover:bg-red-600 cursor-pointer"
                                  onClick={async () => {
                                    await deleteUsuario(usuario.id)
                                    await carregarUsuarios()
                                  }}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}