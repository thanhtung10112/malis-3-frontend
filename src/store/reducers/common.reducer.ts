import { createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { Color } from '@material-ui/lab/Alert'
import type { RootReducerType } from './rootReducer'
import type { DataForDropdown, Entity, ListData, ParameterOption, ErrorLog, PayloadOperation } from '@/types/Common'
import { StatusCode } from '@/utils/StatusCode'

export const name = 'common'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  searchQuery: '',
  entity: '' as Entity,
  loading: {
    table: false,
    page: false
  },
  tableState: {
    page: 1,
    per_page: 100,
    total_items: 0
  } as ListData,
  messageState: {
    message: '',
    status: 'success' as Color,
    display: false
  },
  editRows: [] as any[],
  currentLanguage: {
    value: null, // primary key
    description: '',
    properties: {},
    is_default: false,
    parameter_id: '',
    id: null, // primary key
    status: false
  } as ParameterOption,
  selectedRows: [] as number[],
  userValue: {
    drawing: {
      description: '',
      entity_id: 'All',
      value: -1
    } as DataForDropdown,
    job: {
      description: '',
      value: null
    } as ParameterOption
  },
  error: {
    message: '',
    statusCode: null,
    open: false
  } as ErrorLog
}

const commonSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSearchQuery(state, { payload }: PayloadAction<string>) {
      state.searchQuery = payload
    },
    setEntity(state, { payload }: PayloadAction<Entity>) {
      state.entity = payload
    },
    setLoadingTable(state, { payload }: PayloadAction<boolean>) {
      state.loading.table = payload
    },
    setLoadingPage(state, { payload }: PayloadAction<boolean>) {
      state.loading.page = payload
    },
    setTableState(state, { payload }: PayloadAction<Partial<ListData>>) {
      state.tableState = {
        ...state.tableState,
        ...payload
      }
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload
      state.messageState.status = 'error'
      state.messageState.display = true
    },
    setSuccessMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload
      state.messageState.status = 'success'
      state.messageState.display = true
    },
    setDisplayMessage(state, action: PayloadAction<boolean>) {
      state.messageState.display = action.payload
    },
    setEditRows(state, { payload }: PayloadAction<any[]>) {
      state.editRows = payload
    },
    setUserValueDrawing(state, { payload }: PayloadAction<DataForDropdown>) {
      state.userValue.drawing = payload
    },
    setUserValueJob(state, { payload }: PayloadAction<ParameterOption>) {
      state.userValue.job = payload
    },
    resetUserValue(state) {
      state.userValue = initialState.userValue
    },
    setSelectedRows(state, { payload }: PayloadAction<number[]>) {
      state.selectedRows = payload
    },
    resetMessageState(state) {
      state.messageState = initialState.messageState
    },
    setCurrentLanguage(state, { payload }: PayloadAction<ParameterOption>) {
      state.currentLanguage = payload
    },
    setError(state, { payload }: PayloadAction<{ message: string; status: number }>) {
      const { message, status } = payload
      if (status === StatusCode.BAD_REQUEST && message !== 'Bad request') {
        state.messageState.message = message
        state.messageState.status = 'error'
        state.messageState.display = true
        return
      }
      state.error = {
        message,
        statusCode: status || 'unknow',
        open: true
      }
    },
    setOpenErrorDialog(state, { payload }: PayloadAction<boolean>) {
      state.error.open = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

// Selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectSearchQuery = createSelector(selectState, (state) => state.searchQuery)
export const selectEntity = createSelector(selectState, (state) => state.entity)
export const selectLoading = createSelector(selectState, (state) => state.loading)
export const selectTableState = createSelector(selectState, (state) => state.tableState)
export const selectMessageState = createSelector(selectState, (state) => state.messageState)

export const selectUserValueDrawing = createSelector(selectState, (state) => state.userValue.drawing)
export const selectUserValueJob = createSelector(selectState, (state) => state.userValue.job)

export const selectEditRows = createSelector(selectState, (state) => state.editRows)

export const selectSelectedRows = createSelector(selectState, (state) => state.selectedRows)

export const selectCurrentLanguage = createSelector(selectState, (state) => state.currentLanguage)
export const selectError = createSelector(selectState, (state) => state.error)

export const { actions } = commonSlice

// Saga actions
export const sagaExecuteOperation = createAction<{
  entity: Entity
  operation: string
  operationList: number[] | PayloadOperation[]
}>(`${name}/${actionTypes.EXECUTE_OPERATION}`)
export const sagaGetHistoryLogs = createAction<{ entityId: number; entity: Entity }>(
  `${name}/${actionTypes.GET_HISTORY}`
)
export const sagaUpdateMultiple = createAction<any>(`${name}/${actionTypes.UPDATE_MULTIPLE}`)
export const sagaCancelBackgroundJob = createAction<string>(`${name}/CANCEL_BACKGROUND_JOB`)

export default commonSlice
