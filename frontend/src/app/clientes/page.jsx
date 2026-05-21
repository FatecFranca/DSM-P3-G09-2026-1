"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Trash2, FilePenLine, MapPinPlusInside, Contact, Mail, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { getClientes, deleteCliente, createCliente, updateCliente, getClienteById, } from "@/services/clienteService"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"

export default function ClientesPage() {

    const [clientes, setClientes] = useState([])
    const [openEditar, setOpenEditar] = useState(false)
    const [openCriar, setOpenCriar] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
     const [openVer, setOpenVer] = useState(false)
    const [cnpj, setCnpj] = useState(false)
    const [nomeRazaoSocial, setNomeRazaoSocial] = useState("")
    const [cpfCnpj, setCpfCnpj] = useState("")
    const [email, setEmail] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [numImovel, setNumImovel] = useState("")
    const [complemento, setComplemento] = useState("")
    const [bairro, setBairro] = useState("")
    const [municipio, setMunicipio] = useState("")
    const [uf, setUf] = useState("")
    const [cep, setCep] = useState("")
    const [celular1, setCelular1] = useState("")
    const [celular2, setCelular2] = useState("")
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")


    async function carregarClientes() {
        try {
            const data = await getClientes()
            setClientes(data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        carregarClientes()
    }, [])

    async function abrirEditar(id) {
        try {
            const cliente = await getClienteById(id)
            setClienteSelecionado(cliente)
            setCnpj(cliente.cnpj || false)
            setNomeRazaoSocial(cliente.nomeRazaoSocial || "")
            setCpfCnpj(cliente.cpfCnpj || "")
            setEmail(cliente.email || "")
            setLogradouro(cliente.logradouro || "")
            setNumImovel(cliente.numImovel || "")
            setComplemento(cliente.complemento || "")
            setBairro(cliente.bairro || "")
            setMunicipio(cliente.municipio || "")
            setUf(cliente.uf || "")
            setCep(cliente.cep || "")
            setCelular1(cliente.celular1 || "")
            setCelular2(cliente.celular2 || "")
        } catch (error) {
            console.error(error)
        }
    }

    async function abrirCriar() {
        setClienteSelecionado(null)
        setCnpj(false)
        setNomeRazaoSocial("")
        setCpfCnpj("")
        setEmail("")
        setLogradouro("")
        setNumImovel("")
        setComplemento("")
        setBairro("")
        setMunicipio("")
        setUf("")
        setCep("")
        setCelular1("")
        setCelular2("")
    }

    async function abrirDelete(id) {
        try {
            const cliente = await getClienteById(id)
            setClienteSelecionado(cliente)
        } catch (error) {
            console.error(error)
        }
    }

    async function abrirVer(id) {
        try {

            const cliente = await getClienteById(id)

            setClienteSelecionado(cliente)

        } catch (error) {
            console.error(error)
        }
    }


    return (



        <div className="flex flex-col ">

            {mensagem && (
                <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300
           ${tipoMensagem === "sucesso" ? "bg-green-500" : "bg-red-500"}`}>
                    {mensagem}
                </div>
            )}

            <div className="flex flex-col pl-13">
                <div>
                    <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">cadastro</h3>
                </div>
                <div className="flex flex-wrap pr-13 pt-3 justify-between">
                    <h1 className="text-white text-3xl font-black">CLIENTES</h1>
                    <Button className="p-5 cursor-pointer bg-orange-500" onClick={async () => {
                        await abrirCriar()
                        setOpenCriar(true)
                    }}>+ Novo Cliente</Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 md:p-8 lg:p-13 justify-center lg:justify-start">
                {clientes.map((cliente) => (
                    <div key={cliente.id}>
                        <Card className="w-full sm:w-[48%] lg:w-80 min-h-[280px] background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 cursor-pointer transition-all duration-300 hover:border-orange-500 hover:-translate-y-2 " onClick={async () => {
                            await abrirVer(cliente.id)
                            setOpenVer(true)
                        }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex justify-between items-center gap-4 ">

                                    <div className="bg-orange-500/20 p-2 rounded-lg">
                                        <Users className="text-orange-500" size={20}></Users>
                                    </div >
                                    <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500 border-amber-700 border">
                                        {cliente._count.pedidos} pedidos
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <h1 className="text-xl font-black text-white break-words">
                                    {cliente.nomeRazaoSocial}
                                </h1>
                                <h3 className="border-b border-zinc-700 pb-2 break-words">
                                    {cliente.cpfCnpj}
                                </h3>
                                <h3 className="break-words flex items-center gap-2">
                                    <Mail size={14} className="text-orange-500 shrink-0" />
                                    {cliente.email}
                                </h3>

                                <h3 className="flex items-center gap-2">
                                    <Contact size={14} className="text-orange-500 shrink-0" />
                                    {cliente.celular1}
                                </h3>

                                <h3 className="flex items-center gap-2">
                                    <MapPinPlusInside size={14} className="text-orange-500 shrink-0" />
                                    {cliente.municipio} - {cliente.uf}
                                </h3>
                            </CardContent>
                            <CardFooter className="gap-3 flex justify-end flex-wrap background-main">
                                <Button variant="outline" className="flex-1 min-w-[120px] background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group" onClick={async (e) => {
                                    e.stopPropagation()
                                    await abrirEditar(cliente.id)
                                    setOpenEditar(true)
                                }}>
                                    <FilePenLine className="group hover:border-orange-500 hover:text-orange-500 group-hover:text-orange-500"></FilePenLine>
                                </Button>
                                <Button variant="outline" className="w-12 background-sidebar cursor-pointer border-red-500 text-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800" onClick={async (e) => {
                                    e.stopPropagation()
                                    await abrirDelete(cliente.id)
                                    setOpenDelete(true)
                                }}>
                                    <Trash2 className="text-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800"></Trash2>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                ))}


            </div>
            <div>
            </div>

            <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Novo Cliente
                        </AlertDialogTitle>

                        <div className="text-zinc-400">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                <select
                                    onChange={(e) => {
                                        if (e.target.value === "cnpj") {
                                            setCnpj(true)
                                        } else {
                                            setCnpj(false)
                                        }
                                    }}

                                    className="bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3">
                                    <option value="cpf">
                                        CPF
                                    </option>
                                    <option value="cnpj">
                                        CNPJ
                                    </option>
                                </select>

                                <Input
                                    placeholder={cnpj ? "Digite o CNPJ" : "Digite o CPF"}
                                    value={cpfCnpj}
                                    onChange={(e) => setCpfCnpj(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Nome / Razão Social"
                                    value={nomeRazaoSocial}
                                    onChange={(e) => setNomeRazaoSocial(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />

                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Celular 1"
                                    value={celular1}
                                    onChange={(e) => setCelular1(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Celular 2"
                                    value={celular2}
                                    onChange={(e) => setCelular2(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="CEP"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Logradouro"
                                    value={logradouro}
                                    onChange={(e) => setLogradouro(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />

                                <Input
                                    placeholder="Número"
                                    value={numImovel}
                                    onChange={(e) => setNumImovel(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Complemento"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Município"
                                    value={municipio}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="UF"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                            </div>

                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="bg-zinc-900 border-zinc-700">

                        <AlertDialogCancel className="cursor-pointer">
                            Cancelar
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="!bg-green-500 hover:bg-green-600 cursor-pointer"
                            onClick={async () => {

                                try {

                                    const clienteData = {
                                        cnpj,
                                        nomeRazaoSocial,
                                        cpfCnpj,
                                        email,
                                        logradouro,
                                        numImovel,
                                        complemento,
                                        bairro,
                                        municipio,
                                        uf,
                                        cep,
                                        celular1,
                                        celular2
                                    }

                                    await createCliente(clienteData)

                                    await carregarClientes()

                                    setMensagem("Cliente criado com sucesso!")
                                    setTipoMensagem("sucesso")

                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)

                                    setOpenCriar(false)

                                } catch (error) {

                                    setMensagem("Erro ao criar cliente!")
                                    setTipoMensagem("erro")

                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)

                                    console.error(error)
                                }
                            }}
                        >
                            Criar
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700  w-[95%] max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Tem certeza?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400 bg-zinc-900 border-zinc-700">
                            Essa acao ira deletar o cliente permanente
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-zinc-900 border-zinc-700">
                        <AlertDialogCancel className="cursor-pointer">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={async () => {
                            try {
                                await deleteCliente(clienteSelecionado.id)
                                await carregarClientes()
                                setMensagem("cliente deletado com sucesso!")
                                setTipoMensagem("sucesso")
                                setTimeout(() => {
                                    setMensagem("")
                                }, 3000)
                                setOpenDelete(false)
                            } catch (error) {
                                setMensagem("Erro ao deletar cliente!")
                                setTipoMensagem("erro")
                                setTimeout(() => {
                                    setMensagem("")
                                }, 3000)
                                console.error(error)
                            }
                        }}>
                            confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Editar Cliente
                        </AlertDialogTitle>

                        <div className="text-zinc-400">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                <select
                                    onChange={(e) => {

                                        if (e.target.value === "cnpj") {
                                            setCnpj(true)
                                        } else {
                                            setCnpj(false)
                                        }
                                    }}

                                    className="bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3">
                                    <option value="cpf">
                                        CPF
                                    </option>
                                    <option value="cnpj">
                                        CNPJ
                                    </option>
                                </select>

                                <Input
                                    placeholder={cnpj ? "Digite o CNPJ" : "Digite o CPF"}
                                    value={cpfCnpj}
                                    onChange={(e) => setCpfCnpj(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Nome / Razão Social"
                                    value={nomeRazaoSocial}
                                    onChange={(e) => setNomeRazaoSocial(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />

                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Celular 1"
                                    value={celular1}
                                    onChange={(e) => setCelular1(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Celular 2"
                                    value={celular2}
                                    onChange={(e) => setCelular2(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="CEP"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Logradouro"
                                    value={logradouro}
                                    onChange={(e) => setLogradouro(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />

                                <Input
                                    placeholder="Número"
                                    value={numImovel}
                                    onChange={(e) => setNumImovel(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Complemento"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="Município"
                                    value={municipio}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                                <Input
                                    placeholder="UF"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />

                            </div>

                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="bg-zinc-900 border-zinc-700">

                        <AlertDialogCancel className="cursor-pointer">
                            Cancelar
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="!bg-amber-500 hover:bg-amber-600 cursor-pointer"
                            onClick={async () => {

                                try {

                                    const clienteData = {
                                        cnpj,
                                        nomeRazaoSocial,
                                        cpfCnpj,
                                        email,
                                        logradouro,
                                        numImovel,
                                        complemento,
                                        bairro,
                                        municipio,
                                        uf,
                                        cep,
                                        celular1,
                                        celular2
                                    }

                                    await updateCliente(clienteSelecionado.id, clienteData)

                                    await carregarClientes()

                                    setMensagem("Cliente editado com sucesso!")
                                    setTipoMensagem("sucesso")

                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)

                                    setOpenCriar(false)

                                } catch (error) {

                                    setMensagem("Erro ao editar cliente!")
                                    setTipoMensagem("erro")

                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)

                                    console.error(error)
                                }
                            }}
                        >
                            Editar
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={openVer} onOpenChange={setOpenVer}>
                <AlertDialogContent
                    className="
      bg-zinc-900 border-zinc-700
      !w-[98vw]      !max-w-[98vw]
      md:!w-[92vw]   md:!max-w-[92vw]
      lg:!w-[88vw]   lg:!max-w-[88vw]
      xl:!w-[82vw]   xl:!max-w-[82vw]
      2xl:!w-[75vw]  2xl:!max-w-[75vw]
      max-h-[92vh] overflow-y-auto
      p-4 md:p-8
    "
                >
                    <AlertDialogHeader>

                        {/* Cabeçalho */}
                        <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
                            <div className="bg-orange-500/20 p-3 rounded-xl">
                                <Users className="text-orange-500" size={24} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <AlertDialogTitle className="text-white text-xl font-black truncate">
                                    {clienteSelecionado?.nomeRazaoSocial}
                                </AlertDialogTitle>
                                <p className="text-zinc-400 text-sm mt-0.5">
                                    {clienteSelecionado?.cnpj ? "Pessoa Jurídica" : "Pessoa Física"}
                                </p>
                            </div>

                            <div className="shrink-0 bg-orange-500/20 px-3 py-1.5 rounded-lg text-orange-500 border border-amber-700 text-sm font-semibold">
                                {clienteSelecionado?._count?.pedidos || 0} pedidos
                            </div>
                        </div>

                    </AlertDialogHeader>

                    {/* Corpo em 3 colunas no desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">

                        {/* ── IDENTIFICAÇÃO ─────────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Identificação
                            </p>

                            <InfoBox
                                label={clienteSelecionado?.cnpj ? "CNPJ" : "CPF"}
                                value={clienteSelecionado?.cpfCnpj}
                            />
                            <InfoBox
                                label="Tipo"
                                value={clienteSelecionado?.cnpj ? "Pessoa Jurídica" : "Pessoa Física"}
                            />
                        </div>

                        {/* ── CONTATO ───────────────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Contato
                            </p>

                            <InfoBox label="E-mail" value={clienteSelecionado?.email} />
                            <InfoBox label="Celular 1" value={clienteSelecionado?.celular1} />
                            {clienteSelecionado?.celular2 && (
                                <InfoBox label="Celular 2" value={clienteSelecionado?.celular2} />
                            )}
                        </div>

                        {/* ── ENDEREÇO ──────────────────────────────────────── */}
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Endereço
                            </p>

                            <InfoBox label="Logradouro" value={clienteSelecionado?.logradouro} />
                            <InfoBox label="Número" value={clienteSelecionado?.numImovel} />
                            <InfoBox label="Complemento" value={clienteSelecionado?.complemento || "Não informado"} />
                            <InfoBox label="Bairro" value={clienteSelecionado?.bairro} />
                            <InfoBox label="Município/UF" value={`${clienteSelecionado?.municipio} - ${clienteSelecionado?.uf}`} />
                            <InfoBox label="CEP" value={clienteSelecionado?.cep} />
                        </div>

                    </div>

                    <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">
                            Fechar
                        </AlertDialogCancel>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
    function InfoBox({ label, value }) {
        return (
            <div className="bg-zinc-800 rounded-lg px-4 py-3">
                <span className="text-zinc-500 text-xs uppercase tracking-wider">
                    {label}
                </span>
                <p className="text-white mt-1 break-words text-sm">
                    {value || <span className="text-zinc-600 italic">Não informado</span>}
                </p>
            </div>
        )
    }
}