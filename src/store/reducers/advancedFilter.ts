import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit'

import type { RootReducerType } from './rootReducer'
import type { Entity, FilterType } from '@/types/Common'
import type {
  AdvancedFilterPermission,
  AdvancedFilter,
  AdvancedFilterParameter,
  SystemFilter
} from '@/types/AdvancedFilter'

export const name = 'advancedFilter'

export const resetState = createAction(name + '/RESET_STATE')

export const initialState = {
  isOpen: false,
  isEditMode: false,
  isOpenFilterDetail: false,
  isExpanedSection: false,
  permissions: {
    update_system_default_presets: false
  } as AdvancedFilterPermission,
  systemPreset: {
    id: null,
    name: ''
  } as SystemFilter,
  defaultFilter: {
    id: null,
    name: '',
    entity: '',
    is_system_default: false,
    where_conditions: null,
    sort_conditions: null
  } as AdvancedFilter,
  filterPresetList: [] as AdvancedFilter[],
  filterType: 'own' as FilterType,
  initData: {
    columns: [],
    comparators: [],
    sortOptions: [],
    logicalOperators: []
  } as AdvancedFilterParameter,
  filterDetail: {
    name: '',
    entity: '',
    is_shared: false,
    is_system_default: false,
    is_user_default: false,
    sort_conditions: null,
    where_conditions: null
  } as AdvancedFilter,
  saveAsForm: {
    open: false,
    clearError: false,
    error: ''
  },
  afForm: {
    clearError: false,
    error: ''
  },
  loading: {
    table: false,
    dialog: false,
    section: false
  }
}

const advancedFilter = createSlice({
  name,
  initialState,
  reducers: {
    setOpenAdvanceSearch(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload
    },
    setDefaultFilter(state, action: PayloadAction<Partial<AdvancedFilter>>) {
      state.defaultFilter = {
        ...state.defaultFilter,
        ...action.payload
      }
    },
    setFilterPresetList(state, action: PayloadAction<AdvancedFilter[]>) {
      state.filterPresetList = action.payload
    },
    setFilterType(state, action: PayloadAction<FilterType>) {
      state.filterType = action.payload
    },
    setOpenFilterDetail(state, action: PayloadAction<boolean>) {
      state.isOpenFilterDetail = action.payload
    },
    setEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload
    },
    setInitData(state, action: PayloadAction<AdvancedFilterParameter>) {
      state.initData = action.payload
    },
    setFilterDetail(state, action: PayloadAction<Partial<AdvancedFilter>>) {
      state.filterDetail = {
        ...state.filterDetail,
        ...action.payload
      }
    },
    setExpandedSection(state, action: PayloadAction<boolean>) {
      state.isExpanedSection = action.payload
    },
    setPermissions(state, action: PayloadAction<AdvancedFilterPermission>) {
      state.permissions = action.payload
    },
    setSystemPreset(state, action: PayloadAction<SystemFilter>) {
      state.systemPreset = action.payload
    },
    setSaveAsForm(state, action: PayloadAction<Partial<typeof initialState.saveAsForm>>) {
      state.saveAsForm = {
        ...state.saveAsForm,
        ...action.payload
      }
    },
    setAfForm(state, action: PayloadAction<Partial<typeof initialState.afForm>>) {
      state.afForm = {
        ...state.afForm,
        ...action.payload
      }
    },
    setLoadingTable(state, action: PayloadAction<boolean>) {
      state.loading.table = action.payload
    },
    setLoadingDialog(state, action: PayloadAction<boolean>) {
      state.loading.dialog = action.payload
    },
    setLoadingSection(state, { payload }: PayloadAction<boolean>) {
      state.loading.section = payload
    },
    resetFilterDetail(state, { payload }: PayloadAction<Entity>) {
      state.filterDetail = {
        name: '',
        entity: payload,
        is_shared: false,
        is_system_default: false,
        is_user_default: false,
        sort_conditions: [],
        where_conditions: {
          conjunction: 'AND',
          type: 'group',
          conditions: []
        }
      }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const create = createAction(name + '/CREATE')
export const getList = createAction(name + '/GET_LIST')
export const clearDefaultFilter = createAction(name + '/CLEAR_DEFAULT_FILTER')
export const getDefaultFilter = createAction(name + '/GET_DEFAULT_FILTER')
export const changeFilterType = createAction<FilterType>(name + '/CHANGE_FILTER_TYPE')
export const open = createAction(name + '/OPEN')
export const apply = createAction(name + '/APPLY')
export const close = createAction(name + '/CLOSE')
export const remove = createAction(name + '/REMOVE')
export const getDetail = createAction<number>(name + '/GET_DETAIL')
export const update = createAction(name + '/UPDATE')
export const share = createAction<{ id: number; is_shared: boolean }>(name + '/SHARE')
export const saveAs = createAction<string>(name + '/SAVE_AS')

export const {
  setOpenAdvanceSearch,
  setDefaultFilter,
  setFilterPresetList,
  setFilterType,
  setOpenFilterDetail,
  setEditMode,
  setInitData,
  setFilterDetail,
  setExpandedSection,
  resetFilterDetail,
  setPermissions,
  setSystemPreset,
  setSaveAsForm,
  setAfForm,
  setLoadingDialog,
  setLoadingTable,
  setLoadingSection
} = advancedFilter.actions

// Selector
export const advanceSearchSelector = (state: RootReducerType) => state.advancedFilter

export const selectEditMode = (state: RootReducerType) => state.advancedFilter.isEditMode

export const selectDefaultFilter = (state: RootReducerType) => state.advancedFilter.defaultFilter

export const selectFilterType = (state: RootReducerType) => state.advancedFilter.filterType

export const selectIsExpanedSection = (state: RootReducerType) => state.advancedFilter.isExpanedSection

export const selectColumn = (state: RootReducerType) => state.advancedFilter.initData.columns
export const selectComparator = (state: RootReducerType) => state.advancedFilter.initData.comparators
export const selectSortOptions = (state: RootReducerType) => state.advancedFilter.initData.sortOptions

export const selectFilterDetail = (state: RootReducerType) => state.advancedFilter.filterDetail
export const selectConditionTree = (state: RootReducerType) => state.advancedFilter.filterDetail.where_conditions
export const selectSortConditions = (state: RootReducerType) => state.advancedFilter.filterDetail.sort_conditions
export const selectUserDefault = (state: RootReducerType) => state.advancedFilter.filterDetail.is_user_default
export const selectFilterDetailName = (state: RootReducerType) => state.advancedFilter.filterDetail.name
export const selectListData = (state: RootReducerType) => state.advancedFilter.filterPresetList

export const selectPermissions = (state: RootReducerType) => state.advancedFilter.permissions

export const selectSystemPreset = (state: RootReducerType) => state.advancedFilter.systemPreset

export const selectOpenAdvanceSearch = (state: RootReducerType) => state.advancedFilter.isOpen

export const selectAfForm = (state: RootReducerType) => state.advancedFilter.afForm
export const selectSaveAsForm = (state: RootReducerType) => state.advancedFilter.saveAsForm
export const selectLoading = (state: RootReducerType) => state.advancedFilter.loading
export const selectFilterData = (state: RootReducerType) => {
  const { where_conditions: whereConditions, sort_conditions: sortConditions } = state.advancedFilter.defaultFilter
  const where_conditions = whereConditions ? JSON.stringify(whereConditions) : null
  const sort_conditions = sortConditions ? JSON.stringify(sortConditions) : null
  return { where_conditions, sort_conditions }
}

export default advancedFilter.reducer
