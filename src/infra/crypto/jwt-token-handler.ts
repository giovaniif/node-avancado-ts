import { sign, verify } from 'jsonwebtoken'

import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secrect: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secrect, { expiresIn: expirationInSeconds })

    return token
  }

  async validateToken ({ token }: TokenValidator.Params): Promise<void> {
    verify(token, this.secrect)
  }
}
