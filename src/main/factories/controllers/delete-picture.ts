import { DeleteProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '../use-cases'

export const makeDeletePictureController = (): DeleteProfilePictureController => new DeleteProfilePictureController(makeChangeProfilePicture())
