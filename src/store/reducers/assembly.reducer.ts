import { createAction, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import type { DataForDropdown, Entity, ParameterOption, PayloadOperation } from '@/types/Common'
import type { AssemblyInitDataForList, AssemblyItem } from '@/types/Assembly'
import type { RootReducerType } from './rootReducer'

export const name: Entity = 'assembly'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

const initialState = {
  dataList: [] as AssemblyItem[],
  initDataForList: {
    jobs: [],
    permissions: {
      assembly: null
    },
    parameters: {
      PLLA: []
    },
    wiki_page: '',
    column_tooltips: {}
  } as AssemblyInitDataForList
}

const assemblySlice = createSlice({
  name,
  initialState,
  reducers: {
    setInitDataForList(state, { payload }: PayloadAction<AssemblyInitDataForList>) {
      state.initDataForList = payload
    },
    setDataList(state, { payload }: PayloadAction<AssemblyItem[]>) {
      state.dataList = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

export const { actions } = assemblySlice

export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaChangeUserJob = createAction<ParameterOption>(`${name}/${actionTypes.CHANGE_USER_JOB}`)
export const sagaChangeUserDrawing = createAction<DataForDropdown>(`${name}/${actionTypes.CHANGE_USER_DRAWING}`)
export const sagaRemove = createAction<PayloadOperation[]>(`${name}/${actionTypes.REMOVE}`)

export const selectState = (state: RootReducerType) => state[name]
export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.assembly)
export const selectDataList = createSelector(selectState, (state) => state.dataList)

export default assemblySlice
