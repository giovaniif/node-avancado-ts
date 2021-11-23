import { mock, MockProxy } from 'jest-mock-extended'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture } from '@/domain/contracts/repos'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileStorage: MockProxy<UploadFile>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture
  let file: Buffer

  beforeAll(() => {
    uuid = 'any_unique_id'
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValueOnce(uuid)
    userProfileRepo = mock()
    file = Buffer.from('any_buffer')
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
