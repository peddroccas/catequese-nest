export abstract class RegistrationStorage {
  abstract isEnabled(): boolean
  // Envia para o bucket privado (path = caminho dentro do bucket)
  abstract upload(
    path: string,
    body: Buffer,
    contentType: string
  ): Promise<void>
  abstract download(path: string): Promise<Buffer>
  // Link temporário para abrir o arquivo
  abstract createSignedUrl(
    path: string,
    expiresInSeconds: number
  ): Promise<string>
  abstract delete(path: string): Promise<void>
}
