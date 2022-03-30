import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '.'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfilePicture({ file, id: userId })
    return ok(result)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldName: 'file', value: file }).required().image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 }).build()
    ]
  }
}
