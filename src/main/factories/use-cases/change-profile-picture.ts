import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUUIDHandler } from '../gateways'
import { makePgUserProfileRepo } from '../repos'

export const makeChangeProfilePicture = (): ChangeProfilePicture => setupChangeProfilePicture(makeAwsS3FileStorage(), makeUUIDHandler(), makePgUserProfileRepo())
