export type UploadImageProps = {
  image: string
  fileTypes?: `image/${string}`[]
  fileSize?: number
  httpRequest?: {
    key: string
    endpoint: Lowercase<string>
    method: Lowercase<string>
  }
  onChange?(image: { file: File; base64: string }): void
  width?: string | number
  height?: string | number
  error?: string
}
