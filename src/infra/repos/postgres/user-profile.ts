import { getRepository } from 'typeorm'

import { SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/repos/postgres/entities'

type SaveInput = SaveUserPicture.Input
type SaveOutput = SaveUserPicture.Output

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture ({ id, initials, pictureUrl }: SaveInput): Promise<SaveOutput> {
    const pgUserRepo = getRepository(PgUser)

    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }
}
