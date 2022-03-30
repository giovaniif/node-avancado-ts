import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'

import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'

describe('UserRoutes', () => {
  describe('DELETE users/picture', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb()
      backup = db.backup()
    })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })
  })
})
