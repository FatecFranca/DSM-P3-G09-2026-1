import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const retrieveAll = async (req,res) =>{
    try{
        const fornecedor= await prisma.fornecedor.findMany({
      include:{produtos:true}
    });
        res.json(fornecedor)
    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
};
export const update = async (req,res) =>{
    try{
        const {id}= req.params;
        const {razaoSocial,nomeFantasia,cnpj,email,logradouro,numImovel,complemento,bairro,municipio,uf,cep,telefone1,telefone2}=req.body;

        if(!id){
        return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" });
    }
        const consulta= await prisma.fornecedor.findUnique({where: {cnpj,NOT: {id}}});
        if (consulta){ //Se ja tiver alguem com o mesmo cnpj ou cpf
            return res.status(400).json({ erro: "Ja existe um fornecedor com este cnpj"})
        }

        const fornecedor = await prisma.fornecedor.update({
            where: {id},
            data: {razaoSocial:razaoSocial,nomeFantasia:nomeFantasia,cnpj:cnpj,email:email,logradouro:logradouro,numImovel:numImovel,complemento:complemento,bairro:bairro,municipio:municipio,uf:uf,cep:cep,telefone1:telefone1,telefone2:telefone2}

        });
        res.json(fornecedor);
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 
};
 export const create = async (req,res )=>{

    try{
        const {razaoSocial,nomeFantasia,cnpj,email,logradouro,numImovel,complemento,bairro,municipio,uf,cep,telefone1,telefone2}=req.body;

        const consulta= await prisma.fornecedor.findFirst({where: {cnpj}});
        if (consulta){ //Se ja tiver alguem com o mesmo cnpj ou cpf
            return res.status(400).json({ erro: "Ja existe um fornecedor com este cnpj"})
        }

        const fornecedor = await prisma.fornecedor.create({
            data: {
                razaoSocial:razaoSocial,
                nomeFantasia:nomeFantasia,
                cnpj:cnpj,
                email:email,
                logradouro:logradouro,
                numImovel:numImovel,
                complemento:complemento,
                bairro:bairro,
                municipio:municipio,
                uf:uf,
                cep:cep,
                telefone1:telefone1,
                telefone2:telefone2
            }
        })
        res.json(fornecedor)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }

 }
 export const retrieveOne = async (req,res)=>{
    try{
        const {id}=req.params

        if(!id){
        return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" });
    }
        
        const fornecedor = await prisma.fornecedor.findUnique({where:{id:id},include:{produtos:true,include:{produto:true,precoUltimaCompra:true}}})

        res.json(fornecedor)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 }
 export const deleteFornecedor = async (req,res)=>{
    try{
        const {id}=req.params

        if(!id){
        return res.status(400).json({ erro: "O id do fornecedor é obrigatório!" });
    }

        const fornecedor = await prisma.fornecedor.delete({where:{id:id}})

        res.json(fornecedor)
    }catch(error){
       // P2025: erro do Prisma referente a objeto não encontrado
    if(error?.code === 'P2025') {
      // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
      res.status(404).end()
    }
    else {    // Outros tipos de erro
      // Deu errado: exibe o erro no terminal
      console.error(error)

      // Envia o erro ao front-end, com status de erro
      // HTTP 500: Internal Server Error
      res.status(500).send(error)
    }
  }
}