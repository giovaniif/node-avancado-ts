import { config, S3 } from 'aws-sdk'

import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
  private readonly bucket: string

  constructor (accessKey: string, secret: string, bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    this.bucket = bucket
  }

  async upload ({ fileName, file }: UploadFile.Input): UploadFile.Output {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }

  async delete ({ fileName }: DeleteFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
  }
}
