import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'

type Input = { id: string, file?: Buffer }
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ file, id }) => {
  if (file !== undefined) {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  }
}
