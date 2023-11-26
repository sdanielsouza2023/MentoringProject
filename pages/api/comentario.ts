import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/respostaPadao'

const comentarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {

  } catch (e) {
    console.log(e)
    return res.status(500).json({ erro: 'Erro ao adicionar um comentário' })
  }
}
