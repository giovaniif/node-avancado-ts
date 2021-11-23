import { mock } from 'jest-mock-extended'

type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = fileStorage => async ({ file, id }) => {
  await fileStorage.upload({ file, key: id })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => UploadFile.Output
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = Promise<void>
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)
    const file = Buffer.from('any_buffer')

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
