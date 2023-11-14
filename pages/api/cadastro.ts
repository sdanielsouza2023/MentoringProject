import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/respostaPadao'
import type { CadastroRequisicao } from '../../types/UsuarioRequisicao'
import { UsuarioModel } from 'UsuarioModel'
import { conectarMongoDB } from '../../middlewares/conectarBanco'

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  if (req.method === 'POST') {
    const usuario = req.body as CadastroRequisicao

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ erro: 'Nome Não é válido!' })
    }

    const validarEmail = (email: string): boolean => {
      const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      return email.match(emailRegex) !== null
    }

    const IssoEValido: boolean = validarEmail(usuario.email)

    if (!IssoEValido) {
      return res.status(400).json({ erro: 'E-mail Não é válido!' })
    }
    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ erro: 'Senha Não é válida!' })
    }

    await UsuarioModel.create(usuario);
    return res.status(200).json({ msg: 'Usuario Criado com Sucesso' })
  }
  return res.status(405).json({ erro: 'Metodo informado Não é válido' })
}

export default conectarMongoDB(endpointCadastro)
