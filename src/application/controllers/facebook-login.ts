import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
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

  public async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.facebookAuthentication.perform({ token: httpRequest.token })

    if (result instanceof AccessToken) {
      return ok({ accessToken: result.value })
    }

    return unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    const validators = [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]

    return validators
  }
}
