import { getRepository } from 'typeorm'

import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/repos/postgres/entities'

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture ({ id, initials, pictureUrl }: SaveUserPicture.Input): Promise<SaveUserPicture.Output> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  async load ({ id }: LoadUserProfile.Params): Promise<LoadUserProfile.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) })

    if (pgUser !== undefined) {
      return { name: pgUser.name ?? undefined }
    }
  }
}
