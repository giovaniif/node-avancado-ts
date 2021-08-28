import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, HttpResponse, ok, serverError, unauthorized } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | { accessToken: string }
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError('token'))
      }

      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })

      if (result instanceof AccessToken) {
        return ok({ accessToken: result.value })
      }

      return unauthorized()
    } catch (err) {
      return serverError(err)
    }
  }
}
