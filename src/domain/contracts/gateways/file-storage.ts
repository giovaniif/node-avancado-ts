
export interface UploadFile {
  upload: (input: UploadFile.Input) => UploadFile.Output
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = Promise<string>
}