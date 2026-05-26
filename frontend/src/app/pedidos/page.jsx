"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getClientes } from "@/services/clienteService";
import { getPedidos, createPedido, createItemPedido, updatePedido } from "@/services/pedidosService";
import { getProdutos } from "@/services/produtosService";
import {AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogCancel,AlertDialogHeader, AlertDialogFooter, AlertDialogAction} from "@/components/ui/alert-dialog";

const MODAL_CLASSES = `bg-zinc-950 border border-zinc-800 !w-[96vw] !max-w-[96vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[84vw] xl:!max-w-[84vw] 2xl:!w-[78vw] 2xl:!max-w-[78vw] h-[92vh] overflow-y-auto p-8`;
const FORMAS_PAGAMENTO = ["Pix", "Dinheiro", "Cartão Crédito", "Cartão Débito"];

function ModalHeader({ titulo, subtitulo, badge }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
      <div className="flex-1 min-w-0">
        <AlertDialogTitle className="text-white text-xl font-black truncate">{titulo}</AlertDialogTitle>
        {subtitulo && <p className="text-zinc-400 text-sm mt-0.5 truncate">{subtitulo}</p>}
      </div>
      {badge && (
        <div className="shrink-0 bg-orange-500/20 px-3 py-1.5 rounded-lg text-orange-500 border border-amber-700 text-sm font-semibold">
          {badge}
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-zinc-800 rounded-lg px-4 py-3">
      <span className="text-zinc-500 text-xs uppercase tracking-wider">{label}</span>
      <p className="text-white mt-1 break-words text-sm">
        {value ?? <span className="text-zinc-600 italic">Não informado</span>}
      </p>
    </div>
  );
}

function statusStyle(status) {
  switch (status) {
    case "Concluído": return "bg-green-500/20 text-green-400 border border-green-500/30";
    case "Pendente":  return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "Cancelado": return "bg-red-500/20 text-red-400 border border-red-500/30";
    default:          return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
  }
}

const moeda = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openCriar, setOpenCriar] = useState(false);
  const [passo, setPasso] = useState(1);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [buscaProduto, setBuscaProduto] = useState("");
  const [cliente, setCliente] = useState(null);
  const [itens, setItens] = useState([]);
  const [pagamento, setPagamento] = useState("");
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  useEffect(() => {
    carregarPedidos();
    carregarClientes();
    carregarProdutos();
  }, []);

  async function carregarPedidos() {
    try { setPedidos(await getPedidos()); }
    catch (error) { console.error(error); }
  }

  async function carregarClientes() {
    try { setClientes(await getClientes()); }
    catch (error) { console.error(error); }
  }

  async function carregarProdutos() {
    try { setProdutos(await getProdutos()); }
    catch (error) { console.error(error); }
  }

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
  }

  function abrirModalCriar() {
    setOpenCriar(true);
    setPasso(1);
    setCliente(null);
    setBuscaCliente("");
    setBuscaProduto("");
    setItens([]);
    setPagamento("");
  }

  function visualizarPedido(pedido) {
    setPedidoSelecionado(pedido);
    setOpenVisualizar(true);
  }

  function editarPedido(pedido) {
    setPedidoSelecionado(pedido);
    setPagamento(pedido.formaPagamento);
    setOpenEditar(true);
  }

  const clientesFiltrados = useMemo(
    () => clientes.filter((c) =>
      c.nomeRazaoSocial?.toLowerCase().includes(buscaCliente.toLowerCase()) ||
      c.cpfCnpj?.toLowerCase().includes(buscaCliente.toLowerCase())
    ),
    [clientes, buscaCliente]
  );

  const produtosFiltrados = useMemo(
    () => produtos.filter((p) =>
      p.descricao?.toLowerCase().includes(buscaProduto.toLowerCase()) ||
      p.marca?.toLowerCase().includes(buscaProduto.toLowerCase())
    ),
    [produtos, buscaProduto]
  );

  const pedidosFiltrados = useMemo(
    () => pedidos.filter((pedido) => {
      const nome = pedido?.cliente?.nomeRazaoSocial || "";
      const matchSearch =
        nome.toLowerCase().includes(search.toLowerCase()) ||
        String(pedido.numPedido).includes(search.toLowerCase());
      return matchSearch && (filtro === "Todos" || pedido.status === filtro);
    }),
    [pedidos, search, filtro]
  );

  const totalPedido = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0),
    [itens]
  );

  function adicionarProduto(produto) {
    if (produto.qtdEstoque <= 0) return mostrarMensagem("Produto sem estoque", "erro");

    const existe = itens.find((item) => item.produtoId === produto.id);
    if (existe) {
      if (existe.quantidade >= existe.estoque)
        return mostrarMensagem("Quantidade máxima em estoque atingida", "erro");
      setItens((prev) =>
        prev.map((item) =>
          item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      );
      return;
    }

    setItens((prev) => [
      ...prev,
      {
        produtoId: produto.id,
        descricao: produto.descricao,
        marca: produto.marca,
        estoque: produto.qtdEstoque,
        quantidade: 1,
        valorUnitario: Number(produto.precoUnitario),
      },
    ]);
  }

  function alterarQuantidade(produtoId, valor) {
    if (valor <= 0) return removerProduto(produtoId);
    setItens((prev) =>
      prev.map((item) => {
        if (item.produtoId !== produtoId || valor > item.estoque) return item;
        return { ...item, quantidade: valor };
      })
    );
  }

  function removerProduto(produtoId) {
    setItens((prev) => prev.filter((item) => item.produtoId !== produtoId));
  }

  function avancar() {
    if (passo === 1 && !cliente) return mostrarMensagem("Selecione um cliente", "erro");
    if (passo === 2 && itens.length === 0) return mostrarMensagem("Adicione pelo menos 1 produto", "erro");
    if (passo < 3) setPasso((prev) => prev + 1);
  }

  function voltar() {
    if (passo === 1) return setOpenCriar(false);
    setPasso((prev) => prev - 1);
  }

  async function confirmarPedido() {
    if (!pagamento) return mostrarMensagem("Selecione a forma de pagamento", "erro");

    try {
      setLoadingSalvar(true);
      const pedido = await createPedido({
        numPedido: Date.now().toString(),
        formaPagamento: pagamento,
        clienteId: cliente.id,
      });
      for (let i = 0; i < itens.length; i++) {
        await createItemPedido({
          numItem: i + 1,
          quantidade: itens[i].quantidade,
          pedidoId: pedido.id,
          produtoId: itens[i].produtoId,
          justificativa: "Venda de produto",
        });
      }
      await carregarPedidos();
      mostrarMensagem("Pedido criado com sucesso!");
      setOpenCriar(false);
    } catch (error) {
      console.error(error);
      mostrarMensagem(error?.response?.data?.error || "Erro ao criar pedido", "erro");
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function salvarEdicaoPedido() {
    try {
      await updatePedido(pedidoSelecionado.id, {
        status: pedidoSelecionado.status,
        formaPagamento: pedidoSelecionado.formaPagamento,
      });
      mostrarMensagem("Pedido atualizado!");
      await carregarPedidos();
      setOpenEditar(false);
    } catch (error) {
      console.error(error);
      mostrarMensagem("Erro ao atualizar pedido", "erro");
    }
  }

  return (
    <div className="min-h-screen text-zinc-100 pl-13 pr-13">
      {mensagem.texto && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-2xl border backdrop-blur-md animate-in slide-in-from-top-3 duration-300 ${
            mensagem.tipo === "sucesso" ? "bg-green-500/90 border-green-400" : "bg-red-500/90 border-red-400"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[3px] text-orange-500">Vendas</span>
          <h1 className="mt-1 text-4xl font-bold">Pedidos</h1>
        </div>
        <button
          onClick={abrirModalCriar}
          className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold transition-all hover:bg-orange-600"
        >
          + Novo Pedido
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar cliente ou pedido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[240px] flex-1 rounded-lg border border-zinc-800 bg-[#111114] px-4 py-2.5 outline-none transition-all focus:border-orange-500"
        />
        {["Todos", "Pendente", "Concluído", "Cancelado"].map((item) => (
          <button
            key={item}
            onClick={() => setFiltro(item)}
            className={`rounded-lg border px-4 py-2 transition-all ${
              filtro === item
                ? "border-orange-500 bg-orange-500/10 text-orange-500"
                : "border-zinc-800 text-zinc-400 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111114]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0F0F10]">
              <tr>
                {["Pedido", "Cliente", "Data", "Total", "Pagamento", "Status", "Ações"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs uppercase tracking-wider text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="border-t border-zinc-800 transition-all hover:bg-zinc-900/40">
                  <td className="px-6 py-4 font-semibold text-orange-500">PED-{pedido.numPedido}</td>
                  <td className="px-6 py-4">{pedido?.cliente?.nomeRazaoSocial}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 font-semibold">{moeda(pedido.valorTotal)}</td>
                  <td className="px-6 py-4">{pedido.formaPagamento}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(pedido.status)}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => visualizarPedido(pedido)}
                        className="rounded-lg border border-blue-500/30 px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/10"
                      >
                        Ver
                      </button>
                      {pedido.status === "Pendente" && (
                        <button
                          onClick={() => editarPedido(pedido)}
                          className="rounded-lg border border-orange-500/30 px-3 py-1 text-sm text-orange-400 hover:bg-orange-500/10"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar */}
      <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
        <AlertDialogContent className={MODAL_CLASSES}>
          <div className="mb-8 flex items-center justify-between">
            <AlertDialogTitle className="text-3xl font-bold text-white">Novo Pedido</AlertDialogTitle>
            <button onClick={() => setOpenCriar(false)} className="text-zinc-400 hover:text-white">X</button>
          </div>

          <div className="mb-10 flex w-full items-center justify-center">
            <div className="flex w-full max-w-3xl items-center justify-between">
              {["Cliente", "Produtos", "Confirmar"].map((label, index) => {
                const n = index + 1;
                const active = passo === n;
                const done = passo > n;
                return (
                  <React.Fragment key={n}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all ${
                          done ? "bg-green-500 text-white"
                          : active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {done ? "✓" : n}
                      </div>
                      <span className={`text-sm transition-all ${active ? "font-semibold text-orange-400" : "text-zinc-300"}`}>
                        {label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`mx-4 h-[2px] flex-1 rounded-full ${done ? "bg-green-500" : "bg-zinc-700"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {passo === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-400">Buscar cliente</label>
                <input
                  type="text"
                  placeholder="Nome ou CPF/CNPJ..."
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                  className="w-full rounded-xl border text-white border-zinc-800 bg-zinc-900 px-4 py-4 text-sm outline-none focus:border-orange-500"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <div className="max-h-[520px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-zinc-950">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-zinc-500">Cliente</th>
                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-zinc-500">CPF/CNPJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setCliente(c)}
                          className={`cursor-pointer border-t border-zinc-800 transition-all hover:bg-zinc-900 text-white ${
                            cliente?.id === c.id ? "bg-orange-500/10" : ""
                          }`}
                        >
                          <td className="px-4 py-4">{c.nomeRazaoSocial}</td>
                          <td className="px-4 py-4 text-zinc-400">{c.cpfCnpj}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {passo === 2 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-400">Buscar Produto</label>
                <input
                  type="text"
                  placeholder="Nome do produto..."
                  value={buscaProduto}
                  onChange={(e) => setBuscaProduto(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-zinc-800 text-white bg-zinc-900 px-4 py-4 text-sm outline-none focus:border-orange-500"
                />
                <div className="max-h-[520px] overflow-y-auto rounded-xl border border-zinc-800">
                  {produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-center justify-between text-white border-b border-zinc-800 p-4"
                    >
                      <div>
                        <div className="font-medium">{produto.descricao}</div>
                        <div className="text-sm text-zinc-500">Estoque: {produto.qtdEstoque}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-semibold text-orange-500">{moeda(produto.precoUnitario)}</div>
                        <button
                          disabled={produto.qtdEstoque <= 0}
                          onClick={() => adicionarProduto(produto)}
                          className="rounded-lg bg-orange-500 px-4 py-2 text-white text-sm font-semibold hover:bg-orange-600 disabled:bg-transparent disabled:hover:bg-transparent disabled:border disabled:border-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 text-lg font-semibold">Itens do Pedido</div>
                <div className="space-y-4">
                  {itens.length === 0 && (
                    <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
                      Nenhum produto adicionado
                    </div>
                  )}
                  {itens.map((item) => (
                    <div key={item.produtoId} className="rounded-xl text-white border border-zinc-800 bg-zinc-900 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{item.descricao}</div>
                          <div className="text-sm text-zinc-500">Estoque: {item.estoque}</div>
                        </div>
                        <button
                          onClick={() => removerProduto(item.produtoId)}
                          className="rounded-lg border border-red-500/40 px-3 py-1 text-red-500"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => alterarQuantidade(item.produtoId, item.quantidade - 1)}
                            className="h-8 w-8 rounded-lg border border-zinc-700"
                          >-</button>
                          <span className="w-8 text-center font-bold">{item.quantidade}</span>
                          <button
                            onClick={() => alterarQuantidade(item.produtoId, item.quantidade + 1)}
                            className="h-8 w-8 rounded-lg border border-zinc-700"
                          >+</button>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-zinc-500">{moeda(item.valorUnitario)}</div>
                          <div className="font-bold text-orange-500">{moeda(item.quantidade * item.valorUnitario)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {passo === 3 && (
            <div className="grid grid-cols-2 gap-8">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-5 text-xl font-bold text-white">Resumo do Pedido</div>
                <div className="mb-4">
                  <div className="text-sm text-zinc-500">Cliente</div>
                  <div className="font-semibold text-white">{cliente?.nomeRazaoSocial}</div>
                </div>
                <div className="space-y-3">
                  {itens.map((item) => (
                    <div key={item.produtoId} className="flex justify-between border-b border-zinc-800 text-white pb-3">
                      <div>
                        <div>{item.descricao}</div>
                        <div className="text-sm text-zinc-500">{item.quantidade} x {moeda(item.valorUnitario)}</div>
                      </div>
                      <div className="font-semibold text-orange-500">
                        {moeda(item.quantidade * item.valorUnitario)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between border-t border-zinc-700 pt-5 text-xl text-white font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{moeda(totalPedido)}</span>
                </div>
              </div>

              <div>
                <div className="mb-4 text-xl font-bold">Forma de Pagamento</div>
                <div className="grid grid-cols-2 gap-4">
                  {FORMAS_PAGAMENTO.map((op) => (
                    <button
                      key={op}
                      onClick={() => setPagamento(op)}
                      className={`rounded-xl border p-5 text-sm font-semibold transition-all ${
                        pagamento === op
                          ? "border-orange-500 bg-orange-500/10 text-orange-500"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-orange-500"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={voltar}
              className="rounded-lg border border-zinc-800 px-5 py-3 text-sm text-zinc-400 transition-all hover:border-orange-500 hover:text-orange-500"
            >
              {passo === 1 ? "Cancelar" : "Voltar"}
            </button>
            {passo < 3 ? (
              <button
                onClick={avancar}
                className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={confirmarPedido}
                disabled={loadingSalvar}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loadingSalvar ? "Salvando..." : "Confirmar Pedido"}
              </button>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Visualizar */}
      <AlertDialog open={openVisualizar} onOpenChange={setOpenVisualizar}>
        <AlertDialogContent className={MODAL_CLASSES}>
          <AlertDialogHeader>
            <ModalHeader
              titulo={`Pedido #${pedidoSelecionado?.numPedido}`}
              subtitulo={pedidoSelecionado?.cliente?.nomeRazaoSocial}
              badge={pedidoSelecionado?.status}
            />
          </AlertDialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Pedido</p>
              <InfoBox label="Número" value={pedidoSelecionado?.numPedido} />
              <InfoBox label="Pagamento" value={pedidoSelecionado?.formaPagamento} />
              <InfoBox label="Status" value={pedidoSelecionado?.status} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Cliente</p>
              <InfoBox label="Nome" value={pedidoSelecionado?.cliente?.nomeRazaoSocial} />
              <InfoBox label="CPF/CNPJ" value={pedidoSelecionado?.cliente?.cpfCnpj} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Financeiro</p>
              <InfoBox label="Total" value={moeda(pedidoSelecionado?.valorTotal)} />
              <InfoBox label="Data" value={new Date(pedidoSelecionado?.createdAt).toLocaleDateString("pt-BR")} />
            </div>
          </div>

          <div className="mt-2">
            <p className="mb-4 text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Produtos</p>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {pedidoSelecionado?.itens?.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-white">{item?.produto?.descricao}</div>
                      <div className="text-sm text-zinc-500 mt-1">Marca: {item?.produto?.marca}</div>
                      <div className="text-sm text-zinc-500">Quantidade: {item.quantidade}</div>
                      <div className="text-sm text-zinc-500">Valor Unitário: {moeda(item.valorUnitario)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500 uppercase">Total</div>
                      <div className="text-xl font-bold text-orange-500">{moeda(item.valorTotal)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
            <AlertDialogCancel className="cursor-pointer">Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Editar */}
      <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
        <AlertDialogContent className={MODAL_CLASSES}>
          <AlertDialogHeader>
            <ModalHeader
              titulo="Editar Pedido"
              subtitulo={`Pedido #${pedidoSelecionado?.numPedido}`}
              badge={pedidoSelecionado?.status}
            />
          </AlertDialogHeader>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="mb-5 text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Status do Pedido</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Pendente", "Concluído", "Cancelado"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setPedidoSelecionado({ ...pedidoSelecionado, status })}
                      className={`rounded-xl border p-5 text-sm font-semibold transition-all ${
                        pedidoSelecionado?.status === status
                          ? status === "Concluído" ? "border-green-500 bg-green-500/10 text-green-400"
                            : status === "Cancelado" ? "border-red-500 bg-red-500/10 text-red-400"
                            : "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-orange-500"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="mb-5 text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Forma de Pagamento</p>
                <div className="grid grid-cols-2 gap-4">
                  {FORMAS_PAGAMENTO.map((opcao) => (
                    <button
                      key={opcao}
                      onClick={() => setPedidoSelecionado({ ...pedidoSelecionado, formaPagamento: opcao })}
                      className={`rounded-xl border p-5 text-sm font-semibold transition-all ${
                        pedidoSelecionado?.formaPagamento === opcao
                          ? "border-orange-500 bg-orange-500/10 text-orange-400"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-orange-500"
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 h-fit">
              <p className="mb-5 text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Resumo</p>
              <div className="space-y-4">
                <div className="rounded-xl bg-zinc-800 p-4">
                  <span className="text-xs text-zinc-500 uppercase">Pedido</span>
                  <p className="text-white font-semibold mt-1">#{pedidoSelecionado?.numPedido}</p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <span className="text-xs text-zinc-500 uppercase">Cliente</span>
                  <p className="text-white font-semibold mt-1">{pedidoSelecionado?.cliente?.nomeRazaoSocial}</p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <span className="text-xs text-zinc-500 uppercase">Total</span>
                  <p className="text-orange-500 text-xl font-bold mt-1">{moeda(pedidoSelecionado?.valorTotal)}</p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <span className="text-xs text-zinc-500 uppercase">Data</span>
                  <p className="text-white mt-1">
                    {new Date(pedidoSelecionado?.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="border-t border-zinc-800 pt-6 bg-zinc-950">
            <AlertDialogCancel className="cursor-pointer border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="!bg-orange-500 hover:!bg-orange-600 px-6 cursor-pointer"
              onClick={salvarEdicaoPedido}
            >
              Salvar Alterações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}