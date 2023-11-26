
import type { RespostaPadraoMsg } from '../../types/respostaPadao'
import type { UsuarioRequisicaoCadastro } from '../../types/UsuarioRequisicaoCadastro'
import { UsuarioModel } from '../../model/UsuarioModel'
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import bcrypt from 'bcrypt'
import { upload, uploadImagemCosmic } from '../../services/uploadImagens'
import type { NextApiRequest, NextApiResponse } from "next"
import type { NextRequest, NextFetchEvent } from "next/server";
import { createEdgeRouter } from "next-connect";

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  if (req.method === 'POST') {
    upload.single("file")
    console.log(upload.single("file"))

    const usuario = req.body as UsuarioRequisicaoCadastro
    console.log(`Tem valor ${usuario}`)
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

    const usuarioComMesmoEmail = await UsuarioModel.find({ email: usuario.email })

    if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
      return res.status(400).json({ erro: 'Já existe uma conta com este endereço de e-mail.' })
    }

    const hashedPassword = await bcrypt.hash(usuario.senha, 10)
    // enviar a imagem do multer para o cosmic
    const image = await uploadImagemCosmic(req)
    const SalvarUsuario = {
      nome: usuario.nome,
      email: usuario.email,
      senha: hashedPassword,
      avatar: image?.media?.url
    }
    await UsuarioModel.create(SalvarUsuario);
    return res.status(200).json({ msg: 'Usuario Criado com Sucesso' })
  }
  return res.status(405).json({ erro: 'Metodo informado Não é válido' })
}
export const config = {
  api: {
    bodyParser: false
  }
}
export default conectarMongoDB(endpointCadastro)
