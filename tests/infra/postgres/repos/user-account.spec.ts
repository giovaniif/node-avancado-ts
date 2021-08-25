import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos/user-account'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('postgres user account repository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
    })
  })
})
