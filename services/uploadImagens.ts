import multer from "multer"
import { createBucketClient } from "@cosmicjs/sdk"

const {
  BUCKET_SLUG,
  READ_KEY,
  WRITE_KEY,
} = process.env

const bucketBarbearia = createBucketClient({
  bucketSlug: BUCKET_SLUG as string,
  readKey: READ_KEY as string,
  writeKey: WRITE_KEY as string,
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const uploadImagemCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    if (!req.file.originalname.includes(".png") &&
      !req.file.originalname.includes(".jpg") &&
      !req.file.originalname.includes(".jpeg")
    ) {
      throw new Error("extensão de imagem inválida")
    }
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    }
    if (req.url && req.url.includes("produtos")) {
      return await bucketBarbearia.media.insertOne({
        media: media_object,
        folder: "produtos",
      })
    } else if (req.url && (req.url.includes("usuario") || req.url.includes("cadastro"))) {
      return await bucketBarbearia.media.insertOne({
        media: media_object,
        folder: "avatar",
      })
    }
  }
}

export { upload, uploadImagemCosmic }