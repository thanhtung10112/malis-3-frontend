import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootReducerType } from './rootReducer'

import type { FailedReason, SummaryReport } from '@/types/SummaryReport'

export const name = 'summaryReport'

export const initialState = {
  open: false,
  title: 'Summary report',
  numberOfSuccess: 0,
  numberOfFailed: 0,
  failedReasons: [] as FailedReason[]
}

const summaryReport = createSlice({
  name,
  initialState,
  reducers: {
    setOpen(state, { payload }: PayloadAction<boolean>) {
      state.open = payload
    },
    setReportData(state, { payload }: PayloadAction<SummaryReport>) {
      state.open = false
      state.numberOfFailed = payload.failed_count
      state.numberOfSuccess = payload.success_count
      state.failedReasons = payload.failed_reasons
    }
  }
})

// Actions

export const { setOpen, setReportData } = summaryReport.actions

// Selectors

export const selectState = (state: RootReducerType) => state.summaryReport

export default summaryReport.reducer
