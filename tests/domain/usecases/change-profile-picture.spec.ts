import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'ts-jest/utils'

import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/use-cases'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture
  let file: Buffer

  beforeAll(() => {
    uuid = 'any_unique_id'
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0])
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

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({ file, id: 'any_id' })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })

  it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(2)

    const promise = sut({ id: 'any_id', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  it('should not call DeleteFile when file does not exist and SaveUserPicture throws', () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    expect.assertions(1)

    const promise = sut({ id: 'any_id', file: undefined })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should rethrow if SaveUserPicture throws', async () => {
    const error = new Error()
    userProfileRepo.savePicture.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if UploadFile throws', async () => {
    const error = new Error('upload_error')
    fileStorage.upload.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if LoadUserProfile throws', async () => {
    const error = new Error('load_error')
    userProfileRepo.load.mockRejectedValueOnce(error)

    const promise = sut({ id: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if UUIDGenerator throws', async () => {
    const error = new Error('uuid_error')
    crypto.uuid.mockImplementationOnce(() => { throw error })

    const promise = sut({ id: 'any_id', file })

    await expect(promise).rejects.toThrow(error)
  })
})
