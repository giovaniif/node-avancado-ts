import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  it('should return a facebook user if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'EAAVrLnjlvSgBAAeSZBmunXSKnE8ZCPgcx3eTexFgtVem8pKBlDyFa7eQ3A2HmWh5PR9U1XCaDuJ67MHf5G0M3wZATYp35kPsl7ZAe1YGKVsCVmPZBAMOE4sJIcZBFjFsLVyvfIfsn6qBAVsIcKsfBqUWxmzK7ceZCtoZAfVSJuAfb8BZAJcKiQazZC2IHNi9ld3PGu2fGOQigaPAZDZD' })

    expect(fbUser).toEqual({
      facebookId: '109612464782676',
      email: 'giovani_zsgszcu_teste@tfbnw.net',
      name: 'Giovani Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
