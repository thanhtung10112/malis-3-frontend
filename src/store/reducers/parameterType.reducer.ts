import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import _ from 'lodash'

import { actionTypes } from '@/utils/constant'
import createExtraActions from '@/utils/createExtraActions'

import type { Entity, HistoryLog } from '@/types/Common'
import type { RootReducerType } from './rootReducer'
import type {
  ParameterTypeItem,
  ParameterTypeInstace,
  ParameterTypeInitDataForList,
  ParameterTypeInitDataForCE,
  ParameterTypePermissions,
  ParameterTypePermission
} from '@/types/ParameterType'

export const name: Entity = 'parameter_type'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)
export const initialState = {
  dataList: [],
  detail: {
    type_id: '',
    category: 1,
    is_multilingual: false,
    description: '',
    attributes: '',
    nbr_default: 0
  } as ParameterTypeInstace,
  dialogState: {
    open: false,
    editMode: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  },
  initDataForList: {
    permissions: {
      application_parameter_type: null,
      developer_parameter_type: null,
      simple_parameter_type: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as ParameterTypeInitDataForList,
  initDataForCE: {
    categories: [],
    wiki_page: ''
  } as ParameterTypeInitDataForCE
}

const parameterTypeSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, { payload }: PayloadAction<ParameterTypeItem[]>) {
      state.dataList = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<ParameterTypeInstace>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
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
    setDialogStateEditMode(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.editMode = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<ParameterTypeInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<ParameterTypeInitDataForCE>) {
      state.initDataForCE = payload
    },
    setPermissions(state, { payload }: PayloadAction<ParameterTypePermissions>) {
      state.initDataForList.permissions = payload
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

export const { actions } = parameterTypeSlice

export const extraActions = createExtraActions(name, {
  getList: actionTypes.GET_LIST,
  create: actionTypes.CREATE,
  update: actionTypes.UPDATE,
  openUpdateDialog: actionTypes.OPEN_UPDATE_DIALOG,
  openCreateDialog: actionTypes.OPEN_CREATE_DIALOG,
  executeOperation: actionTypes.EXECUTE_OPERATION,
  closeDialog: actionTypes.CLOSE_DIALOG
})

const selectState = (state: RootReducerType) => state[name]
export const selectDialogState = createSelector(selectState, ({ dialogState }) => dialogState)
export const selectDataList = createSelector(selectState, ({ dataList }) => dataList)
export const selectDetail = createSelector(selectState, ({ detail }) => detail)
export const selectInitDataForList = createSelector(selectState, ({ initDataForList }) => initDataForList)
export const selectInitDataForCE = createSelector(selectState, ({ initDataForCE }) => initDataForCE)

export const selectPermissions = createSelector(selectState, ({ initDataForList }) => {
  const { permissions } = initDataForList
  if (_.isNull(permissions.application_parameter_type)) {
    return null
  }
  const getPermissionBaseOnName = (name: keyof ParameterTypePermission) =>
    permissions.application_parameter_type[name] ||
    permissions.developer_parameter_type[name] ||
    permissions.simple_parameter_type[name]
  return {
    view: getPermissionBaseOnName('view'),
    create: getPermissionBaseOnName('create'),
    disable_enable: getPermissionBaseOnName('disable_enable'),
    delete: getPermissionBaseOnName('delete')
  }
})

export const selectEditPermission = createSelector(selectState, ({ initDataForList, detail }) => {
  const { permissions } = initDataForList
  const { category } = detail
  if (_.isNull(permissions.application_parameter_type)) {
    return false
  }
  return (
    (category === 1 && permissions.simple_parameter_type.edit) ||
    (category === 2 && permissions.application_parameter_type.edit) ||
    (category === 3 && permissions.developer_parameter_type.edit)
  )
})
export default parameterTypeSlice
