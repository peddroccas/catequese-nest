export interface RiteFileUploadParams {
  riteId: string
  // Identifica o arquivo (um rito pode ter vários PDFs)
  fileId: string
  body: Buffer
}

export abstract class RiteStorage {
  abstract isEnabled(): boolean
  // Retorna a URL pública do PDF enviado
  abstract upload(params: RiteFileUploadParams): Promise<string>
  abstract delete(url: string): Promise<void>
}
