"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFornecedores, deleteFornecedor, createFornecedor, updateFornecedor, getFornecedorById } from "@/services/fornecedoresService"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react";
import { Trash2, FilePenLine, MapPinPlusInside, Contact, Mail, Building2, ChartBarStacked } from 'lucide-react';

//Componente auxiliar de exibição
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

//Componente auxiliar de campo de formulário
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

//Grade de campos do formulário (igual para Criar e Editar)
function FormGrid({
    razaoSocial,
    setRazaoSocial,
    nomeFantasia,
    setNomeFantasia,
    cnpj,
    setCnpj,
    categoria,
    setCategoria,
    email,
    setEmail,
    telefone1,
    setTelefone1,
    telefone2,
    setTelefone2,
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
                <FormField label="Razão Social" placeholder="Razão Social" value={razaoSocial} onChange={setRazaoSocial} />
                <FormField label="Nome Fantasia" placeholder="Nome Fantasia" value={nomeFantasia} onChange={setNomeFantasia} />
                <FormField label="CNPJ" placeholder="CNPJ" value={cnpj} onChange={setCnpj} />
                <FormField label="Categoria" placeholder="Categoria" value={categoria} onChange={setCategoria} />
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">
                    Contato
                </p>
                <FormField label="E-mail" placeholder="email@exemplo.com" value={email} onChange={setEmail} />
                <FormField label="Telefone 1" placeholder="(00) 90000-0000" value={telefone1} onChange={setTelefone1} />
                <FormField label="Telefone 2" placeholder="(00) 90000-0000" value={telefone2} onChange={setTelefone2} />
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

//Classes compartilhadas do AlertDialogContent 
const MODAL_CLASSES = "bg-zinc-900 border-zinc-700 !w-[98vw] !max-w-[98vw] md:!w-[92vw] md:!max-w-[92vw] lg:!w-[88vw] lg:!max-w-[88vw] xl:!w-[82vw] xl:!max-w-[82vw] 2xl:!w-[75vw] 2xl:!max-w-[75vw] max-h-[92vh] overflow-y-auto p-4 md:p-8"

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

    function exibirMensagem(texto, tipo) {
        setMensagem(texto)
        setTipoMensagem(tipo)
        setTimeout(() => setMensagem(""), 3000)
    }

    async function carregarFornecedores() {
        try {
            const data = await getFornecedores()
            setFornecedores(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { carregarFornecedores() }, [])

    function preencherCampos(fornecedor) {
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
    }

    function limparCampos() {
        setFornecedorSelecionado(null)
        preencherCampos({})
    }

    async function abrirEditar(id) {
        try {
            const fornecedor = await getFornecedorById(id)
            setFornecedorSelecionado(fornecedor)
            preencherCampos(fornecedor)
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

    async function abrirDelete(id) {
        try {
            const fornecedor = await getFornecedorById(id)
            setFornecedorSelecionado(fornecedor)
        } catch (error) {
            console.error(error)
        }
    }

    const fornecedorData = {
        razaoSocial, nomeFantasia, cnpj, email,
        logradouro, numImovel, complemento, bairro,
        municipio, uf, cep, telefone1, telefone2, categoria
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
        <div className="flex flex-col">
            {mensagem && (
                <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300
                    ${tipoMensagem === "sucesso" ? "bg-green-500" : "bg-red-500"}`}>
                    {mensagem}
                </div>
            )}
            <div className="flex flex-col pl-13">
                <h3 className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">cadastro</h3>
                <div className="flex flex-wrap pt-3 pr-13 justify-between">
                    <h1 className="text-white text-3xl font-black">FORNECEDORES</h1>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 transition-all duration-200 p-5 rounded-lg font-semibold  shadow-lg shadow-orange-500/20"
                        onClick={() => { limparCampos(); setOpenCriar(true) }}
                    >
                        + Novo Fornecedor
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 md:p-8 lg:p-13 justify-center lg:justify-start">
                {fornecedores.map((fornecedor) => (
                    <div key={fornecedor.id} className="w-full sm:w-[48%] lg:w-80">
                        <Card
                            className="min-h-[320px] background-sidebar border border-zinc-600 border-t-3 border-t-orange-500 cursor-pointer transition-all duration-300 hover:border-orange-500 hover:-translate-y-2"
                            onClick={async () => {
                                await abrirVer(fornecedor.id)
                                setOpenVer(true)
                            }}
                        >
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
                                <h1 className="text-xl font-black text-white break-words">{fornecedor.nomeFantasia}</h1>
                                <h3 className="border-b border-zinc-700 pb-2 break-words">{fornecedor.cnpj}</h3>
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
                                    className="flex-1 min-w-[120px] background-sidebar cursor-pointer hover:border-orange-500 hover:text-orange-500 group"
                                    onClick={async (e) => {
                                        e.stopPropagation()
                                        await abrirEditar(fornecedor.id)
                                        setOpenEditar(true)
                                    }}
                                >
                                    <FilePenLine className="group-hover:text-orange-500" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-12 background-sidebar cursor-pointer border-red-500 text-red-500 hover:border-red-800 hover:bg-red-500 hover:text-red-800 group"
                                    onClick={async (e) => {
                                        e.stopPropagation()
                                        await abrirDelete(fornecedor.id)
                                        setOpenDelete(true)
                                    }}
                                >
                                    <Trash2 className="group-hover:text-red-500" />
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
                        <ModalHeader titulo="Novo Fornecedor" />
                    </AlertDialogHeader>
                    <FormGrid
                        razaoSocial={razaoSocial}
                        setRazaoSocial={setRazaoSocial}
                        nomeFantasia={nomeFantasia}
                        setNomeFantasia={setNomeFantasia}
                        cnpj={cnpj}
                        setCnpj={setCnpj}
                        categoria={categoria}
                        setCategoria={setCategoria}
                        email={email}
                        setEmail={setEmail}
                        telefone1={telefone1}
                        setTelefone1={setTelefone1}
                        telefone2={telefone2}
                        setTelefone2={setTelefone2}
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
                                    await createFornecedor(fornecedorData)
                                    await carregarFornecedores()
                                    exibirMensagem("Fornecedor criado com sucesso!", "sucesso")
                                    setOpenCriar(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao criar fornecedor!", "erro")
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
                            titulo="Editar Fornecedor"
                            subtitulo={fornecedorSelecionado?.razaoSocial}
                        />
                    </AlertDialogHeader>
                    <FormGrid
                        razaoSocial={razaoSocial}
                        setRazaoSocial={setRazaoSocial}
                        nomeFantasia={nomeFantasia}
                        setNomeFantasia={setNomeFantasia}
                        cnpj={cnpj}
                        setCnpj={setCnpj}
                        categoria={categoria}
                        setCategoria={setCategoria}
                        email={email}
                        setEmail={setEmail}
                        telefone1={telefone1}
                        setTelefone1={setTelefone1}
                        telefone2={telefone2}
                        setTelefone2={setTelefone2}
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
                                    await updateFornecedor(fornecedorSelecionado.id, fornecedorData)
                                    await carregarFornecedores()
                                    exibirMensagem("Fornecedor editado com sucesso!", "sucesso")
                                    setOpenEditar(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao editar fornecedor!", "erro")
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
                            titulo={fornecedorSelecionado?.nomeFantasia}
                            subtitulo={fornecedorSelecionado?.razaoSocial}
                            badge={`${fornecedorSelecionado?._count?.produtos || 0} produtos`}
                        />
                    </AlertDialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Identificação</p>
                            <InfoBox label="CNPJ" value={fornecedorSelecionado?.cnpj} />
                            <InfoBox label="Categoria" value={fornecedorSelecionado?.categoria} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Contato</p>
                            <InfoBox label="E-mail" value={fornecedorSelecionado?.email} />
                            <InfoBox label="Telefone 1" value={fornecedorSelecionado?.telefone1} />
                            {fornecedorSelecionado?.telefone2 && (
                                <InfoBox label="Telefone 2" value={fornecedorSelecionado?.telefone2} />
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-orange-400 text-xs tracking-[0.3em] font-semibold uppercase">Endereço</p>
                            <InfoBox label="Logradouro" value={fornecedorSelecionado?.logradouro} />
                            <InfoBox label="Número" value={fornecedorSelecionado?.numImovel} />
                            <InfoBox label="Complemento" value={fornecedorSelecionado?.complemento} />
                            <InfoBox label="Bairro" value={fornecedorSelecionado?.bairro} />
                            <InfoBox label="Município/UF" value={`${fornecedorSelecionado?.municipio} - ${fornecedorSelecionado?.uf}`} />
                            <InfoBox label="CEP" value={fornecedorSelecionado?.cep} />
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
                            Essa ação irá deletar o fornecedor <strong className="text-white">{fornecedorSelecionado?.nomeFantasia}</strong> permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="bg-zinc-900">
                        <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await deleteFornecedor(fornecedorSelecionado.id)
                                    await carregarFornecedores()
                                    exibirMensagem("Fornecedor deletado com sucesso!", "sucesso")
                                    setOpenDelete(false)
                                } catch (error) {
                                    exibirMensagem("Erro ao deletar fornecedor!", "erro")
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