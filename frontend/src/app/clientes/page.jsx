"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Trash2, FilePenLine, MapPinPlusInside, Contact, Mail, Users, Building2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { getClientes, deleteCliente, createCliente, updateCliente, getClienteById, } from "@/services/clienteService"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"

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
function FormField({ label, placeholder, value, onChange, colSpan }) {
    return (
        <div className={colSpan ? "lg:col-span-" + colSpan : ""}>
            <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-1.5">
                {label}
            </label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
            />
        </div>
    )
}
function FormGrid({
    nomeRazaoSocial,
    setNomeRazaoSocial,
    cpfCnpj,
    setCpfCnpj,
    cnpj,
    setCnpj,
    email,
    setEmail,
    celular1,
    setCelular1,
    celular2,
    setCelular2,
    cep,
    setCep,
    logradouro,
    setLogradouro,
    numImovel,
    setNumImovel,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    municipio,
    setMunicipio,
    uf,
    setUf
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="flex flex-col gap-4">
                <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                    Identificação
                </p>
                <FormField label="Nome do cliente" placeholder="Nome" value={nomeRazaoSocial} onChange={setNomeRazaoSocial} />
                <FormField label="" placeholder="CPF / CNPJ" value={cpfCnpj} onChange={setCpfCnpj} />
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-zinc-300">
                        Tipo de Pessoa
                    </label>
                    <select 
                        value={cnpj === true ? "juridica" : "fisica"}
                        onChange={(e) => {
                            if (e.target.value === "juridica") {
                                setCnpj(true)
                            } else {
                                setCnpj(null)
                            }
                        }}
                        className="bg-zinc-800 border border-zinc-700 text-white rounded-md h-10 px-3"
                    >
                        <option value="fisica">
                            Pessoa Física
                        </option>
                        <option value="juridica">
                            Pessoa Jurídica
                        </option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                    Contato
                </p>
                <FormField label="E-mail" placeholder="email@exemplo.com" value={email} onChange={setEmail} />
                <FormField label="Telefone 1" placeholder="(00) 90000-0000" value={celular1} onChange={setCelular1} />
                <FormField label="Telefone 2" placeholder="(00) 90000-0000" value={celular2} onChange={setCelular2} />
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                    Endereço
                </p>
                <FormField label="CEP" placeholder="00000-000" value={cep} onChange={setCep} />
                <FormField label="Logradouro" placeholder="Rua, Av..." value={logradouro} onChange={setLogradouro} />
                <FormField label="Número" placeholder="Nº" value={numImovel} onChange={setNumImovel} />
                <FormField label="Complemento" placeholder="Apto, Sala..." value={complemento} onChange={setComplemento} />
                <FormField label="Bairro" placeholder="Bairro" value={bairro} onChange={setBairro} />
                <FormField label="Município" placeholder="Município" value={municipio} onChange={setMunicipio} />
                <FormField label="UF" placeholder="UF" value={uf} onChange={setUf} />
            </div>
        </div>
    )
}

const MODAL_CLASSES = "bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[82vw] xl:!max-w-[82vw] 2xl:!w-[75vw] 2xl:!max-w-[75vw] max-h-[92vh] overflow-y-auto p-4 md:p-8"

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

    function exibirMensagem(texto, tipo) {
        setMensagem(texto)
        setTipoMensagem(tipo)
        setTimeout(() => setMensagem(""), 3000)
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

    const clienteData = {
        nomeRazaoSocial, cnpj, cpfCnpj, email,
        logradouro, numImovel, complemento, bairro,
        municipio, uf, cep, celular1, celular2
    }

    function ModalHeader({ titulo, subtitulo, badge }) {
        return (
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                    <Building2 className="text-orange-500" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <AlertDialogTitle className="text-white text-xl font-black truncate">
                        {titulo}
                    </AlertDialogTitle>
                    {subtitulo && (
                        <p className="text-zinc-400 text-sm mt-0.5 truncate">{subtitulo}</p>
                    )}
                </div>
                {badge && (
                    <div className="shrink-0 bg-orange-500/20 px-3 py-1.5 rounded-lg text-orange-500 border border-amber-700 text-sm font-semibold">
                        {badge}
                    </div>
                )}
            </div>
        )
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
                    <Button className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 p-5 rounded-lg font-semibold  shadow-lg shadow-orange-500/20" onClick={async () => {
                        await abrirCriar()
                        setOpenCriar(true)
                    }}>+ Novo Cliente</Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 md:p-8 lg:p-13 justify-center lg:justify-start">
                {clientes.map((cliente) => (
                    <div key={cliente.id}>
                        <Card className="w-full sm:w-[48%] lg:w-80 min-h-[280px] background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 cursor-pointer transition-all duration-300
                         hover:border-orange-500 hover:-translate-y-2 " onClick={async () => {
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
            {/*Modal de criar */}
            <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
                <AlertDialogContent className={MODAL_CLASSES}>
                    <AlertDialogHeader>
                        <ModalHeader titulo="Novo Cliente" />
                    </AlertDialogHeader>
                    <FormGrid
                        nomeRazaoSocial={nomeRazaoSocial}
                        setNomeRazaoSocial={setNomeRazaoSocial}
                        cnpj={cnpj}
                        setCnpj={setCnpj}
                        cpfCnpj={cpfCnpj}
                        setCpfCnpj={setCpfCnpj}
                        email={email}
                        setEmail={setEmail}
                        celular1={celular1}
                        setCelular1={setCelular1}
                        celular2={celular2}
                        setCelular2={setCelular2}
                        cep={cep}
                        setCep={setCep}
                        logradouro={logradouro}
                        setLogradouro={setLogradouro}
                        numImovel={numImovel}
                        setNumImovel={setNumImovel}
                        complemento={complemento}
                        setComplemento={setComplemento}
                        bairro={bairro}
                        setBairro={setBairro}
                        municipio={municipio}
                        setMunicipio={setMunicipio}
                        uf={uf}
                        setUf={setUf}
                    />
                    <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="!bg-green-500 hover:bg-green-600 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await createCliente(clienteData)
                                    await carregarClientes()
                                    exibirMensagem("Cliente criado com sucesso!", "sucesso")
                                    setOpenCriar(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao criar Cliente!", "erro")
                                    console.error(error)
                                }
                            }}
                        >
                            Criar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/*Modal de editar*/}
            <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
                <AlertDialogContent className={MODAL_CLASSES}>
                    <AlertDialogHeader>
                        <ModalHeader
                            titulo="Editar Cliente"
                            subtitulo={clienteSelecionado?.nomeRazaoSocial}
                        />
                    </AlertDialogHeader>
                    <FormGrid
                        nomeRazaoSocial={nomeRazaoSocial}
                        setNomeRazaoSocial={setNomeRazaoSocial}
                        cnpj={cnpj}
                        setCnpj={setCnpj}
                        cpfCnpj={cpfCnpj}
                        setCpfCnpj={setCpfCnpj}
                        email={email}
                        setEmail={setEmail}
                        celular1={celular1}
                        setCelular1={setCelular1}
                        celular2={celular2}
                        setCelular2={setCelular2}
                        cep={cep}
                        setCep={setCep}
                        logradouro={logradouro}
                        setLogradouro={setLogradouro}
                        numImovel={numImovel}
                        setNumImovel={setNumImovel}
                        complemento={complemento}
                        setComplemento={setComplemento}
                        bairro={bairro}
                        setBairro={setBairro}
                        municipio={municipio}
                        setMunicipio={setMunicipio}
                        uf={uf}
                        setUf={setUf}
                    />
                    <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="!bg-amber-500 hover:bg-amber-600 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await updateCliente(clienteSelecionado.id, clienteData)
                                    await carregarClientes()
                                    exibirMensagem("Cliente editado com sucesso!", "sucesso")
                                    setOpenEditar(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao editar Cliente!", "erro")
                                    console.error(error)
                                }
                            }}
                        >
                            Editar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/*Modal de Visualização*/}
            <AlertDialog open={openVer} onOpenChange={setOpenVer}>
                <AlertDialogContent className={MODAL_CLASSES}>
                    <AlertDialogHeader>
                        <ModalHeader
                            titulo={clienteSelecionado?.nomeRazaoSocial}
                            subtitulo={clienteSelecionado?.cnpj ? "Pessoa Juridica" : "Pessoa Fisica"}
                            badge={`${clienteSelecionado?._count?.pedidos || 0} pedidos`}
                        />
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Identificação</p>
                            <InfoBox label={clienteSelecionado?.cnpj ? "CNPJ" : "CPF"} value={clienteSelecionado?.cpfCnpj} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Contato</p>
                            <InfoBox label="E-mail" value={clienteSelecionado?.email} />
                            <InfoBox label="Telefone 1" value={clienteSelecionado?.celular1} />
                            {clienteSelecionado?.celular2 && (
                                <InfoBox label="Telefone 2" value={clienteSelecionado?.celular2} />
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Endereço</p>
                            <InfoBox label="Logradouro" value={clienteSelecionado?.logradouro} />
                            <InfoBox label="Número" value={clienteSelecionado?.numImovel} />
                            <InfoBox label="Complemento" value={clienteSelecionado?.complemento} />
                            <InfoBox label="Bairro" value={clienteSelecionado?.bairro} />
                            <InfoBox label="Município/UF" value={`${clienteSelecionado?.municipio} - ${clienteSelecionado?.uf}`} />
                            <InfoBox label="CEP" value={clienteSelecionado?.cep} />
                        </div>
                    </div>
                    <AlertDialogFooter className="pt-2 border-t border-zinc-700 bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">Fechar</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/*Modal de deletar*/}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Essa ação irá deletar o cliente <strong className="text-white">{clienteSelecionado?.nomeRazaoSocial}</strong> permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await deleteCliente(clienteSelecionado.id)
                                    await carregarClientes()
                                    exibirMensagem("Cliente deletado com sucesso!", "sucesso")
                                    setOpenDelete(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao deletar Cliente!", "erro")
                                    console.error(error)
                                }
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}