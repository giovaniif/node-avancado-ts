import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

class DeleteProfilePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id: userId })
  }
}

describe('DeleteProfilePicture controller', () => {
  it('should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = jest.fn()
    const sut = new DeleteProfilePictureController(changeProfilePicture)
    const userId = 'any_user_id'

    await sut.handle({ userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})
