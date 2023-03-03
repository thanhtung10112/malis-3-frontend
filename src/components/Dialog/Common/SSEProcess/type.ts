import { BackgroundJobResult } from '@/types/BackgroundJob'

export interface DialogSSEProcessProps {
  open: boolean
  operationId: string
  onClose?(): void
  onSuccess?(operationId: string, data: BackgroundJobResult): void
  onError?(operationId: string, data: BackgroundJobResult): void
}
