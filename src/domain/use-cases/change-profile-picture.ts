import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { id: string, file?: { buffer: Buffer, mimeType: string }}
type Output = { pictureUrl?: string, initials?: string }
type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ file, id }) => {
  const model: { pictureUrl?: string, name?: string } = {}
  const key = crypto.uuid({ key: id })

  if (file !== undefined) {
    model.pictureUrl = await fileStorage.upload({ file: file.buffer, fileName: `${key}.${file.mimeType.split('/')[1]}` })
  } else {
    model.name = (await userProfileRepo.load({ id }))?.name
  }

  const userProfile = new UserProfile(id)
  userProfile.setPicture(model)

  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) {
      await fileStorage.delete({ fileName: key })
    }
    throw error
  }

  return userProfile
}
