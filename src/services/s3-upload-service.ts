import { env } from '@/env'
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { MultipartFile } from '@fastify/multipart'
import { Readable } from 'stream'

const s3 = new S3({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  region: env.AWS_REGION,
})

export async function uploadToS3(imgFile: MultipartFile, userId: string) {
  const fileStream = imgFile.file as Readable

  const params = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: `avatars/${userId}-${imgFile.filename}`,
    Body: fileStream,
    acl: 'public-read',
    Expires: 60,
    ContentType: imgFile.mimetype,
  }

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: env.AWS_BUCKET_NAME,
      Key: params.Key,
      Body: params.Body,
      ContentType: params.ContentType,
    },
  })

  if (!upload) {
    throw new Error('Failed to upload file')
  }

  return upload.done()
}

export async function getImageByKey(avatarKey: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: avatarKey,
  })

  const presigned = await getSignedUrl(s3, command, {
    signableHeaders: new Set(['content-type']),
    expiresIn: 360,
  })
  return presigned
}

export async function deleteImageByKey(avatarKey: string) {
  await s3.deleteObject({
    Bucket: env.AWS_BUCKET_NAME,
    Key: avatarKey,
  })
}
