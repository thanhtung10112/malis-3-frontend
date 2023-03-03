import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'

import { actionTypes } from '@/utils/constant'

import type { RootReducerType } from './rootReducer'
import type { Entity, HistoryLog } from '@/types/Common'
import type { GroupDetail, GroupInitDataForList, GroupInitDataForCE } from '@/types/Group'

export const name: Entity = 'group'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

const initialState = {
  dataList: [] as GroupDetail[],
  detail: {
    description: '',
    group_id: '',
    name: ''
  } as GroupDetail,
  dialogState: {
    open: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  },
  initDataForList: {
    permissions: {
      group: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as GroupInitDataForList,
  groupPermissions: {
    groups: [],
    permissions: []
  },
  initDataForCE: {
    wiki_page: ''
  } as GroupInitDataForCE
}

const groupSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, action: PayloadAction<GroupDetail[]>) {
      state.dataList = action.payload
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
    setDetail(state, { payload }: PayloadAction<Partial<GroupDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setGroupPermissions(state, action: any) {
      state.groupPermissions.groups = action.payload.groups
      state.groupPermissions.permissions = action.payload.permissions
    },
    setInitDataForList(state, { payload }: PayloadAction<GroupInitDataForList>) {
      state.initDataForList = payload
    },
    resetDetail(state) {
      state.detail = { ...initialState.detail }
    },
    setInitDataForCE(state, { payload }: PayloadAction<GroupInitDataForCE>) {
      state.initDataForCE = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = groupSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaCreate = createAction<GroupDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaUpdate = createAction<{ id: number; formData: GroupDetail }>(`${name}/${actionTypes.UPDATE}`)

// Permissions saga actions
export const sagaGetGroupPermissions = createAction(`${name}/GET_PERMISSIONS`)
export const sagaUpdateGroupPermissions = createAction<any>(`${name}/UPDATE_PERMISSIONS`)

// Selector
export const selectState = (state: RootReducerType) => state[name]

export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.group)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)

export const selectGroupPermissions = createSelector(selectState, (group) => group.groupPermissions)

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export default groupSlice
