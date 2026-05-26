import  api  from "./api"

export async function getRecentes() {
  const response = await api.get("/dashboard/recents")
  return response.data
}

export async function getEstoqueCritico() {
  const response = await api.get("/dashboard/estoque-critico")
  return response.data
}

export async function getProdutosEmEstoque() {
  const response = await api.get("/dashboard/produto-em-estoque")
  return response.data
}

export async function getTotalClientes() {
  const response = await api.get("/dashboard/clientes")
  return response.data
}

export async function getTotalFornecedores() {
  const response = await api.get("/dashboard/fornecedores")
  return response.data
}

export async function getPedidosMes() {
  const response = await api.get("/dashboard/pedidos-mes")
  return response.data
}

export async function getProdutosHoje() {
  const response = await api.get("/produtos/hoje")
  return response.data
}

export async function getPedidosHoje() {
  const response = await api.get("/pedidos/hoje")
  return response.data
}

export async function getClientesHoje() {
  const response = await api.get("/clientes/hoje")
  return response.data
}

export async function getFornecedoresHoje() {
  const response = await api.get("/fornecedores/hoje")
  return response.data
}