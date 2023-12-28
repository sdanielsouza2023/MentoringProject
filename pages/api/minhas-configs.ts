import type { NextApiRequest, NextApiResponse } from "next"
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
import { produtosModel } from '../../model/ProduitoModel'
import { UsuarioModel } from "../../model/UsuarioModel"
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import { RespostaPadraoMsg } from "../../types/respostaPadao"
import nc from 'next-connect'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { userId } = req.query 
        const usuario = await UsuarioModel.findById(userId)
        const produtos = await produtosModel.find({idUsuario: usuario._id,}).sort({ data: -1 })
        console.log(usuario)
        console.log(produtos)
        return res.status(200).json(produtos)
      } catch (e) {
        return res.status(400).json({
          erro: "Erro ao obter produtos por data"
        })
      }
}).delete(async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) =>{
 
    const { id } = req.query 
    const produtos = await produtosModel.findById(id)
    if(!produtos){
        return res.status(200).json({erro:"Erro ao obter produtos"})
    }else{
        await produtosModel.findByIdAndDelete(produtos)
        return res.status(200).json({msg:"Produto deletado com sucesso"}) 
    }
   
}).put(async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) =>{
 
    const { id} = req.query 
    const {descricao} = req.body
    console.log(descricao)

    if(!descricao || descricao.length < 2 ){
        return res.status(400).json({ erro: 'Seja mais criativo e forneça mais informações' });
    }
    
    await produtosModel.findByIdAndUpdate(id, { descricao }, { new: true });

    if(!id){
        return res.status(200).json({erro:"Erro ao obter produtos"})
    }else{
       
        return res.status(200).json({msg:"Produto atualizado com sucesso"}) 
    }
   
})

export default conectarMongoDB(validarTokenJwt(handler))