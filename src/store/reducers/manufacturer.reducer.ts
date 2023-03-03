import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { Entity } from '@/types/Common'
import type { RootReducerType } from './rootReducer'
import type {
  ManufacturerInitDataForCE,
  ManufacturerInitDataForList,
  ManufacturerItem,
  ManufacturerPermissions
} from '@/types/Manufacturer'

export const name: Entity = 'manufacturer'

export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  dialogState: {
    open: false,
    loading: false
  },
  dataList: [] as ManufacturerItem[],
  detail: {
    manufacturer_id: null,
    name: ''
  } as ManufacturerItem,
  initDataForCE: {
    next_code: null,
    wiki_page: ''
  } as ManufacturerInitDataForCE,
  initDataForList: {
    permissions: {
      manufacturer: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as ManufacturerInitDataForList
}

const manufacturer = createSlice({
  name,
  initialState,
  reducers: {
    setDialogState(state, { payload }) {
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
    setDataList(state, { payload }: PayloadAction<ManufacturerItem[]>) {
      state.dataList = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<ManufacturerItem>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setInitDataForList(state, { payload }: PayloadAction<ManufacturerInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<ManufacturerInitDataForCE>) {
      state.initDataForCE = payload
    },
    setPermissions(state, { payload }: PayloadAction<ManufacturerPermissions>) {
      state.initDataForList.permissions.manufacturer = payload
    },
    setNextCode(state, { payload }: PayloadAction<number>) {
      state.initDataForCE.next_code = payload
    },
    resetDetail(state) {
      state.detail = {
        ...initialState.detail,
        manufacturer_id: state.initDataForCE.next_code
      }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

// Actions
export const { actions } = manufacturer

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaCreate = createAction<ManufacturerItem>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; formData: ManufacturerItem }>(`${name}/${actionTypes.UPDATE}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaGenerateCode = createAction<ManufacturerItem>(`${name}/${actionTypes.GET_GENERATE_CODE}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)

// Selectors
export const selectState = (state: RootReducerType) => state[name]

export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.manufacturer)

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)

export default manufacturer
