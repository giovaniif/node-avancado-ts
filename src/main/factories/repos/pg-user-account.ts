import { PgUserAccountRepository } from '@/infra/postgres/repos/user-account'

export const makePgUserAccountRepo = (): PgUserAccountRepository => new PgUserAccountRepository()
