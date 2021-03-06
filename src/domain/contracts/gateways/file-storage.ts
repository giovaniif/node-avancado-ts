
export interface UploadFile {
  upload: (input: UploadFile.Input) => UploadFile.Output
}

export namespace UploadFile {
  export type Input = { file: Buffer, fileName: string }
  export type Output = Promise<string>
}

export interface DeleteFile {
  delete: (input: DeleteFile.Input) => Promise<void>
}

export namespace DeleteFile {
  export type Input = { fileName: string }
}
