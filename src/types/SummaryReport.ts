import type { Response } from '@/types/Common'

export type FailedReason = {
  id: string
  reason: string
}

export type SummaryReport = {
  failed_count: number
  failed_reasons: FailedReason[]
  success_count: number
}

export interface SummaryReportResponse extends Response, SummaryReport {}
