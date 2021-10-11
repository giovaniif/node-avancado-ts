import request from 'supertest'

import { app } from '@/main/config/app'
import { auth } from '@/main/middlewares'
import { ForbiddenError } from '@/application/errors'

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization header is not provided', async () => {
    app.get('/fake-route', auth)

    const { status, body } = await request(app)
      .get('/fake-route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})
