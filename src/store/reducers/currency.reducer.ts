import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { RootReducerType } from './rootReducer'
import type {
  CurrencyInitDataForCE,
  CurrencyDetail,
  CurrencyPermissions,
  CurrencyInitDataForList,
  BaseCurrency
} from '@/types/Currency'
import type { Entity, HistoryLog } from '@/types/Common'

export const name: Entity = 'currency'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const currencyDetail = {
  currency_id: '',
  description: '',
  multiplier: null,
  rate: '',
  round_to: null,
  base_currency: null,
  is_base_rate_mode: false
} as CurrencyDetail

const initialState = {
  dataList: [] as CurrencyDetail[],
  initDataForList: {
    permissions: {
      currency: null
    },
    base_currency_list: [],
    user_base_currency: {
      id: null,
      description: '',
      currency_id: ''
    },
    wiki_page: '',
    column_tooltips: {}
  } as CurrencyInitDataForList,
  initDataForCE: {
    multiplier_options: [],
    round_to_options: [],
    base_currency: {
      currency_id: '',
      id: null
    },
    wiki_page: ''
  } as CurrencyInitDataForCE,
  detail: currencyDetail,
  dialogState: {
    open: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  }
}

const currencySlice = createSlice({
  name,
  initialState,
  reducers: {
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
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setDataList(state, { payload }: PayloadAction<CurrencyDetail[]>) {
      state.dataList = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<CurrencyInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<CurrencyInitDataForCE>) {
      state.initDataForCE = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<CurrencyDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setPermissions(state, { payload }: PayloadAction<CurrencyPermissions>) {
      state.initDataForList.permissions.currency = payload
    },
    setUserBaseCurrency(state, { payload }: PayloadAction<BaseCurrency>) {
      state.initDataForList.user_base_currency = payload
    },
    resetDetail(state) {
      state.detail = {
        ...currencyDetail
      }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = currencySlice

// Saga actions

export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaCreate = createAction<CurrencyDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; formData: CurrencyDetail }>(`${name}/${actionTypes.UPDATE}`)
export const sagaChangeUserCurrency = createAction<BaseCurrency>(`${name}/CHANGE_USER_CURRENCY`)

export const selectState = (state: RootReducerType) => state[name]
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.currency)
export const selectUserBaseCurrency = createSelector(selectState, (state) => state.initDataForList.user_base_currency)

export default currencySlice
