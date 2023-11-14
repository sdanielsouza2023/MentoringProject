import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import mongoose from 'mongoose';
import type { RespostaPadraoMsg } from '../types/respostaPadao'


export const conectarMongoDB = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

  // verificar se o banco esta conectado
  if (mongoose.connections[0].readyState) {
    return handler(req, res)
  }
  // vamos conectar
  // pegar a variavel .env

  const { DB_CONEXAO_STRING } = process.env
  if (!DB_CONEXAO_STRING) {
    // verifica se a avariavel env esta com a string do banco 
    return res.status(500).json({ erro: 'ENV Não foi passada' })
  }
  mongoose.connection.on('connected', () => {
    console.log('Banco de dados conectado');

  })

  mongoose.connection.on('error', erro => {
    console.error('Erro ao se conectar:', erro);
    return res.status(500).json({ erro: 'Erro ao conectar ao banco de dados' });
  })
  await mongoose.connect(DB_CONEXAO_STRING)
  return handler(req, res)
}
