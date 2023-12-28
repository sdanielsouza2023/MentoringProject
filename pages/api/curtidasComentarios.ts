import type { NextApiRequest, NextApiResponse } from "next"
import type { RespostaPadraoMsg } from "../../types/respostaPadao"
import { validarTokenJwt } from "../../middlewares/validarTokenJWT"
import { conectarMongoDB } from "../../middlewares/conectarBanco"
import { produtosModel } from '../../model/ProduitoModel'
import { UsuarioModel } from "../../model/UsuarioModel"
import comentario from "./comentario"
const likeEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === 'PUT') {
      //const { id } = req?.queryconst { userId } = req?.query
      const { idProduto, idComentario ,  userId} = req?.query
     console.log(idProduto)
     console.log(idComentario)

      const produto = await produtosModel.findById(idProduto)
      if (!produto) {
        res.status(400).json({ erro: 'publicação não encontrada' })
      }
      
      const usuario = await UsuarioModel.findById(userId)
      const comentarioAserCurtido = produto.comentarios.filter(comentario => comentario._id == idComentario)[0] 
      if(!comentarioAserCurtido){
        res.status(400).json({ erro: 'Comentario não encontrado' })
      }
      const comentarioAserCurtidoIndex = produto.comentarios.findIndex(comentario => comentario == comentarioAserCurtido)
      const likesDosComentariosIndexUsuario = comentarioAserCurtido.likes.findIndex(like => like == userId)
  
      if (likesDosComentariosIndexUsuario == -1) {
        produto.comentarios[comentarioAserCurtidoIndex].likes.push(usuario._id)
        await produtosModel.findByIdAndUpdate({ _id: produto._id }, produto)
        return res.status(200).json({ msg: 'Comentário curtido com sucesso'})       
      } else {
        produto.comentarios[comentarioAserCurtidoIndex].likes.splice(likesDosComentariosIndexUsuario, 1)
        await produtosModel.findByIdAndUpdate({ _id: produto._id }, produto)

        console.log('likesDosComentariosIndexUsuario', likesDosComentariosIndexUsuario)
        return res.status(200).json({ msg: 'dislike no comentário com sucesso' })
      }
    }
    return res.status(405).json({ erro: 'Método informado não é válido' })
    //id da publicacao
    // contador ++ --
  } catch (e) {
    console.log(e)
    return res.status(500).json({ erro: 'Ocorreu erro ao curtir/dislike' })
  }
}
export default validarTokenJwt(conectarMongoDB(likeEndPoint))