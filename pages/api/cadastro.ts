import type { RespostaPadraoMsg } from '../../types/respostaPadao'
import type { UsuarioRequisicaoCadastro } from '../../types/UsuarioRequisicaoCadastro'
import { UsuarioModel } from '../../model/UsuarioModel'
import { conectarMongoDB } from '../../middlewares/conectarBanco'
import bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from "next"
import { upload, uploadImagemCosmic } from '../../services/uploadImagens'
import nc from "next-connect"

const handler = nc()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        const usuario = req.body as UsuarioRequisicaoCadastro

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
        console.log("chegou aqui 01")
        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req)
        const hashedPassword = await bcrypt.hash(usuario.senha, 10)
        const SalvarUsuario = {
          nome: usuario.nome,
          email: usuario.email,
          senha: hashedPassword,
          avatar: image?.media?.url
        }
        await UsuarioModel.create(SalvarUsuario);
        return res.status(200).json({ msg: 'Usuario Criado com Sucesso' })
      }
      catch (e) {
        return res.status(500).json({ erro: "Não foi possível fazer upload da imagem" })
      }
    }
  )
export const config = {
  api: {
    bodyParser: false,
  }
}

export default conectarMongoDB(handler)
