import { UniqueId, UUIDHandler } from '@/infra/gateways'

export const makeUniqueId = (): UniqueId => new UniqueId(new Date())

export const makeUUIDHandler = (): UUIDHandler => new UUIDHandler()
