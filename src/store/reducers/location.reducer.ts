import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { RootReducerType } from './rootReducer'
import type {
  LocationInitDataForList,
  LocationDetail,
  LocationInitDataForCE,
  LocationPermissions,
  LocationItem
} from '@/types/Location'
import type { HistoryLog } from '@/types/Common'

export const name = 'location'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  dataList: [] as LocationItem[],
  detail: {
    location_id: '',
    language: null,
    location_type: null,
    name: '',
    office_address1: '',
    office_address2: '',
    office_city: '',
    office_zip: '',
    office_state: '',
    office_country: null,
    office_phone: '',
    office_email: '',
    office_fax: '',
    workshop_address1: '',
    workshop_address2: '',
    workshop_city: '',
    workshop_phone: '',
    workshop_email: '',
    workshop_fax: '',
    comment: '',
    specialties: '',
    remark: '',
    additional_attributes: {}
  } as LocationDetail,
  dialogState: {
    open: false,
    loading: false,
    editMode: false,
    historyLogs: [] as HistoryLog[]
  },
  initDataForList: {
    permissions: {
      location: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as LocationInitDataForList,
  initDataForCE: {
    parameters: {
      CTRY: [], // country
      LOAT: [], // extended properties
      PLLA: [], // language
      PUCO: [], // puco
      SSPE: [], // specialties
      TYLO: [] // location type
    },
    next_code: '',
    wiki_page: ''
  } as LocationInitDataForCE
}

const locationSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, action: PayloadAction<LocationItem[]>) {
      state.dataList = action.payload
    },
    setPermissions(state, { payload }: PayloadAction<LocationPermissions>) {
      state.initDataForList.permissions.location = payload
    },
    setDialogState(state, { payload }: PayloadAction<Partial<typeof initialState.dialogState>>) {
      state.dialogState = {
        ...state.dialogState,
        ...payload
      }
    },
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setDialogStateOpen(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.open = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setDialogStateEditMode(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.editMode = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<LocationDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setInitDataForList(state, { payload }: PayloadAction<LocationInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<LocationInitDataForCE>) {
      state.initDataForCE = payload
    },
    setNextCode(state, { payload }: PayloadAction<string>) {
      state.initDataForCE.next_code = payload
    },
    resetDetail(state) {
      state.detail = { ...initialState.detail }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = locationSlice

export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCreate = createAction<LocationDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; location: LocationDetail }>(`${name}/${actionTypes.UPDATE}`)
export const sagaGetNextCode = createAction<LocationDetail>(`${name}/${actionTypes.GET_GENERATE_CODE}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)

// Selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.location)

export default locationSlice
