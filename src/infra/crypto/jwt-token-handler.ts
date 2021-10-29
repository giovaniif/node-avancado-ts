import { JwtPayload, sign, verify } from 'jsonwebtoken'

import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secrect: string) {}

  async generate ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secrect, { expiresIn: expirationInSeconds })

    return token
  }

  async validate ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = verify(token, this.secrect) as JwtPayload
    return payload.key
  }
}
