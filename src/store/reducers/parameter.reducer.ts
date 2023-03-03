import { createSlice, PayloadAction, createAction, createSelector } from '@reduxjs/toolkit'
import * as constant from '@/utils/constant'
import _ from 'lodash'

import createExtraActions from '@/utils/createExtraActions'

import {
  ParameterInitDataForCE,
  ParameterInitDataForList,
  ParameterInstance,
  ParameterPermissions,
  ParameterType
} from '@/types/Parameter'
import { RootReducerType } from './rootReducer'
import { HistoryLog } from '@/types/Common'

const name = 'parameter'
export const resetState = createAction(`${name}/${constant.actionTypes.RESET_STATE}`)

const initialState = {
  dataList: [] as ParameterInstance[],
  detail: {
    description: '',
    is_default: false,
    order: null,
    parameter_id: '',
    parameter_type_id: null, // get from params in the url
    properties: {},
    descriptions: []
  } as ParameterInstance,
  initDataForList: {
    permissions: {
      application_parameter: null,
      developer_parameter: null,
      simple_parameter: null
    },
    column_tooltips: {}
  } as ParameterInitDataForList,
  initDataForCE: {
    attributes: '',
    categories: [],
    is_multilingual: false,
    param_type_id: null,
    param_type_raw_id: '',
    param_type_specific_config: null,
    parameters: {
      PLLA: []
    }
  } as ParameterInitDataForCE,
  dialogState: {
    open: false,
    editMode: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  },
  parameterType: {
    category: null,
    id: null,
    type_id: ''
  } as ParameterType
}

const parameterSlice = createSlice({
  name,
  initialState,
  reducers: {
    setData(state, { payload }: PayloadAction<ParameterInstance[]>) {
      state.dataList = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<ParameterInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<ParameterInitDataForCE>) {
      state.initDataForCE = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<ParameterInstance>>) {
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
    setDialogStateOpen(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.open = payload
    },
    setDialogStateEditMode(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.editMode = payload
    },
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setParameterType(state, { payload }: PayloadAction<ParameterType>) {
      state.parameterType = payload
    },
    setPermissions(state, { payload }: PayloadAction<ParameterPermissions>) {
      state.initDataForList.permissions = payload
    },
    resetLocationDetail(state) {
      state.detail = {
        ...initialState.detail,
        parameter_type_id: state.detail.parameter_type_id
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
export const { actions } = parameterSlice

// Extra actions
export const extraActions = createExtraActions(name, {
  getList: constant.actionTypes.GET_LIST,
  create: constant.actionTypes.CREATE,
  update: constant.actionTypes.UPDATE,
  executeOperation: constant.actionTypes.EXECUTE_OPERATION,
  openCreateDialog: constant.actionTypes.OPEN_CREATE_DIALOG,
  openUpdateDialog: constant.actionTypes.OPEN_UPDATE_DIALOG,
  closeDialog: constant.actionTypes.CLOSE_DIALOG
})

// Selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectDetail = createSelector(selectState, (state) => state.detail)
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectInitParameter = createSelector(selectState, (state) => state.initDataForCE.parameters)
export const selectPermissions = createSelector(selectState, (state) => {
  const { category } = state.parameterType
  const { permissions } = state.initDataForList
  if (_.isNull(permissions.application_parameter)) {
    return null
  }
  const getPermissionBaseOnName = (name) =>
    (permissions.application_parameter[name] && category === 2) ||
    (permissions.developer_parameter[name] && category === 3) ||
    (permissions.simple_parameter[name] && category === 1)
  return {
    view: getPermissionBaseOnName('view'),
    create: getPermissionBaseOnName('create'),
    edit: getPermissionBaseOnName('edit'),
    delete: getPermissionBaseOnName('delete'),
    disable_enable: getPermissionBaseOnName('disable_enable')
  }
})

export const selectViewPermission = createSelector(selectState, ({ initDataForList }) => {
  const { permissions } = initDataForList
  return (
    permissions.application_parameter?.view ||
    permissions.developer_parameter?.view ||
    permissions.simple_parameter?.view
  )
})

export default parameterSlice
