export interface SaveUserPicture {
  savePicture: (input: SaveUserPicture.Input) => Promise<SaveUserPicture.Output>
}

export namespace SaveUserPicture {
  export type Input = {
    pictureUrl?: string
  }

  export type Output = Promise<void>
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<LoadUserProfile.Result>
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }

  export type Result = Promise<void>
}
