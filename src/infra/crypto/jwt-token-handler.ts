import { sign } from 'jsonwebtoken'

import { TokenGenerator } from '@/domain/contracts/crypto'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secrect: string) {}

  async generateToken ({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key }, this.secrect, { expiresIn: expirationInSeconds })

    return token
  }
}
