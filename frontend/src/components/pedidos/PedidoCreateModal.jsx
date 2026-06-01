import React, { useState, useMemo, useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { createPedido, createItemPedido } from "@/services/pedidosService";
import { getClientes } from "@/services/clienteService";
import { getProdutos } from "@/services/produtosService";

const MODAL_CLASSES = "bg-card border border-border !w-[96vw] !max-w-[96vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[84vw] xl:!max-w-[84vw] 2xl:!w-[78vw] 2xl:!max-w-[78vw] h-[92vh] overflow-y-auto p-8";
const FORMAS_PAGAMENTO = ["Pix", "Dinheiro", "Cartão Crédito", "Cartão Débito","Boleto","Promissoria"];
const moeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function PedidoCreateModal({ isOpen, onClose, refreshList }) {
  const [passo, setPasso] = useState(1);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [buscaProduto, setBuscaProduto] = useState("");
  const [cliente, setCliente] = useState(null);
  const [itens, setItens] = useState([]);
  const [pagamento, setPagamento] = useState("");
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientesLista, setClientesLista] = useState([]);
  const [produtosLista, setProdutosLista] = useState([]);

  // Busca dados apenas quando abre o modal
  useEffect(() => {
    if (isOpen) {
      resetModal();
      carregarListas();
    }
  }, [isOpen]);

  async function carregarListas() {
    try {
      const [resClientes, resProdutos] = await Promise.all([getClientes(), getProdutos()]);
      const dataClientes = resClientes?.data ?? resClientes;
      const dataProdutos = resProdutos?.data ?? resProdutos;
      setClientesLista(Array.isArray(dataClientes) ? dataClientes : []);
      setProdutosLista(Array.isArray(dataProdutos) ? dataProdutos : []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar listas de clientes e produtos");
    }
  }

  function resetModal() {
    setPasso(1);
    setCliente(null);
    setBuscaCliente("");
    setBuscaProduto("");
    setItens([]);
    setPagamento("");
  }

  const clientesFiltrados = useMemo(() => clientesLista.filter((c) =>
    c.nomeRazaoSocial?.toLowerCase().includes(buscaCliente.toLowerCase()) || c.cpfCnpj?.toLowerCase().includes(buscaCliente.toLowerCase())
  ), [clientesLista, buscaCliente]);

  const produtosFiltrados = useMemo(() => produtosLista.filter((p) =>
    p.descricao?.toLowerCase().includes(buscaProduto.toLowerCase()) || p.marca?.toLowerCase().includes(buscaProduto.toLowerCase())
  ), [produtosLista, buscaProduto]);

  const totalPedido = useMemo(() => itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0), [itens]);

  function adicionarProduto(produto) {
    if (produto.qtdEstoque <= 0) return toast.error("Produto sem estoque");
    const existe = itens.find((item) => item.produtoId === produto.id);
    if (existe) {
      if (existe.quantidade >= existe.estoque) return toast.error("Quantidade máxima em estoque atingida");
      setItens((prev) => prev.map((item) => item.produtoId === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item));
      return;
    }
    setItens((prev) => [...prev, {
      produtoId: produto.id, descricao: produto.descricao, marca: produto.marca,
      estoque: produto.qtdEstoque, quantidade: 1, valorUnitario: Number(produto.precoUnitario)
    }]);
  }

  function alterarQuantidade(produtoId, valor) {
    if (valor <= 0) return setItens((prev) => prev.filter((i) => i.produtoId !== produtoId));
    setItens((prev) => prev.map((item) => (item.produtoId === produtoId && valor <= item.estoque) ? { ...item, quantidade: valor } : item));
  }

  function avancar() {
    if (passo === 1 && !cliente) return toast.error("Selecione um cliente");
    if (passo === 2 && itens.length === 0) return toast.error("Adicione pelo menos 1 produto");
    if (passo < 3) setPasso((prev) => prev + 1);
  }

  function voltar() {
    if (passo === 1) return onClose();
    setPasso((prev) => prev - 1);
  }

  async function confirmarPedido() {
    if (!pagamento) return toast.error("Selecione a forma de pagamento");
    try {
      setLoadingSalvar(true);
      const pedido = await createPedido({ numPedido: Date.now().toString(), formaPagamento: pagamento, clienteId: cliente.id });
      for (let i = 0; i < itens.length; i++) {
        await createItemPedido({
          numItem: i + 1, quantidade: itens[i].quantidade, pedidoId: pedido.id,
          produtoId: itens[i].produtoId, justificativa: "Venda de produto"
        });
      }
      toast.success("Pedido criado com sucesso!");
      refreshList();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Erro ao criar pedido");
    } finally {
      setLoadingSalvar(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className={MODAL_CLASSES}>
        <div className="mb-8 flex items-center justify-between">
          <AlertDialogTitle className="text-3xl font-bold text-foreground">Novo Pedido</AlertDialogTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">X</button>
        </div>

        {/* Indicador de Passos */}
        <div className="mb-10 flex w-full items-center justify-center">
          <div className="flex w-full max-w-3xl items-center justify-between">
            {["Cliente", "Produtos", "Confirmar"].map((label, index) => {
              const n = index + 1;
              const active = passo === n;
              const done = passo > n;
              return (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all ${done ? "bg-green-500 text-foreground" : active ? "bg-orange-500 text-foreground shadow-lg shadow-orange-500/30" : "bg-card text-muted-foreground border border-border"}`}>
                      {done ? "✓" : n}
                    </div>
                    <span className={`text-sm transition-all ${active ? "font-semibold text-orange-400" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                  {index < 2 && <div className={`mx-4 h-[2px] flex-1 rounded-full ${done ? "bg-green-500" : "bg-card"}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* PASSO 1 */}
        {passo === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Buscar cliente</label>
              <input type="text" placeholder="Nome ou CPF/CNPJ..." value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} className="w-full rounded-xl border text-foreground border-border bg-card px-4 py-4 text-sm outline-none focus:border-orange-500" />
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-muted-foreground">Cliente</th>
                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider text-muted-foreground">CPF/CNPJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((c) => (
                      <tr key={c.id} onClick={() => setCliente(c)} className={`cursor-pointer border-t border-border transition-all text-foreground ${cliente?.id === c.id ? "bg-orange-500/10" : ""}`}>
                        <td className="px-4 py-4">{c.nomeRazaoSocial}</td>
                        <td className="px-4 py-4 text-muted-foreground">{c.cpfCnpj}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2 */}
        {passo === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Buscar Produto</label>
              <input type="text" placeholder="Nome do produto..." value={buscaProduto} onChange={(e) => setBuscaProduto(e.target.value)} className="mb-4 w-full rounded-xl border border-border text-foreground bg-card px-4 py-4 text-sm outline-none focus:border-orange-500" />
              <div className="max-h-[400px] overflow-y-auto rounded-xl border border-border">
                {produtosFiltrados.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between text-foreground border-b border-border p-4">
                    <div>
                      <div className="font-medium">{produto.descricao}</div>
                      <div className="text-sm text-muted-foreground">Estoque: {produto.qtdEstoque}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-orange-500">{moeda(produto.precoUnitario)}</div>
                      <button disabled={produto.qtdEstoque <= 0} onClick={() => adicionarProduto(produto)} className="rounded-lg bg-orange-500 px-4 py-2 text-foreground text-sm font-semibold hover:bg-orange-600 disabled:opacity-50">Adicionar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4 text-lg font-semibold text-foreground">Itens do Pedido</div>
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {itens.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Nenhum produto adicionado</div>}
                {itens.map((item) => (
                  <div key={item.produtoId} className="rounded-xl text-foreground border border-border bg-card p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{item.descricao}</div>
                        <div className="text-sm text-muted-foreground">Estoque: {item.estoque}</div>
                      </div>
                      <button onClick={() => setItens((prev) => prev.filter((i) => i.produtoId !== item.produtoId))} className="rounded-lg border border-red-500/40 px-3 py-1 text-red-500">Remover</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => alterarQuantidade(item.produtoId, item.quantidade - 1)} className="h-8 w-8 rounded-lg border border-border">-</button>
                        <span className="w-8 text-center font-bold">{item.quantidade}</span>
                        <button onClick={() => alterarQuantidade(item.produtoId, item.quantidade + 1)} className="h-8 w-8 rounded-lg border border-border">+</button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{moeda(item.valorUnitario)}</div>
                        <div className="font-bold text-orange-500">{moeda(item.quantidade * item.valorUnitario)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PASSO 3 */}
        {passo === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-5 text-xl font-bold text-foreground">Resumo do Pedido</div>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">Cliente</div>
                <div className="font-semibold text-foreground">{cliente?.nomeRazaoSocial}</div>
              </div>
              <div className="space-y-3">
                {itens.map((item) => (
                  <div key={item.produtoId} className="flex justify-between border-b border-border text-foreground pb-3">
                    <div>
                      <div>{item.descricao}</div>
                      <div className="text-sm text-muted-foreground">{item.quantidade} x {moeda(item.valorUnitario)}</div>
                    </div>
                    <div className="font-semibold text-orange-500">{moeda(item.quantidade * item.valorUnitario)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between border-t border-border pt-5 text-xl text-foreground font-bold">
                <span>Total</span>
                <span className="text-orange-500">{moeda(totalPedido)}</span>
              </div>
            </div>

            <div>
              <div className="mb-4 text-xl font-bold text-foreground">Forma de Pagamento</div>
              <div className="grid grid-cols-2 gap-4">
                {FORMAS_PAGAMENTO.map((op) => (
                  <button key={op} onClick={() => setPagamento(op)} className={`rounded-xl border p-5 text-sm font-semibold transition-all ${pagamento === op ? "border-orange-500 bg-orange-500/10 text-orange-500" : "border-border bg-card text-muted-foreground hover:border-orange-500"}`}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rodapé e Botões */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button onClick={voltar} className="rounded-lg border border-border px-5 py-3 text-sm text-muted-foreground transition-all hover:border-orange-500 hover:text-orange-500 cursor-pointer font-semibold">
            {passo === 1 ? "Cancelar" : "Voltar"}
          </button>
          {passo < 3 ? (
            <button onClick={avancar} className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 cursor-pointer">Próximo</button>
          ) : (
            <button onClick={confirmarPedido} disabled={loadingSalvar} className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer">
              {loadingSalvar ? "Salvando..." : "Confirmar Pedido"}
            </button>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}