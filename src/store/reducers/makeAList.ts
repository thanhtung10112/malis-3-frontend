import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit'
import { RootReducerType } from './rootReducer'
export const resetState = createAction('makeAList/RESET_STATE')

export type FilterType = 'own' | 'shared' | 'system'

export const presetDetail = {
  id: null,
  name: '',
  entity: '',
  description: '',
  is_user_default: false,
  is_shared: false,
  is_system_default: false,
  columns_displayed: [],
  sort_conditions: [],
  where_conditions: {
    conjunction: 'AND',
    type: 'group',
    conditions: []
  },
  ignore_case: false,
  distinct: false,
  created_by: '',
  created_at: '',
  updated_by: '',
  updated_at: ''
}

export const systemPreset = {
  id: null,
  name: ''
}

export const permissions = {
  update_system_default_presets: false
}

export const initialState = {
  isOpen: false,
  isEditMode: false,
  entity: '',
  systemPreset,
  presetDetail,
  presetDefault: presetDetail,
  presetList: [],
  permissions,
  filterType: 'own' as FilterType,
  initData: {
    columns: [],
    comparators: [],
    logicalOperators: [],
    sortOptions: []
  },
  loading: {
    table: false,
    dialog: false
  },
  saveAsForm: {
    open: false,
    clearError: false,
    error: ''
  },
  malForm: {
    clearError: false,
    error: ''
  }
}
const makeAListReducer = createSlice({
  name: 'makeAList',
  initialState,
  reducers: {
    setOpen(state, action) {
      state.isOpen = action.payload
    },
    setIsEditMode(state, action) {
      state.isEditMode = action.payload
    },
    setPresetDetail(state, action) {
      state.presetDetail = {
        ...state.presetDetail,
        ...action.payload
      }
    },
    resetPresetDetail(state) {
      state.presetDetail = {
        ...presetDetail,
        entity: state.presetDetail.entity
      }
    },
    setPresetList(state, action) {
      state.presetList = action.payload
    },
    setFilterType(state, action: PayloadAction<FilterType>) {
      state.filterType = action.payload
    },
    setInitData(state, action) {
      state.initData = action.payload
    },
    setSystemPreset(state, action) {
      state.systemPreset = action.payload
    },
    setPresetDefault(state, action) {
      state.presetDefault = action.payload
    },
    setPermissions(state, action) {
      state.permissions = action.payload
    },
    setLoadingTable(state, action: PayloadAction<boolean>) {
      state.loading.table = action.payload
    },
    setLoadingDialog(state, action: PayloadAction<boolean>) {
      state.loading.dialog = action.payload
    },
    setSaveAsForm(state, action: PayloadAction<Partial<typeof initialState.saveAsForm>>) {
      state.saveAsForm = {
        ...state.saveAsForm,
        ...action.payload
      }
    },
    setMalForm(state, action: PayloadAction<Partial<typeof initialState.malForm>>) {
      state.malForm = {
        ...state.malForm,
        ...action.payload
      }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const {
  setOpen,
  setIsEditMode,
  setPresetDetail,
  resetPresetDetail,
  setPresetList,
  setFilterType,
  setInitData,
  setSystemPreset,
  setPresetDefault,
  setPermissions,
  setLoadingTable,
  setSaveAsForm,
  setLoadingDialog,
  setMalForm
} = makeAListReducer.actions

export const open = createAction('makeAList/OPEN')
export const create = createAction<typeof presetDetail>('makeAList/CREATE')
export const getList = createAction<string>('makeAList/GET_LIST')
export const getDetail = createAction<any>('makeAList/GET_DETAIL')
export const getInitData = createAction('makeAList/GET_INIT_DATA')
export const share = createAction<{ id: number; shared: boolean }>('makeAList/SHARE')
export const update = createAction<typeof presetDetail>('makeAList/UPDATE')
export const remove = createAction<{ entity: string }>('makeAList/REMOVE')
export const clearDefault = createAction('makeAList/CLEAR_DEFAULT')
export const exportMakeAList = createAction<{
  destination: string
  displayedColumns: any[]
  sortConditions: any[]
  whereCondtions: any
  distinct: boolean
  ignoreCase: boolean
}>('makeAList/EXPORT')
export const changeFilterType = createAction<string>('makeAList/CHANGE_FILTER_TYPE')
export const saveAs = createAction<typeof presetDetail>('makeAList/SAVE_AS')
export const stopMakeAList = createAction<{ celery_id: string }>('makeAList/STOP')

export const selectIsOpen = (state: RootReducerType) => state.makeAList.isOpen
export const selectIsEditMode = (state: RootReducerType) => state.makeAList.isEditMode

export const selectPresetDetail = (state: RootReducerType) => state.makeAList.presetDetail
export const selectColumnDisplay = (state: RootReducerType) => state.makeAList.presetDetail.columns_displayed
export const selectWhereConditions = (state: RootReducerType) => state.makeAList.presetDetail.where_conditions
export const selectSortConditions = (state: RootReducerType) => state.makeAList.presetDetail.sort_conditions

export const selectPresetList = (state: RootReducerType) => state.makeAList.presetList
export const selectPresetDefault = (state: RootReducerType) => state.makeAList.presetDefault
export const selectSystemPreset = (state: RootReducerType) => state.makeAList.systemPreset
export const selectFilterType = (state: RootReducerType) => state.makeAList.filterType
export const selectPermissions = (state: RootReducerType) => state.makeAList.permissions
export const selectEntity = (state: RootReducerType) => state.makeAList.entity

export const selectColumnsData = (state: RootReducerType) => state.makeAList.initData.columns
export const selectComparatorsData = (state: RootReducerType) => state.makeAList.initData.comparators
export const selectLogicalOperatorsData = (state: RootReducerType) => state.makeAList.initData.logicalOperators
export const selectSortOptionsData = (state: RootReducerType) => state.makeAList.initData.sortOptions

export const selectLoadingTable = (state: RootReducerType) => state.makeAList.loading.table
export const selectLoadingDialog = (state: RootReducerType) => state.makeAList.loading.dialog
export const selectSaveAsForm = (state: RootReducerType) => state.makeAList.saveAsForm
export const selectMalForm = (state: RootReducerType) => state.makeAList.malForm

export default makeAListReducer.reducer
