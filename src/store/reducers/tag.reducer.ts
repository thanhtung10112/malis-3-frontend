import { actionTypes } from '@/utils/constant'
import { createAction, createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import type { Entity, ParameterOption, DataForDropdown, PayloadOperation } from '@/types/Common'
import type { RootReducerType } from './rootReducer'
import type { TagInitDataForList } from '@/types/Tag'

export const name: Entity = 'element'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  initDataForList: {
    jobs: [],
    permissions: {
      element: null
    },
    wiki_page: '',
    column_tooltips: {}
  } as TagInitDataForList,
  dataList: []
}

const tagSlice = createSlice({
  name,
  initialState,
  reducers: {
    setInitDataForList(state, { payload }: PayloadAction<TagInitDataForList>) {
      state.initDataForList = payload
    },
    setDataList(state, { payload }) {
      state.dataList = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = tagSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaChangeUserJob = createAction<ParameterOption>(`${name}/${actionTypes.CHANGE_USER_JOB}`)
export const sagaChangeUserSchematic = createAction<DataForDropdown>(`${name}/CHANGE_USER_SCHEMATIC`)

export const sagaRemove = createAction<PayloadOperation[]>(`${name}/${actionTypes.REMOVE}`)
export const sagaChangeUserDrawing = createAction<DataForDropdown>(`${name}/${actionTypes.CHANGE_USER_DRAWING}`)

// Selectors
export const selectState = (state: RootReducerType) => state[name]

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.element)

export const selectSpecification = createSelector(selectState, (state) => state.initDataForList.permissions.element)

export const selectDataList = createSelector(selectState, (state) => state.dataList)

export default tagSlice
