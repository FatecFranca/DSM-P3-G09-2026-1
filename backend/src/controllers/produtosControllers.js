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
        const {descricao,marca,imagemUrl,detalhes,unidadeMedida,precoCusto,precoUnitario,qtdMinima}=req.body;

        if(!id){
        return res.status(400).json({ erro: "O id do produto é obrigatório!" });
    }
        
        const produto = await prisma.produto.update({
            where: {id},
            data: {descricao:descricao,marca:marca,imagemUrl:imagemUrl,detalhes:detalhes,unidadeMedida:unidadeMedida,precoCusto:precoCusto,precoUnitario:precoUnitario,qtdMinima:qtdMinima}

        });
        res.json(produto);
    }catch(error){
        console.error(error)
        res.status(500).json({error: error.message})
    }
 
};
 export const create = async (req,res )=>{

    try{
        const {descricao,marca,imagemUrl,detalhes,unidadeMedida,precoCusto,precoUnitario,qtdMinima}=req.body;

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
        
        const produto = await prisma.produto.findUnique({where:{id:id}})

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
export const addFornecedor = async (req, res) => {
  try {
    const { id } = req.params  // produtoId
    const { fornecedorId, precoUltimaCompra } = req.body

    const vinculo = await prisma.produtoFornecedor.upsert({
      where: { produtoId_fornecedorId: { produtoId: id, fornecedorId: fornecedorId } },
      update: { precoUltimaCompra: precoUltimaCompra },
      create: { produtoId: id, fornecedorId: fornecedorId, precoUltimaCompra: precoUltimaCompra }
    })
    res.json(vinculo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

export const removeFornecedor = async (req, res) => {
  try {
    const { id, fornecedorId } = req.params
    await prisma.produtoFornecedor.delete({
      where: { produtoId_fornecedorId: { produtoId: id, fornecedorId: fornecedorId } }
    })
    res.status(204).end()
  } catch (error) {
    if (error?.code === 'P2025') return res.status(404).end()
    res.status(500).json({ error: error.message })
  }
}