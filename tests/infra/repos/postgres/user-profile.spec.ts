import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

import { PgUser } from '@/infra/repos/postgres/entities'
import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('postgres user profile repository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('savePicture', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url', initials: undefined })
      const pgUser = await pgUserRepo.findOne({ id })

      expect(pgUser).toMatchObject({ initials: null, pictureUrl: 'any_url', id: id, email: 'any_email' })
    })
  })

  describe('load', () => {
    it('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBe('any_name')
    })

    it('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBeUndefined()
    })

    it('should return undefined', async () => {
      const invalidId = '1'
      const userProfile = await sut.load({ id: invalidId })

      expect(userProfile).toBeUndefined()
    })
  })
})
