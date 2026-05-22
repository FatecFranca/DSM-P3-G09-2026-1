"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input";
import { getFornecedores, deleteFornecedor, createFornecedor, updateFornecedor, getFornecedorById, } from "@/services/fornecedoresService"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react";
import { Trash2, FilePenLine, MapPinPlusInside, Contact, Mail, Building2, ChartBarStacked } from 'lucide-react';

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

export default function FornecedoresPage() {

    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null)
    const [fornecedores, setFornecedores] = useState([])
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const [openEditar, setOpenEditar] = useState(false)
    const [openCriar, setOpenCriar] = useState(false)
    const [openVer, setOpenVer] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [razaoSocial, setRazaoSocial] = useState("")
    const [nomeFantasia, setNomeFantasia] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [email, setEmail] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [numImovel, setNumImovel] = useState("")
    const [complemento, setComplemento] = useState("")
    const [bairro, setBairro] = useState("")
    const [municipio, setMunicipio] = useState("")
    const [uf, setUf] = useState("")
    const [cep, setCep] = useState("")
    const [telefone1, setTelefone1] = useState("")
    const [telefone2, setTelefone2] = useState("")
    const [categoria, setCategoria] = useState("")

    async function carregarFornecedores() {
        try {
            const data = await getFornecedores()
            setFornecedores(data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        carregarFornecedores()
    }, [])

    async function abrirEditar(id) {
        try {
            const fornecedor = await getFornecedorById(id)
            setFornecedorSelecionado(fornecedor)
            setRazaoSocial(fornecedor.razaoSocial || "")
            setNomeFantasia(fornecedor.nomeFantasia || "")
            setCnpj(fornecedor.cnpj || "")
            setEmail(fornecedor.email || "")
            setLogradouro(fornecedor.logradouro || "")
            setNumImovel(fornecedor.numImovel || "")
            setComplemento(fornecedor.complemento || "")
            setBairro(fornecedor.bairro || "")
            setMunicipio(fornecedor.municipio || "")
            setUf(fornecedor.uf || "")
            setCep(fornecedor.cep || "")
            setTelefone1(fornecedor.telefone1 || "")
            setTelefone2(fornecedor.telefone2 || "")
            setCategoria(fornecedor.categoria || "")
        } catch (error) {
            console.error(error)
        }
    }

    async function abrirCriar() {
        setFornecedorSelecionado(null)
        setRazaoSocial("")
        setNomeFantasia("")
        setCnpj("")
        setEmail("")
        setLogradouro("")
        setNumImovel("")
        setComplemento("")
        setBairro("")
        setMunicipio("")
        setUf("")
        setCep("")
        setTelefone1("")
        setTelefone2("")
        setCategoria("")
    }

    async function abrirDelete(id) {
        try {
            const fornecedor = await getFornecedorById(id)
            setFornecedorSelecionado(fornecedor)
        } catch (error) {
            console.error(error)
        }
    }

    async function abrirVer(id) {
        try {
            const fornecedor = await getFornecedorById(id)
            setFornecedorSelecionado(fornecedor)
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
                <div className="flex flex-wrap pt-3 pr-13 justify-between">
                    <h1 className="text-white text-3xl  font-black">FORNECEDORES</h1>
                    <Button className="p-5 cursor-pointer bg-orange-500" onClick={async () => {
                        await abrirCriar()
                        setOpenCriar(true)
                    }}
                    >+ Novo Fornecedor</Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 md:p-8 lg:p-13 justify-center lg:justify-start">
                {fornecedores.map((fornecedor) => (
                    <div
                        key={fornecedor.id}
                        className="w-full sm:w-[48%] lg:w-80"
                    >
                        <Card className="min-h-[320px] background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 cursor-pointer transition-all duration-300 hover:border-orange-500 hover:-translate-y-2" onClick={async () => {
                            await abrirVer(fornecedor.id)
                            setOpenVer(true)
                        }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex justify-between items-center gap-4">
                                    <div className="bg-orange-500/20 p-2 rounded-lg">
                                        <Building2 className="text-orange-500" size={20} />
                                    </div>
                                    <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500 border border-amber-700">
                                        {fornecedor._count?.produtos || 0} produtos
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <h1 className="text-xl font-black text-white break-words">
                                    {fornecedor.nomeFantasia}
                                </h1>
                                <h3 className="border-b border-zinc-700 pb-2 break-words">
                                    {fornecedor.cnpj}
                                </h3>
                                <h3 className="break-words flex items-center gap-2">
                                    <Mail size={14} className="text-orange-500 shrink-0" />
                                    {fornecedor.email}
                                </h3>
                                <h3 className="flex items-center gap-2">
                                    <Contact size={14} className="text-orange-500 shrink-0" />
                                    {fornecedor.telefone1}
                                </h3>
                                <h3 className="flex items-center gap-2">
                                    <MapPinPlusInside size={14} className="text-orange-500 shrink-0" />
                                    {fornecedor.municipio} - {fornecedor.uf}
                                </h3>
                                <h3 className="flex items-center gap-2">
                                    <ChartBarStacked size={14} className="text-orange-500 shrink-0" />
                                    {fornecedor.categoria}
                                </h3>
                            </CardContent>
                            <CardFooter className="gap-3 flex justify-end flex-wrap background-main">
                                <Button
                                    variant="outline"
                                    className="flex-1 min-w-[120px] background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group" onClick={async (e) => {
                                        e.stopPropagation()
                                        await abrirEditar(fornecedor.id)
                                        setOpenEditar(true)
                                    }}
                                ><FilePenLine className="group-hover:border-orange-500 group-hover:text-orange-500"></FilePenLine>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-12 background-sidebar cursor-pointer border-red-500 text-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800" onClick={async (e) => {
                                        e.stopPropagation()
                                        await abrirDelete(fornecedor.id)
                                        setOpenDelete(true)
                                    }}
                                ><Trash2 className="text-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800"></Trash2>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>
            <div>
            </div>
            {/*Modal do criar */}
            <AlertDialog open={openCriar} onOpenChange={setOpenCriar}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Novo Fornecedor
                        </AlertDialogTitle>
                        <div className="text-zinc-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Input
                                    placeholder="Razão Social"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />
                                <Input
                                    placeholder="Nome Fantasia"
                                    value={nomeFantasia}
                                    onChange={(e) => setNomeFantasia(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />
                                <Input
                                    placeholder="CNPJ"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Categoria"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Telefone 1"
                                    value={telefone1}
                                    onChange={(e) => setTelefone1(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Telefone 2"
                                    value={telefone2}
                                    onChange={(e) => setTelefone2(e.target.value)}
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
                                    const fornecedorData = {
                                        razaoSocial,
                                        nomeFantasia,
                                        cnpj,
                                        email,
                                        logradouro,
                                        numImovel,
                                        complemento,
                                        bairro,
                                        municipio,
                                        uf,
                                        cep,
                                        telefone1,
                                        telefone2,
                                        categoria
                                    }
                                    await createFornecedor(fornecedorData)
                                    await carregarFornecedores()
                                    setMensagem("Fornecedor criado com sucesso!")
                                    setTipoMensagem("sucesso")
                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)
                                    setOpenCriar(false)
                                } catch (error) {
                                    setMensagem("Erro ao criar fornecedor!")
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
            {/*Modal de editar*/}
            <AlertDialog open={openEditar} onOpenChange={setOpenEditar}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Editar Fornecedor
                        </AlertDialogTitle>
                        <div className="text-zinc-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Input
                                    placeholder="Razão Social"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />
                                <Input
                                    placeholder="Nome Fantasia"
                                    value={nomeFantasia}
                                    onChange={(e) => setNomeFantasia(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white md:col-span-2"
                                />
                                <Input
                                    placeholder="CNPJ"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Categoria"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Telefone 1"
                                    value={telefone1}
                                    onChange={(e) => setTelefone1(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                />
                                <Input
                                    placeholder="Telefone 2"
                                    value={telefone2}
                                    onChange={(e) => setTelefone2(e.target.value)}
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
                                    const fornecedorData = {
                                        razaoSocial,
                                        nomeFantasia,
                                        cnpj,
                                        email,
                                        logradouro,
                                        numImovel,
                                        complemento,
                                        bairro,
                                        municipio,
                                        uf,
                                        cep,
                                        telefone1,
                                        telefone2,
                                        categoria
                                    }
                                    await updateFornecedor(fornecedorSelecionado.id, fornecedorData)
                                    await carregarFornecedores()
                                    setMensagem("Fornecedor editado com sucesso!")
                                    setTipoMensagem("sucesso")
                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)
                                    setOpenEditar(false)
                                } catch (error) {
                                    setMensagem("Erro ao editar fornecedor!")
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
            {/*Modal de deletar*/}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 w-[95%] max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Tem certeza?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Essa ação irá deletar o fornecedor permanentemente
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await deleteFornecedor(fornecedorSelecionado.id)
                                    await carregarFornecedores()
                                    setMensagem("Fornecedor deletado com sucesso!")
                                    setTipoMensagem("sucesso")
                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)
                                    setOpenDelete(false)
                                } catch (error) {
                                    setMensagem("Erro ao deletar fornecedor!")
                                    setTipoMensagem("erro")
                                    setTimeout(() => {
                                        setMensagem("")
                                    }, 3000)
                                    console.error(error)
                                }
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/*Modal de visualização*/}
            <AlertDialog open={openVer} onOpenChange={setOpenVer}>
                <AlertDialogContent
                    className="bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[82vw] xl:!max-w-[82vw] 2xl:!w-[75vw]
                     2xl:!max-w-[75vw] max-h-[92vh] overflow-y-auto p-4 md:p-8">
                    <AlertDialogHeader>
                        <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-700">
                            <div className="bg-orange-500/20 p-3 rounded-xl">
                                <Building2 className="text-orange-500" size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <AlertDialogTitle className="text-white text-xl font-black truncate">
                                    {fornecedorSelecionado?.nomeFantasia}
                                </AlertDialogTitle>
                                <p className="text-zinc-400 text-sm mt-0.5 truncate">
                                    {fornecedorSelecionado?.razaoSocial}
                                </p>
                            </div>
                            <div className="shrink-0 bg-orange-500/20 px-3 py-1.5 rounded-lg text-orange-500 border border-amber-700 text-sm font-semibold">
                                  {fornecedorSelecionado?._count?.produtos || 0} produtos
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Identificação
                            </p>
                            <InfoBox label="CNPJ" value={fornecedorSelecionado?.cnpj} />
                            <InfoBox label="Categoria" value={fornecedorSelecionado?.categoria} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Contato
                            </p>
                            <InfoBox label="E-mail" value={fornecedorSelecionado?.email} />
                            <InfoBox label="Telefone 1" value={fornecedorSelecionado?.telefone1} />
                            {fornecedorSelecionado?.telefone2 && (
                                <InfoBox label="Telefone 2" value={fornecedorSelecionado?.telefone2} />
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                                Endereço
                            </p>
                            <InfoBox label="Logradouro" value={fornecedorSelecionado?.logradouro} />
                            <InfoBox label="Número" value={fornecedorSelecionado?.numImovel} />
                            <InfoBox label="Complemento" value={fornecedorSelecionado?.complemento || "Não informado"} />
                            <InfoBox label="Bairro" value={fornecedorSelecionado?.bairro} />
                            <InfoBox label="Município/UF" value={`${fornecedorSelecionado?.municipio} - ${fornecedorSelecionado?.uf}`} />
                            <InfoBox label="CEP" value={fornecedorSelecionado?.cep} />
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
}