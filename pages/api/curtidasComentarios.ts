import type { NextApiRequest, NextApiResponse } from "next"
import type { RespostaPadraoMsg } from "../../types/respostaPadao"
import { validarTokenJwt } from "../../middlewares/validarTokenJWT"
import { conectarMongoDB } from "../../middlewares/conectarBanco"
import { produtosModel } from '../../model/UsuarioProduto'
import { UsuarioModel } from "../../model/UsuarioModel"
const likeEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === 'PUT') {
      //const { id } = req?.query
      const { id } = req?.query
      const publicacao = await produtosModel.findById(id)
      if (!publicacao) {
        res.status(400).json({ erro: 'publicação não encontrada' })
      }
      const { userId } = req?.query
      const usuario = await UsuarioModel.findById(userId)
      const likesDosComentariosIndexUsuario = publicacao.comentarios.map((comentario) =>
        comentario.likes.findIndex((e: any) => e.toString() === usuario._id.toString()))
      console.log('likesDosComentariosIndexUsuario', likesDosComentariosIndexUsuario)
      if (likesDosComentariosIndexUsuario != -1) {
        publicacao.comentarios.map((comentario: any) => comentario.likes.splice(likesDosComentariosIndexUsuario, 1))
        await produtosModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao)
        return res.status(200).json({ msg: 'dislike no comentário com sucesso' })
      } else {
        publicacao.comentarios.map((comentario: any) => comentario.likes.push(usuario._id))
        await produtosModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao)
        return res.status(200).json({ msg: 'Comentário curtido com sucesso' })
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