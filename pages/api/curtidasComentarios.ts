import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/respostaPadao";
import { produtosModel } from "../../model/UsuarioProduto";
import { UsuarioModel } from "../../model/UsuarioModel";
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarBanco'
const likeEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  //try {
  // o que precisamos para curtir / dislike uma publicacao
  // vem da onde ????
  if (req.method === 'PUT') {
    const { id } = req?.query
    const produtos = await produtosModel.findById(id)
    if (!produtos) {
      res.status(400).json({ erro: 'Maquinário não encontrado' })
    }
    const { userId } = req?.query
    const usuario = await UsuarioModel.findById(userId)
    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não consegue encontrado' })
    }
    // se o index for -1 sinal que ele nao curtiu o comentario
    // se o index for > -1 sinal que o comentario ja esta com like

    const usuarioProdutoIndex = produtos.comentarios.likes.map((e: any) => e.toString() === usuario._id.toString()).indexOf(true);
    if (usuarioProdutoIndex) {
      produtos.comentarios.likes.splice(usuarioProdutoIndex, 1)
      await produtosModel.findByIdAndUpdate({ _id: produtos._id }, produtos)
      return res.status(200).json({ msg: 'Comentário descurtido com sucesso ' })
    } else {
      produtos.comentarios.likes.push(usuario._id)
      await produtosModel.findByIdAndUpdate({ _id: produtos._id }, produtos)
      return res.status(200).json({ msg: 'Comentário curtido com sucesso' })
    }
  }
  //return res.status(405).json({ erro: 'Método inválido relatado' })
  // id da publicacao // no meu caso id do comentario
  // id do usuario que esta curtindo
  // } catch (e) {
  // console.log(e)
  // return res.status(500).json({ erro: 'Ocurreu um erro ao curtir/dislike' })
  //}
}

export default validarTokenJwt(conectarMongoDB(likeEndPoint))