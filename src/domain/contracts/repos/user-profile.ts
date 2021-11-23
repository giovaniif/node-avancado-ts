export interface SaveUserPicture {
  savePicture: (input: SaveUserPicture.Input) => Promise<SaveUserPicture.Output>
}

export namespace SaveUserPicture {
  export type Input = {
    pictureUrl?: string
  }

  export type Output = Promise<void>
}
