import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import type { RespostaPadraoMsg } from '../../types/respostaPadao'

const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method === 'POST') {

    const { login, senha } = req.body
    if (login === 'admin@admin.com' && senha === 'Admin@123') {
      return res.status(200).json({ msg: 'Usuario autenticado com sucesso' })
    }
    return res.status(400).json({ erro: 'usuário ou senha Não encontrados' })
  } return res.status(405).json({ erro: 'Metodo informado Não é válido' })
}
export default conectarMongoDB(endpointLogin)