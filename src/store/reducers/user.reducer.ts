import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { format as formatDate } from 'date-fns'
import { getDefaultValues } from '@/utils/getDefaultValues'
import { DATE_FORMAT, actionTypes } from '@/utils/constant'

import type { UserItem, UserPermissions, UserInitDataForList, UserInitDataForCE, UserDetail } from '@/types/User'
import type { Entity, HistoryLog } from '@/types/Common'
import type { RootReducerType } from './rootReducer'

export const name: Entity = 'user'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

const initialState = {
  dataList: [] as UserItem[],
  initDataForList: {
    permissions: {
      user: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as UserInitDataForList,
  initDataForCE: {
    groups: [],
    jobs: [],
    parameters: {
      PLLA: [],
      PUCO: []
    },
    wiki_page: '',
    timezones: []
  } as UserInitDataForCE,
  dialogState: {
    open: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  },
  resetPwdDialog: {
    open: false,
    loading: false
  },
  detail: {
    user_id: '',
    email: null,
    puco: null,
    first_name: '',
    last_name: '',
    time_zone: '',
    user_abb: '',
    login_page: '',
    valid_from: formatDate(new Date(), DATE_FORMAT),
    default_language: null,
    valid_until: null,
    groups: [],
    job_access: [],
    password: '',
    confirm_password: ''
  } as UserDetail
}

const userSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, { payload }: PayloadAction<UserItem[]>) {
      state.dataList = payload
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
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<UserInitDataForList>) {
      state.initDataForList = payload
    },
    setPermissions(state, { payload }: PayloadAction<UserPermissions>) {
      state.initDataForList.permissions.user = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<UserInitDataForCE>) {
      state.initDataForCE = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<UserDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setResetPwdDialog(state, { payload }: PayloadAction<Partial<typeof initialState.resetPwdDialog>>) {
      state.dialogState = {
        ...state.dialogState,
        ...payload
      }
    },
    setResetPwdDialogOpen(state, { payload }: PayloadAction<boolean>) {
      state.resetPwdDialog.open = payload
    },
    setResetPwdDialogLoading(state, { payload }: PayloadAction<boolean>) {
      state.resetPwdDialog.loading = payload
    },
    resetDetail(state) {
      const detailDefaultValue = getDefaultValues(
        state.initDataForCE,
        {
          default_language: 'parameters.PLLA',
          puco: 'parameters.PUCO',
          time_zone: 'timezones'
        },
        initialState.detail
      )
      state.detail = { ...detailDefaultValue }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

// Actions
export const { actions } = userSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaCreate = createAction<UserDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; formData: UserDetail }>(`${name}/${actionTypes.UPDATE}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaResetPassword = createAction<{ password: string; confirm_password: string }>(`${name}/RESET_PASSWORD`)

// Selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.user)

export const selectResetPwdDialog = createSelector(selectState, (state) => state.resetPwdDialog)

export const selectDetail = createSelector(selectState, (state) => state.detail)

export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export default userSlice
