import { Controller, DeleteProfilePictureController } from '@/application/controllers'

describe('DeleteProfilePicture controller', () => {
  let sut: DeleteProfilePictureController
  let userId: string
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    userId = 'any_user_id'
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    sut = new DeleteProfilePictureController(changeProfilePicture)
  })

  it('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('should return 204', async () => {
    const httpResponse = await sut.handle({ userId })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})
