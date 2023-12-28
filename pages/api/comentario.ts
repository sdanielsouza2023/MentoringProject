import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/respostaPadao'
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import { UsuarioModel } from '../../model/UsuarioModel'
import { produtosModel } from '../../model/ProduitoModel'

const comentarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

  try {
    if (req.method === 'PUT') {
      const { userId, id } = req.query
      console.log("req.query",req.query)
      const usuarioLogado = await UsuarioModel.findById(userId)
      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'Usuário não encontrado' })
      }
      const produto = await produtosModel.findById(id)
      if (!produto) {
        return res.status(400).json({ erro: 'Publicação do maquinário não encontrado' })
      }

        console.log("Textando aqui",req.body.comentarios.texto)
      
      if (!req.body || !req.body.comentarios || !req.body.comentarios || req.body.comentarios.length < 2) {
        return res.status(400).json({ erro: 'O comentário não é válido' });
      }

      const comentarios = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        texto: req.body.comentarios,
        likes: [],
      }
      console.log(produto)
      console.log(req.body.comentarios)
      produto.comentarios.push(comentarios)
      await produtosModel.findByIdAndUpdate({ _id: produto._id }, produto)
      return res.status(200).json({ msg: 'comentário adcionando com sucesso' })

    }
    return res.status(405).json({ erro: "método inválido relatado" })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ erro: 'Erro ao adicionar um comentário' })
  }

}

export default validarTokenJwt(conectarMongoDB(comentarioEndPoint))