import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { id: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ file, id }) => {
  const model: { pictureUrl?: string, name?: string } = {}
  const key = crypto.uuid({ key: id })

  if (file !== undefined) {
    model.pictureUrl = await fileStorage.upload({ file, key })
  } else {
    model.name = (await userProfileRepo.load({ id })).name
  }

  const userProfile = new UserProfile(id)
  userProfile.setPicture(model)

  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) {
      await fileStorage.delete({ key })
    }
    throw error
  }

  return userProfile
}
