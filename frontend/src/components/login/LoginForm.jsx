"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { login } from "@/services/authService"
import { Eye, EyeOff } from "lucide-react"


export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error("Preencha todos os campos para continuar.")
    }

    try {
      setLoading(true)

      await login(email, password)

      toast.success("Bem-vindo de volta!")

      router.push("/dashboard")

    } catch (error) {
      console.error(error)
      toast.error("E-mail ou senha incorretos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#111114] border border-zinc-800 p-8 rounded-2xl shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Acesse sua conta</h2>
        <p className="text-zinc-400 text-sm">Insira suas credenciais para entrar no painel.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-zinc-400 text-xs uppercase tracking-wider block mb-2">
            E-mail
          </label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white h-12 focus:border-orange-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-zinc-400 text-xs uppercase tracking-wider block mb-2">
            Senha
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white h-12 focus:border-orange-500 pr-12"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-bold text-base transition-all"
        >
          {loading ? "Entrando..." : "Entrar na plataforma"}
        </Button>
      </form>
    </div>
  )
}