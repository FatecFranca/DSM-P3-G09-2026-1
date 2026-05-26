"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getProdutos } from "@/services/produtosService";
import { createMovimentacao } from "@/services/movimentacaoService";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function EntradasPage() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [justificativa, setJustificativa] = useState("");
  const [openConfirmar, setOpenConfirmar] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setProdutos(await getProdutos());
    } catch (error) {
      console.error(error);
    }
  }

  const produtosFiltrados = useMemo(
    () =>
      produtos.filter(
        (p) =>
          p.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
          p.marca?.toLowerCase().includes(busca.toLowerCase())
      ),
    [busca, produtos]
  );

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
  }

  function resetForm() {
    setProdutoSelecionado(null);
    setQuantidade(1);
    setJustificativa("");
    setOpenConfirmar(false);
  }

  async function confirmarEntrada() {
    if (!produtoSelecionado) return mostrarMensagem("Selecione um produto", "erro");
    if (quantidade <= 0) return mostrarMensagem("Quantidade inválida", "erro");

    try {
      setLoading(true);
      await createMovimentacao({
        produtoId: produtoSelecionado.id,
        quantidade,
        justificativa: justificativa || "Entrada manual",
      });
      mostrarMensagem("Entrada registrada com sucesso!");
      resetForm();
      await carregarProdutos();
    } catch (error) {
      console.error(error);
      mostrarMensagem(error?.response?.data?.error || "Erro ao registrar entrada", "erro");
    } finally {
      setLoading(false);
    }
  }

  const moeda = (valor) =>
    Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen text-zinc-100 pl-13 pr-13">
      {mensagem.texto && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-2xl border backdrop-blur-md ${
            mensagem.tipo === "sucesso"
              ? "bg-green-500/90 border-green-400"
              : "bg-red-500/90 border-red-400"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[3px] text-orange-500">
            Estoque
          </span>
          <h1 className="mt-1 text-4xl font-bold">Entradas de Produtos</h1>
        </div>
        <button
          onClick={() => setOpenConfirmar(true)}
          disabled={!produtoSelecionado}
          className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Registrar Entrada
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-zinc-800 bg-[#111114] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#0F0F10]">
              <div>
                <h1 className="text-white text-xl font-bold">Produtos</h1>
                <p className="text-zinc-500 text-sm mt-1">Selecione um produto para entrada</p>
              </div>
            </div>

            <div className="p-5 border-b border-zinc-800">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {produtosFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => setProdutoSelecionado(produto)}
                  className={`flex items-center justify-between border-b border-zinc-800 p-5 cursor-pointer transition-all hover:bg-zinc-900/40 ${
                    produtoSelecionado?.id === produto.id ? "bg-orange-500/10" : ""
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{produto.descricao}</div>
                    <div className="text-sm text-zinc-500 mt-1">{produto.marca}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-500 font-bold">{moeda(produto.precoUnitario)}</div>
                    <div className="text-sm text-zinc-500 mt-1">Estoque: {produto.qtdEstoque}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-xl border border-zinc-800 bg-[#111114] p-6 sticky top-6">
            <h1 className="text-xl font-bold text-white mb-6">Registrar Entrada</h1>

            {!produtoSelecionado ? (
              <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
                Selecione um produto
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Produto</div>
                  <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
                    <div className="font-semibold text-white">{produtoSelecionado.descricao}</div>
                    <div className="text-sm text-zinc-500 mt-1">
                      Estoque atual: {produtoSelecionado.qtdEstoque}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-zinc-500">
                    Justificativa
                  </label>
                  <textarea
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    placeholder="Ex: reposição de estoque..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white outline-none focus:border-orange-500 resize-none h-32"
                  />
                </div>

                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                  <div className="text-sm text-green-400">Estoque após entrada</div>
                  <div className="text-3xl font-bold text-white mt-1">
                    {produtoSelecionado.qtdEstoque + quantidade}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={openConfirmar} onOpenChange={setOpenConfirmar}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-800 !w-[96vw] !max-w-[96vw] md:!w-[80vw] md:!max-w-[80vw] xl:!w-[60vw] xl:!max-w-[60vw] h-auto overflow-y-auto p-8">
          <AlertDialogTitle className="text-2xl font-bold text-white mb-6">
            Confirmar Entrada
          </AlertDialogTitle>

          <div className="space-y-5">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Produto</div>
              <div className="text-white font-semibold mt-2">{produtoSelecionado?.descricao}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-xs uppercase tracking-wider text-zinc-500">Quantidade</div>
              <div className="text-3xl font-bold text-green-400 mt-2">+{quantidade}</div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={() => setOpenConfirmar(false)}
              className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 hover:border-orange-500 hover:text-orange-500"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEntrada}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Confirmar Entrada"}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}