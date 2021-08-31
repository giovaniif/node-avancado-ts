import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { ValidationBuilder, ValidationComposite } from '../validation'

type HttpRequest = {
  token: string
}

type Model = Error | { accessToken: string }
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) return badRequest(error)

      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })

      if (result instanceof AccessToken) {
        return ok({ accessToken: result.value })
      }

      return unauthorized()
    } catch (err) {
      return serverError(err)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    const validators = ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()

    const validator = new ValidationComposite(validators)
    return validator.validate()
  }
}
