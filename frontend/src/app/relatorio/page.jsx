"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRelatorioPedidosDia } from "@/services/pedidosService";
import { toast } from "sonner";
import { Package, Printer, CalendarDays, TrendingUp, ShoppingBag, Settings2 } from "lucide-react";

const moeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function RelatorioPage() {
    const [isMounted, setIsMounted] = useState(false);

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const [dataGeracao, setDataGeracao] = useState("");
    const [produtos, setProdutos] = useState([]);

    const [resumo, setResumo] = useState({
        quantidadePedidos: 0,
        totalBruto: 0,
        totalCusto: 0,
        totalLucro: 0,
        formasPagamento: {
            Dinheiro: 0,
            Pix: 0,
            "Cartão Crédito": 0,
            "Cartão Débito": 0,
            Boleto: 0,
            Promissoria: 0
        }
    });

    const [loading, setLoading] = useState(false);

    // ESTADO DE CONFIGURAÇÃO
    const [config, setConfig] = useState({
        mostrarCustoELucro: true,
        mostrarResumoPagamentos: true,
        mostrarCabecalhoEmpresa: true
    });

    const toggleConfig = (chave) => {
        setConfig(prev => ({ ...prev, [chave]: !prev[chave] }));
    };
    useEffect(() => {
        setIsMounted(true);

        // Pega a data local correta
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); 
        const dia = String(dataAtual.getDate()).padStart(2, "0");
        const hojeLocal = `${ano}-${mes}-${dia}`;

        setDataInicio(hojeLocal);
        setDataFim(hojeLocal);
        setDataGeracao(dataAtual.toLocaleString("pt-BR"));
    }, []);
    async function gerarRelatorio() {
        if (!dataInicio || !dataFim) return;

        // Validação simples
        if (new Date(dataInicio) > new Date(dataFim)) {
            return toast.error("A data inicial não pode ser maior que a final.");
        }

        try {
            setLoading(true);
            // Passa as duas datas para o Service (Certifique-se de ter ajustado o Service e o Controller no Backend!)
            const resp = await getRelatorioPedidosDia(dataInicio, dataFim);
            setProdutos(resp.produtos || []);
            setResumo(resp.resumo || {
                quantidadePedidos: 0, totalBruto: 0, totalCusto: 0, totalLucro: 0,
                formasPagamento: { Dinheiro: 0, Pix: 0, "Cartão Crédito": 0, "Cartão Débito": 0, Boleto: 0, Promissoria: 0 }
            });
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar dados do relatório");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (isMounted && dataInicio && dataFim) {
            gerarRelatorio();
        }
    }, [dataInicio, dataFim, isMounted]);

    if (!isMounted) {
        return null;
    }
    const formatarData = (dataString) => {
        if (!dataString) return "";
        return new Date(dataString + "T00:00:00").toLocaleDateString("pt-BR");
    };

    return (
        <div className="flex flex-col w-full pb-10 print:p-0 print:bg-white text-muted-foreground print:text-black">

            {/* CONTROLES DE FILTRO E CONFIGURAÇÃO (Escondidos no PDF) */}
            <div className="print:hidden flex flex-col px-4 md:px-8 lg:px-13 mb-8">
                <span className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Resultados</span>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pt-3 mb-6">
                    <h1 className="text-foreground text-3xl font-black">Fechamento de Caixa</h1>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-semibold text-muted-foreground">De:</span>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="pl-10 bg-card border-border text-foreground font-semibold w-full"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-semibold text-muted-foreground">Até:</span>
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className="pl-10 bg-card border-border text-foreground font-semibold w-full"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={() => window.print()}
                            disabled={loading || produtos.length === 0}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 cursor-pointer shadow-lg shadow-orange-500/10 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimir PDF
                        </Button>
                    </div>
                </div>

                {/* PAINEL DE CONTROLE DE IMPRESSÃO */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-2 text-foreground font-bold">
                        <Settings2 className="w-5 h-5 text-orange-500" />
                        Opções do Relatório:
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={config.mostrarCustoELucro}
                                onChange={() => toggleConfig('mostrarCustoELucro')}
                                className="accent-orange-500 w-4 h-4"
                            />
                            Mostrar Custos e Lucro
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={config.mostrarResumoPagamentos}
                                onChange={() => toggleConfig('mostrarResumoPagamentos')}
                                className="accent-orange-500 w-4 h-4"
                            />
                            Mostrar Fechamento por Pagamento
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={config.mostrarCabecalhoEmpresa}
                                onChange={() => toggleConfig('mostrarCabecalhoEmpresa')}
                                className="accent-orange-500 w-4 h-4"
                            />
                            Mostrar Cabeçalho Corporativo
                        </label>
                    </div>
                </div>
            </div>

            {/* DOCUMENTO DO RELATÓRIO (Área Visual e Impressa) */}
            <div className="px-4 md:px-8 lg:px-13 print:px-0">

                {/* CABEÇALHO CONDICIONAL */}
                {config.mostrarCabecalhoEmpresa && (
                    <div className="flex justify-between items-center mb-8 border-b border-border print:border-zinc-300 pb-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-3xl font-black text-foreground print:text-black tracking-tight">
                                    Estokai<span className="text-orange-500">.</span>
                                </div>
                                <p className="text-xs uppercase tracking-[2px] text-muted-foreground print:text-zinc-500 mt-0.5">Controle de Estoque Inteligente</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-bold text-foreground print:text-black uppercase tracking-wider">Fechamento de Caixa</h2>
                            <p className="text-sm text-muted-foreground print:text-zinc-600 mt-1">
                                Período: {formatarData(dataInicio)} a {formatarData(dataFim)}
                            </p>
                        </div>
                    </div>
                )}

                {/* PAINEL CONDICIONAL DE INDICADORES RÁPIDOS */}
                <div className={`grid gap-6 mb-8 print-avoid-break ${config.mostrarCustoELucro ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-1'}`}>
                    <Card className="bg-card border-border p-5 shadow-sm print:shadow-none print:border-zinc-300 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 print:hidden">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground print:text-zinc-500">Valor Total Bruto</p>
                            <p className="text-2xl font-black text-foreground print:text-black mt-0.5">{moeda(resumo.totalBruto)}</p>
                        </div>
                    </Card>

                    {config.mostrarCustoELucro && (
                        <>
                            <Card className="bg-card border-border p-5 shadow-sm print:shadow-none print:border-zinc-300 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-500/10 flex items-center justify-center shrink-0 print:hidden">
                                    <Package className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground print:text-zinc-500">Valor Total Custo</p>
                                    <p className="text-2xl font-black text-foreground print:text-black mt-0.5">{moeda(resumo.totalCusto)}</p>
                                </div>
                            </Card>

                            <Card className="bg-card border-border p-5 shadow-sm print:shadow-none print:border-zinc-300 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 print:hidden">
                                    <ShoppingBag className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground print:text-zinc-500">Lucro Líquido Total</p>
                                    <p className="text-2xl font-black text-green-500 print:text-green-700 mt-0.5">{moeda(resumo.totalLucro)}</p>
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                {/* TABELA DE PRODUTOS CONDICIONAL */}
                <div className="print-avoid-break mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground print:text-black border-l-4 border-orange-500 pl-2">
                        Produtos Vendidos no Período
                    </h3>
                </div>
                <Card className="border-border bg-card shadow-sm print:shadow-none print:border-zinc-300 overflow-hidden mb-8">
                    <Table>
                        <TableHeader className="bg-card print:bg-zinc-100 border-b border-border print:border-zinc-300">
                            <TableRow>
                                <TableHead className="font-bold print:text-black pl-5">Produto / Marca</TableHead>
                                <TableHead className="font-bold print:text-black text-center">Qtd</TableHead>
                                {config.mostrarCustoELucro && <TableHead className="font-bold print:text-black text-right">Preço Custo</TableHead>}
                                <TableHead className="font-bold print:text-black text-right">Preço Venda</TableHead>
                                <TableHead className="font-bold print:text-black text-right">Total Venda</TableHead>
                                <TableHead className="font-bold print:text-black text-center pr-5">Forma Pagamento</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={config.mostrarCustoELucro ? 6 : 5} className="text-center py-10">Carregando relatório...</TableCell></TableRow>
                            ) : produtos.length === 0 ? (
                                <TableRow><TableCell colSpan={config.mostrarCustoELucro ? 6 : 5} className="text-center py-10">Nenhuma venda concluída no período.</TableCell></TableRow>
                            ) : (
                                produtos.map((p) => (
                                    <TableRow key={p.id} className="border-b border-border print:border-zinc-200 print-avoid-break">
                                        <TableCell className="pl-5">
                                            <div className="font-semibold text-foreground print:text-black text-sm">{p.descricao}</div>
                                            <div className="text-xs text-muted-foreground print:text-zinc-500 mt-0.5">{p.marca}</div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium print:text-black">{p.quantidade}</TableCell>

                                        {config.mostrarCustoELucro && (
                                            <TableCell className="text-right print:text-black">{moeda(p.precoCusto)}</TableCell>
                                        )}

                                        <TableCell className="text-right print:text-black">{moeda(p.precoVenda)}</TableCell>
                                        <TableCell className="text-right font-bold text-foreground print:text-black">{moeda(p.totalVenda)}</TableCell>
                                        <TableCell className="text-center pr-5">
                                            <span className="px-2.5 py-1 rounded bg-zinc-100 print:bg-transparent border border-zinc-300 text-xs font-semibold text-zinc-700 print:text-black">
                                                {p.formaPagamento}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
                <div className="mt-12 print:mt-0 print:break-before-page print:pt-12">

                    {/* Cabeçalho exclusivo para a folha de totais */}
                    <div className="hidden print:block text-center mb-10 border-b border-zinc-300 pb-6">
                        <h2 className="text-2xl font-black text-black tracking-widest uppercase">Resumo Financeiro do Caixa</h2>
                        <p className="text-zinc-600 mt-2">
                            Totalização do período de {formatarData(dataInicio)} a {formatarData(dataFim)}
                        </p>
                    </div>

                    <div className={`grid gap-6 md:gap-8 ${config.mostrarResumoPagamentos ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>

                        {/* Bloco da Esquerda: Divisão por Forma de Pagamento */}
                        {config.mostrarResumoPagamentos && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground print:text-black mb-4 border-l-4 border-orange-500 pl-3">
                                    Faturamento por Pagamento
                                </h3>
                                <Card className="border-border bg-card p-6 space-y-4 shadow-sm print:shadow-none print:border-zinc-300 print:bg-zinc-50/50">
                                    {Object.entries(resumo.formasPagamento).map(([forma, valor]) => (
                                        <div key={forma} className="flex justify-between items-center text-base pb-3 border-b border-dashed border-border print:border-zinc-300 last:border-0 last:pb-0">
                                            <span className="print:text-zinc-700">{forma}</span>
                                            <span className="font-bold text-foreground print:text-black">{moeda(valor)}</span>
                                        </div>
                                    ))}
                                </Card>
                            </div>
                        )}

                        {/* Bloco da Direita: Balanço Geral */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground print:text-black mb-4 border-l-4 border-orange-500 pl-3">
                                Balanço Geral
                            </h3>
                            <Card className="border-border bg-card p-6 space-y-4 shadow-sm print:shadow-none print:border-zinc-300 print:bg-zinc-50/50">
                                {config.mostrarCustoELucro && (
                                    <>
                                        <div className="flex justify-between items-center text-base pb-3 border-b border-dashed border-border print:border-zinc-300">
                                            <span className="print:text-zinc-700">Valor Total de Custo</span>
                                            <span className="font-semibold print:text-black">{moeda(resumo.totalCusto)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-base pb-3 border-b border-dashed border-border print:border-zinc-300">
                                            <span className="print:text-zinc-700">Lucro Líquido</span>
                                            <span className="font-bold text-green-500 print:text-green-700">{moeda(resumo.totalLucro)}</span>
                                        </div>
                                    </>
                                )}
                                <div className={`flex justify-between items-center ${config.mostrarCustoELucro ? 'pt-2' : ''}`}>
                                    <span className="text-lg font-black text-foreground print:text-black uppercase">Valor Total Bruto</span>
                                    <span className="text-2xl font-black text-orange-500 print:text-black">{moeda(resumo.totalBruto)}</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Rodapé institucional padrão */}
                <div className="hidden print:block text-center mt-auto pt-8 border-t border-zinc-200 text-xs text-zinc-400">
                    Documento Oficial Gerado em {dataGeracao} • Sistema de Gestão Estokai
                </div>
            </div>
        </div>
    );
}