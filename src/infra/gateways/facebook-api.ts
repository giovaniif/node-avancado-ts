import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { HttpGetClient } from '@/infra/gateways'

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: { user_id: string }
}

type UserInfo = {
  id: string
  name: string
  email: string
}

type Params = LoadFacebookUser.Params
type Result = LoadFacebookUser.Result

export class FacebookApi implements LoadFacebookUser {
  private readonly BASE_URL = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser ({ token }: Params): Promise<Result> {
    return this.getUserInfo(token)
      .then(({ id, name, email }) => ({ facebookId: id, name, email }))
      .catch(() => undefined)
  }

  private async getUserInfo (clientToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(clientToken)

    return this.httpClient.get({
      url: `${this.BASE_URL}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
    })
  }

  private async getDebugToken (clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()

    return this.httpClient.get({
      url: `${this.BASE_URL}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getAppToken (): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.BASE_URL}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}
