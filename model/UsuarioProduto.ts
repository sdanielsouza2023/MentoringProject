import mongoose, { Schema, mongo } from "mongoose";

const produtosSchema = new Schema({
  idUsuario: { type: String, required: true },
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: { type: String, required: true },
  data: { type: Date, required: true },

  comentarios: [
    {
      texto: { type: String, required: false },
      likes: { type: Array, required: false, default: [] },
    },
  ],
  likes: { type: Array, required: true, default: [] },

})
//mongoose.models.produtos se existir salva os dados
//mongoose.model Ou cria uma nova tabela salvado os dados
export const produtosModel = mongoose.models.produtos ||
  mongoose.model('produtos', produtosSchema);
