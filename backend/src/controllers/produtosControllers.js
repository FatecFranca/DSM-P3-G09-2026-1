import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const retrieveAll = async (req,res) =>{
    try{
        const produto= await prisma.produto.findMany({
      include
    });
        res.json(produto)
    }catch(error){
        console.error(error)
        res.status(500).json({error:error.message})
    }
};
export const update = async (req,res) =>{
    try{
        const {id}= req.params;
        const {descricao,marca,imagemUrl,detalhes,unidadeMedida,precoCusto,precoUnitario,qtdEstoque,qtdMinima}=req.body;

        if(!id){
        return res.status(400).json({ erro: "O id do produto é obrigatório!" });
    }
        
        const produto = await prisma.produto.update({
            where: {id},
            data: {descricao,marca,imagemUrl,detalhes,unidadeMedida,precoCusto,precoUnitario,qtdEstoque,qtdMinima}

        });
        res.json(produto);
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 
};
 export const create = async (req,res )=>{

    try{
        const {descricao,marca,imagemUrl,detalhes,unidadeMedida,precoCusto,precoUnitario,qtdEstoque,qtdMinima}=req.body;

        const consulta= await prisma.produto.findFirst({where:{descricao:descricao}});
        if (consulta){ //Se ja tiver alguem com a mesmo descricao
            return res.status(400).json({ erro: "Ja existe um produto com esta descricao"})
        }

        const produto = await prisma.produto.create({
            data: {
                descricao:descricao,
                marca:marca,
                imagemUrl:imagemUrl,
                detalhes:detalhes,
                unidadeMedida:unidadeMedida,
                precoCusto:precoCusto,
                precoUnitario:precoUnitario,
                qtdEstoque:qtdEstoque,
                qtdMinima:qtdMinima
            }
        })
        res.json(produto)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }

 }
 export const retrieveOne = async (req,res)=>{
    try{
        const {id}=req.params

        if(!id){
        return res.status(400).json({ erro: "O id do produto é obrigatório!" });
    }
        
        const produto = await prisma.produto.findUnique({data:{id:id}})

        res.json(produto)
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 }
 export const deleteProduto = async (req,res)=>{
    try{
        const {id}=req.params

        if(!id){
        return res.status(400).json({ erro: "O id do produto é obrigatório!" });
    }

        const produto = await prisma.produto.delete({where:{id:id}})

        res.json(produto)
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