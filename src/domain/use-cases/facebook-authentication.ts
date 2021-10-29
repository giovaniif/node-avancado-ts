import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { AuthenticationError } from '@/domain/entities/errors'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Setup = (facebook: LoadFacebookUser, userAccountRepo: LoadUserAccount & SaveFacebookAccount, token: TokenGenerator) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, token) => {
  return async params => {
    const fbData = await facebook.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({ email: fbData.email })
      const facebookAccount = new FacebookAccount(fbData, accountData)

      const { id } = await userAccountRepo.saveWithFacebook(facebookAccount)
      const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })

      return { accessToken }
    }

    throw new AuthenticationError()
  }
}
