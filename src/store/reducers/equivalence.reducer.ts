import { createSlice, PayloadAction, createAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { RootReducerType } from './rootReducer'
import type {
  EquivalenceInitDataForList,
  EquivalenceDetail,
  EquivalenceInitDataForCE,
  EquivalenceType
} from '@/types/Equivalence'

export const name = 'equivalence'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const dialogState = {
  open: false,
  loading: false
}

export const equivalenceDetail = {
  equiv_id: null,
  description: '',
  equiv_type: null,
  image: '',
  standards: []
} as EquivalenceDetail

export const initialState = {
  equivalenceType: '' as EquivalenceType,
  dialogState,
  dataList: [],
  initDataForList: {
    permissions: {
      manufacturing_standard: null,
      material_standard: null
    },
    wiki_page: {
      manufacturing_standard: '',
      material_standard: ''
    },
    column_tooltips: {
      manufacturing_standard: {},
      material_standard: {}
    }
  } as EquivalenceInitDataForList,
  initDataForCE: {
    parameters: {
      PLNO: []
    },
    next_code: 0,
    wiki_page: ''
  } as EquivalenceInitDataForCE,
  detail: equivalenceDetail
}

const equivalenceSlice = createSlice({
  name,
  initialState,
  reducers: {
    setEquivalenceType(state, { payload }: PayloadAction<EquivalenceType>) {
      state.equivalenceType = payload
    },
    setDialogState(state, { payload }: PayloadAction<Partial<typeof initialState.dialogState>>) {
      state.dialogState = {
        ...state.dialogState,
        ...payload
      }
    },
    setDialogStateOpen(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.open = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setDataList(state, { payload }: PayloadAction<EquivalenceDetail[]>) {
      state.dataList = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<EquivalenceDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setInitDataForCE(state, { payload }: PayloadAction<EquivalenceInitDataForCE>) {
      state.initDataForCE = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<EquivalenceInitDataForList>) {
      state.initDataForList = payload
    },
    resetDetail(state) {
      state.detail = { ...equivalenceDetail }
    },
    setNextCode(state, { payload }: PayloadAction<number>) {
      state.initDataForCE.next_code = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

// Actions
export const { actions } = equivalenceSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaCreate = createAction<FormData>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; formData: FormData }>(`${name}/${actionTypes.UPDATE}`)
export const sagaGetNextCode = createAction<EquivalenceDetail>(`${name}/${actionTypes.GET_NEXT_CODE}`)

// Selector
export const selectState = (state: RootReducerType) => state[name]
export const selectEquivalenceType = createSelector(selectState, (state) => state.equivalenceType)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectPermissions = createSelector(selectState, (state) => {
  const { initDataForList, equivalenceType } = state
  if (!equivalenceType) {
    return null
  }
  return initDataForList.permissions[equivalenceType]
})
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export default equivalenceSlice
