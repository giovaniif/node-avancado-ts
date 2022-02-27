import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, ok } from '@/application/helpers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, Validator } from '@/application/validation'
import { Controller } from '.'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfilePicture({ file: file.buffer, id: userId })
    return ok(result)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      new Required(file, 'file'),
      new RequiredBuffer(file.buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], file.mimeType),
      new MaxFileSize(5, file.buffer)
    ]
  }
}
