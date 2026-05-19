import  api  from "./api"

export async function getClientes() {
  const response = await api.get("/clientes")
  return response.data
}

export async function getClienteById(id) {
  const response = await api.get(`/clientes/${id}`)
  return response.data
}

export async function createCliente(data) {
  const response = await api.post("/clientes", data)
  return response.data
}

export async function updateCliente(id, data) {
  const response = await api.put(`/clientes/${id}`, data)
  return response.data
}

export async function deleteCliente(id) {
  const response = await api.delete(`/clientes/${id}`)
  return response.data
}