import { mock } from 'jest-mock-extended'

import { LoadFacebookUserApi } from '@/data/contracts/api'

class FacebookApi {
  private readonly BASE_URL = 'https://graph.facebook.com'

  constructor (private readonly httpClient: HttpGetClient) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({ url: `${this.BASE_URL}/oauth/acess_token` })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('Facebook api', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/acess_token'
    })
  })
})
