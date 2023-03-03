import { Response } from './Common'

export interface BackgroundJob {
  celery_id: string
  operation_id: string
}

export type BackgroundJobResult = {
  operation_result: any
  message: string
  status: 'SUCCESS' | 'IN PROGRESS' | 'CREATED' | 'ERROR' | null
}

export interface GetBackgroundJob extends BackgroundJob, Response {}
