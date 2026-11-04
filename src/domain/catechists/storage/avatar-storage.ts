export interface AvatarUploadParams {
  catechistId: string
  body: Buffer
  contentType: string
}

export abstract class AvatarStorage {
  abstract isEnabled(): boolean
  // Retorna a URL pública da imagem enviada
  abstract upload(params: AvatarUploadParams): Promise<string>
  abstract delete(url: string): Promise<void>
}
