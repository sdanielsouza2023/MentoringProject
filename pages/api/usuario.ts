import { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJwt } from '../../middlewares/validarTokenJWT'
const UsuarioEndPoint = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json('Autenticação do usuário com sucesso')
}
export default validarTokenJwt(UsuarioEndPoint)