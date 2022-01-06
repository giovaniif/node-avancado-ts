import { config, S3 } from 'aws-sdk'

import { UploadFile } from '@/domain/contracts/gateways'

export class AwsS3FileStorage implements UploadFile {
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

  async upload ({ key, file }: UploadFile.Input): UploadFile.Output {
    const s3 = new S3()
    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}
