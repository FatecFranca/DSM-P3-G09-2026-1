"use client"
import {useRouter} from "next/navigation"
import {isAdmin} from "@/services/authService"
import { useEffect,useState } from "react"
import {Card, CardHeader,CardTitle,CardDescription,CardAction,CardContent,CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import {getAllUsuarios,deleteUsuario,register} from "@/services/authService"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
export default function AdminPage() {
  const router =useRouter()

  useEffect(() => {
    if (!isAdmin()) {
      router.push(
        "/dashboard"
      )
    }
  },[])

  const [usuarios,setUsuarios]= useState([])
  async function carregarUsuarios() {

  try {

    const data = await getAllUsuarios()

    setUsuarios(data)

  } catch(error) {

    console.error(error)

  }
}

useEffect(() => {

  carregarUsuarios()

}, [])

const [nome, setNome] = useState("")
const [email, setEmail] = useState("")
const [senha, setSenha] = useState("")

    return(
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
                      <AlertDialogAction className="!bg-green-500 hover:bg-green-600 cursor-pointer" onClick={async () => {await register(nome,email,senha),  await carregarUsuarios()}}>
                        Criar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>
            </div>
            <div>
                <div className="flex flex-wrap gap-4 p-13">
                <div className="flex-3">
                <Card className="background-sidebar border border-zinc-600 border-t-3 border-t-zinc-500 h-170 overflow-y-auto">
                    <CardTitle className=" flex justify-between p-2 pl-4 -mt-2 pr-4">
                        <h1 className="text-white ">Usuarios</h1>
                    </CardTitle>
                        <Table>
                    
        <TableHeader className="border-t-2 border-t-zinc-500 hover:bg-zinc-900">

          <TableRow className="bg-zinc-900">
            <TableHead className="text-white pl-4">nome</TableHead>
            <TableHead className="text-white ">email</TableHead>
            <TableHead className="text-white ">Data de Criacao</TableHead>
            <TableHead className="text-white ">Delete</TableHead>
          </TableRow>

        </TableHeader>

        <TableBody>

          {usuarios.map((usuarios) => (

            <TableRow key={usuarios.id}>

              <TableCell className="text-orange-500">
                {usuarios.nome}
              </TableCell>

              <TableCell>
                 {usuarios.email}
              </TableCell>

              <TableCell>
                <p>
                  {new Date(usuarios.createdAt).toLocaleDateString("pt-BR")}
                </p>           
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
                    <AlertDialogDescription className="text-zinc-400">
                      Essa acao ira deletar o usuario permanente
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
                      <AlertDialogCancel className="cursor-pointer">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={async () => {await deleteUsuario(usuarios.id),  await carregarUsuarios()}}>
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