import type { NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/respostaPadao"
//import type { ProdutosRespostaPadrao } from "../../types/ProdutosRespostaPadrao"
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagens'
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
import { produtosModel } from '../../model/UsuarioProduto'
import { UsuarioModel } from "../../model/UsuarioModel";


const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req.query
      console.log(userId)
      const usuario = await UsuarioModel.findById(userId)
      if (!usuario) {
        return res.status(400).json({ erro: 'usuário não informado' })
      }

      //console.log(req.query)
      //console.log(userId)
      //Nosso usuario fica aqui req.query.userId

      //  nosso usuario esta no req.query
      // const { userId } = req.query
      // const produto = await produtosModel.findById(userId)
      /*
        if (!produto) {
          return res.status(400).json({ erro: 'Maquinário não encontrado' })
        }
      */

      if (!req || !req.body) {
        return res.status(400).json({ erro: 'Parâmetros de entrada não fornecidos' })
      }
      const { descricao, nome } = req?.body
      if (!descricao || descricao.length < 2 && !nome || nome.length < 3) {
        return res.status(400).json({ erro: 'Erro ao fazer uma descrição' })
      }

      const image = await uploadImagemCosmic(req)

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ erro: 'A imagem é obrigatória' })
      }
      const produtos = {
        idUsuario: usuario._id,
        nome,
        descricao,
        foto: image.media.url,
        data: new Date()
      }
      await produtosModel.create(produtos)
      return res.status(400).json({ msg: 'publicação é criada com sucesso :) ' })

    } catch (error) {
      return res.status(400).json({
        erro: "Erro ao enviar sua pergunta"
      })
    }
  })
export const config = {
  api: {
    bodyParser: false,
  }
}
export default validarTokenJwt(conectarMongoDB(handler))
