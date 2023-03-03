import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { RootReducerType } from './rootReducer'
import type { DataForDropdown, Entity, ParameterOption, PayloadOperation, HistoryLog } from '@/types/Common'
import type {
  SpecificationInitDataForCE,
  SpecificationInitDataForList,
  SpecificationDetail
} from '@/types/Specification'

export const name: Entity = 'specification'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const specificationDetail = {
  job_id: null,
  drawing_id: null,
  descriptions: [],
  spec_id: null,
  additional_attributes: {}
} as SpecificationDetail

const initialState = {
  initDataForList: {
    jobs: [],
    permissions: {
      specification: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as SpecificationInitDataForList,
  dataList: [],
  dialogState: {
    open: false,
    loading: false,
    tab: 0,
    historyLogs: [] as HistoryLog[]
  },
  initDataForCE: {
    parameters: {
      PLLA: [],
      SSAT: []
    },
    wiki_page: ''
  } as SpecificationInitDataForCE,
  detail: specificationDetail
}

const specificationSlice = createSlice({
  name,
  initialState,
  reducers: {
    setInitDataForList(state, { payload }: PayloadAction<SpecificationInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<SpecificationInitDataForCE>) {
      state.initDataForCE = payload
    },
    setDataList(state, { payload }) {
      state.dataList = payload
    },
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setDialogState(state, { payload }) {
      state.dialogState = { ...state.dialogState, ...payload }
    },
    setDialogStateOpen(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.open = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setDetail(state, { payload }) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    resetDetail(state, { payload }: PayloadAction<{ userJob: ParameterOption }>) {
      const { userJob } = payload
      state.detail = { ...initialState.detail, job_id: userJob.value }
    },
    setDialogStateTab(state, { payload }: PayloadAction<number>) {
      state.dialogState.tab = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = specificationSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaChangeUserJob = createAction<ParameterOption>(`${name}/${actionTypes.CHANGE_USER_JOB}`)
export const sagaChangeUserDrawing = createAction<DataForDropdown>(`${name}/${actionTypes.CHANGE_USER_DRAWING}`)
export const sagaGenerateCode = createAction<{ formData: SpecificationDetail; drawing: DataForDropdown }>(
  `${name}/${actionTypes.GET_GENERATE_CODE}`
)
export const sagaRemove = createAction<PayloadOperation[]>(`${name}/${actionTypes.REMOVE}`)
export const sagaUpdate = createAction<{ id: number; formData: SpecificationDetail }>(`${name}/${actionTypes.UPDATE}`)
export const sagaCreate = createAction<SpecificationDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaOpenDrawingDialog = createAction<SpecificationDetail>(`${name}/OPEN_DRAWING_DIALOG`)

// Selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.specification)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectParameters = createSelector(selectState, ({ initDataForCE }) => initDataForCE.parameters)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectDataList = createSelector(selectState, (state) => state.dataList)

export default specificationSlice
