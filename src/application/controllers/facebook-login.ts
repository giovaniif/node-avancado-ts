import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/entities'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  token: string
}

type Model = Error | { accessToken: string }
export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  public async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.facebookAuthentication.perform({ token })

    if (result instanceof AccessToken) {
      return ok({ accessToken: result.value })
    }

    return unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    const validators = [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]

    return validators
  }
}
