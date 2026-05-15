import api from "./api"
import Cookies from "js-cookie"

export async function login(email, senha) {

  const response = await api.post(
    "/auth/login",
    {
      email,
      senha
    }
  )

  const { token, usuario } =
    response.data

  Cookies.set(
    "token",
    token,
    {
      expires: 7
    }
  )

  Cookies.set(
    "usuario",
    JSON.stringify(usuario),
    {
      expires: 7
    }
  )

  return response.data
}

export async function register(
  nome,
  email,
  senha
) {

  const response = await api.post(
    "/auth/register",
    {
      nome,
      email,
      senha
    }
  )

  return response.data
}

export function logout() {

  Cookies.remove("token")

  Cookies.remove("usuario")
}

export function getUsuario() {

  const usuario =
    Cookies.get("usuario")

  return usuario
    ? JSON.parse(usuario)
    : null
}

export function isAuthenticated() {

  return !!Cookies.get("token")
}
export function isAdmin() {

  const usuario =
    getUsuario()

  return usuario?.admin
}