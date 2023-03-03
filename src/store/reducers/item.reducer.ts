import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { Item, ItemInitDataForList } from '@/types/Item'
import type { RootReducerType } from './rootReducer'
import type { DataForDropdown, Entity, ParameterOption, PayloadOperation } from '@/types/Common'

export const name: Entity = 'item'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  dataList: [] as Item[],
  initDataForList: {
    permissions: {
      item: null
    },
    jobs: [],
    wiki_page: '',
    column_tooltips: {}
  } as ItemInitDataForList
}

const itemSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, { payload }: PayloadAction<Item[]>) {
      state.dataList = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<ItemInitDataForList>) {
      state.initDataForList = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})
// Actions
export const { actions } = itemSlice

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaChangeUserJob = createAction<{ optionValue: ParameterOption; confirm: string }>(
  `${name}/${actionTypes.CHANGE_USER_JOB}`
)
export const sagaRemove = createAction<PayloadOperation[]>(`${name}/${actionTypes.REMOVE}`)
export const sagaChangeUserDrawing = createAction<{ optionValue: DataForDropdown; confirm: string }>(
  `${name}/${actionTypes.CHANGE_USER_DRAWING}`
)

// selector
const selectState = (state: RootReducerType) => state[name]
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.item)
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export default itemSlice
