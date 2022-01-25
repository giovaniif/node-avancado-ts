import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

class DeleteProfilePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id: userId })
  }
}

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

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
