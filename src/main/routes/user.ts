import { Router } from 'express'
import { adaptExpressRoute } from '../adapters'
import { makeDeletePictureController } from '../factories/controllers'

import { auth } from '../middlewares'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adaptExpressRoute(makeDeletePictureController()))
}
