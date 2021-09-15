import './config/module-alias'
import 'reflect-metadata'

import { createConnection } from 'typeorm'

import { app } from '@/main/config/app'
import { env } from '@/main/config/env'

createConnection()
  .then(() => app.listen(env.appPort, () => console.log(`Server running at: http://localhost:${env.appPort}`)))
  .catch(console.error)
