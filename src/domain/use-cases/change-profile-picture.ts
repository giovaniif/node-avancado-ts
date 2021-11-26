import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { id: string, file?: Buffer }
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ file, id }) => {
  const model: { pictureUrl?: string, name?: string } = {}

  if (file !== undefined) {
    model.pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  } else {
    model.name = (await userProfileRepo.load({ id })).name
  }

  const userProfile = new UserProfile(id)
  userProfile.setPicture(model)

  await userProfileRepo.savePicture(userProfile)
}
