import type { NextApiRequest, NextApiResponse } from "next"
import type { RespostaPadraoMsg } from '../../types/respostaPadao'
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from "../../middlewares/conectarBanco"
import { produtosModel } from "../../model/UsuarioProduto"


const PesquisaProdutosEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
  try {
    if (req.method === 'GET') {
      const { filtro } = req.query

      if (!filtro || filtro.length < 3) {
        return res.status(400).json({ erro: 'Nada encontrado, talvez você deva tentar com mais informações' })
      }

      /*const produtoEncontrados = await produtosModel.find({
        $or: [{ nome: { $regex: filtro, $options: 'i' } },
        { descricao: { $regex: filtro, $options: 'i' } }
        ]
      })*/
      const produtoEncontrados = await produtosModel.find(
        {
          $or: [
            { nome: { $regex: filtro, $options: 'i' } },
            { descricao: { $regex: filtro, $options: 'i' } }
          ]
        },
        //  { comentarios: 1, _id: 0 } // Projeção para incluir apenas o campo de comentários
      )

      return res.status(200).json(produtoEncontrados)
    }
    return res.status(405).json({ erro: 'método informado não é válido' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ erro: 'incapaz de procurar o produto' })
  }
}

export default validarTokenJwt(conectarMongoDB(PesquisaProdutosEndpoint))