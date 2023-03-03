import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import _ from 'lodash'
import { actionTypes } from '@/utils/constant'

import type { Entity, ParameterOption, HistoryLog } from '@/types/Common'
import type { RootReducerType } from './rootReducer'
import type {
  JobItem,
  JobDetail,
  JobInitDataForCE,
  UserGroupMapping,
  JobKeyMapping,
  JobPermissions,
  JobInitDataForList
} from '@/types/Job'

export const name: Entity = 'job'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const transferListState = {
  userAvailableList: [] as UserGroupMapping[],
  userGroup: [] as UserGroupMapping[],
  open: false
}

export const jobDetail: JobDetail = {
  job_id: '',
  equipment_type: null,
  language: null,
  erection_site: null,
  job_standard: [],
  people_responsible: [],
  squad_leader: [],
  drawings_responsible: [],
  contract_no: '',
  contract_desc: '',
  credit_letter: '',
  logo: null,
  additional_attributes: {},
  job_currencies: [],
  job_descriptions: [],
  job_users: [],
  job_expediting_dates: []
}

export const initialState = {
  dataList: [] as JobItem[],
  dialogState: {
    open: false,
    loading: false,
    historyLogs: [] as HistoryLog[]
  },
  selectedJobCategory: {
    description: '',
    id: null,
    parameter_id: ''
  } as ParameterOption,
  initDataForList: {
    job_categories: [],
    permissions: {
      job: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as JobInitDataForList,
  initDataForCE: {
    currencies: [],
    group_map: {
      job_all: '',
      job_drawing: '',
      job_responsible: '',
      job_squad_leader: ''
    },
    erection_sites: [],
    parameters: {
      EQTY: [],
      JOAT: [],
      PLLA: [],
      PLNO: []
    },
    tooltip: '<span></span>',
    job_template: jobDetail,
    wiki_page: ''
  } as JobInitDataForCE,
  transferListState,
  keyMapping: null as JobKeyMapping,
  detail: jobDetail
}

const jobSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, { payload }: PayloadAction<JobItem[]>) {
      state.dataList = payload
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
    setInitDataForList(state, { payload }: PayloadAction<JobInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<JobInitDataForCE>) {
      state.initDataForCE = payload
    },
    setOpenTransferList(state, { payload }: PayloadAction<boolean>) {
      state.transferListState.open = payload
    },
    setTransferUserAvailableList(state, { payload }: PayloadAction<UserGroupMapping[]>) {
      state.transferListState.userAvailableList = payload
    },
    setTransferListUserGroup(state, { payload }: PayloadAction<UserGroupMapping[]>) {
      state.transferListState.userGroup = payload
    },
    setDetail(state, { payload }) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setSelectedCategory(state, { payload }: PayloadAction<ParameterOption>) {
      state.selectedJobCategory = payload
    },
    setKeyMapping(state, { payload }: PayloadAction<JobKeyMapping>) {
      state.keyMapping = payload
    },
    closeTransferList(state) {
      state.transferListState = {
        ...transferListState,
        userGroup: state.transferListState.userGroup
      }
    },
    setPermissions(state, { payload }: PayloadAction<JobPermissions>) {
      state.initDataForList.permissions.job = payload
    },
    resetDetail(state) {
      const jobStandard = state.initDataForCE.parameters.PLNO.map((item) =>
        _.pick(item, ['description', 'parameter_id', 'id'])
      ) as any
      state.detail = {
        ...jobDetail,
        job_standard: jobStandard
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
export const { actions } = jobSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaCreate = createAction<FormData>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; formData: FormData }>(`${name}/${actionTypes.UPDATE}`)
export const sagaGetUserGroupMapping = createAction<string>(`${name}/GET_USER_GROUP_MAPPING`)

// Selector
export const selectState = (state: RootReducerType) => state[name]
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectJobCategories = createSelector(selectState, (state) => state.initDataForList.job_categories)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.job)

export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectInitDataForCE = createSelector(selectState, (state) => state.initDataForCE)
export const selectTransferListState = createSelector(selectState, (state) => state.transferListState)

export const selectDetail = createSelector(selectState, (state) => state.detail)

export const selectKeyMapping = createSelector(selectState, (state) => state.keyMapping)

export const selectSelectedJobCategory = createSelector(selectState, (state) => state.selectedJobCategory)
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export default jobSlice
