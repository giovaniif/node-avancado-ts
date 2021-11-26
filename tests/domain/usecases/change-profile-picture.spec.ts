import { mock, MockProxy } from 'jest-mock-extended'
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/use-cases'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileStorage: MockProxy<UploadFile>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
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
    userProfileRepo.load.mockResolvedValue({ name: 'Giovani Ricco Farias' })
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GF' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined and name is lowercase', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'giovani ricco farias' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GF' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined and name has only one letter', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'g' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'G' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined and name has only one word', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'giovani' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'GI' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined and name is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: undefined })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
