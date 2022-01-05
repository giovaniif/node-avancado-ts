import request from 'supertest'
import { IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'

import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { UnauthorizedError } from '@/application/errors'

describe('LoginRoutes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup

    const loadUserSpy = jest.fn()
    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

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

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', email: 'any_email', name: 'any_name' })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
