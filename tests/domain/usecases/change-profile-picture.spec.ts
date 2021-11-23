import { mock, MockProxy } from 'jest-mock-extended'

type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ file, id }) => {
  await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => UploadFile.Output
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = Promise<void>
}

interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture
  let file: Buffer

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  beforeAll(() => {
    uuid = 'any_unique_id'
    fileStorage = mock<UploadFile>()
    crypto = mock<UUIDGenerator>()
    crypto.uuid.mockReturnValueOnce(uuid)
    file = Buffer.from('any_buffer')
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
