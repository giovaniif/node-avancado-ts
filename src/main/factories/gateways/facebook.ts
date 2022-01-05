import { env } from '@/main/config/env'
import { FacebookApi } from '@/infra/gateways'
import { makeAxiosHttpClient } from '@/main/factories/gateways'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosHttpClient(), env.facebookApi.clientId, env.facebookApi.clientSecret)
}
