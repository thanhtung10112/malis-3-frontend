import { createSlice, createSelector, PayloadAction, createAction } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'
import _ from 'lodash'
import { getDefaultValues } from '@/utils/getDefaultValues'
import isAssembly from '@/utils/isAssembly'
import { manufacturerStore } from '@/store/reducers'

import type { RootReducerType } from './rootReducer'
import type { ItemDetail, ItemManufacturer } from '@/types/Item'
import type { AssemblyDetail } from '@/types/Assembly'
import type { DataForDropdown, HistoryLog, ParameterOption } from '@/types/Common'
import type { PartDetail, PartEntity } from '@/types/Part'
import type { ManufacturerInitDataForCE, ManufacturerPermissions, ManufacturerItem } from '@/types/Manufacturer'

export const name = 'part'

export type Part = {
  detail: ItemDetail | AssemblyDetail
  permissions: any
  wiki_page: string
  loading: boolean
  tab: number
  historyLogs: HistoryLog[]
}

export const itemDetail = {
  job_id: null,
  drawing_id: null,
  dpn: '',
  reference_to: null,
  mass: 0,
  unit: null,
  manufacturer_equiv: null,
  manufacturers: [],
  material_equiv: null,
  descriptions: [],
  manufacturer_equiv_standards: [],
  material_equiv_standards: [],
  additional_attributes: {}
} as ItemDetail

export const assemblyDetail = {
  job_id: null,
  drawing_id: null,
  dpn: '',
  unit: null,
  descriptions: [],
  items: [],
  manufacturers: [],
  is_assembly: true,
  additional_attributes: {},
  drawing_items: []
} as AssemblyDetail

export const initialState = {
  partList: [] as Part[],
  initData: {
    parameters: {
      MAAT: [],
      PLLA: [],
      UNIT: [],
      PAAT: []
    }
  },
  confirmRef: {
    open: false,
    message: ''
  },
  manufacturer: {
    detail: manufacturerStore.initialState.detail,
    dialogState: manufacturerStore.initialState.dialogState,
    initData: {
      ...manufacturerStore.initialState.initDataForCE,
      permissions: null as ManufacturerPermissions
    }
  }
}

const partSlice = createSlice({
  name,
  initialState,
  reducers: {
    addPart(state, { payload }: PayloadAction<Pick<Part, 'detail' | 'permissions' | 'wiki_page'>>) {
      const part = {
        ...payload,
        loading: false,
        tab: 0,
        historyLogs: []
      } as Part
      state.partList.push(part)
    },
    setInitData(state, { payload }) {
      state.initData = payload
    },
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      const { length } = state.partList
      if (length > 0) {
        state.partList[length - 1].historyLogs = payload
      }
    },
    setPartLoading(state, { payload }: PayloadAction<boolean>) {
      const currentPart = _.last(state.partList)
      const { length } = state.partList
      if (length <= 0) {
        return
      }
      if (currentPart.loading !== payload) {
        state.partList[length - 1].loading = payload
      }
    },
    updateCurrentPart(state, { payload }) {
      const { length } = state.partList
      state.partList[length - 1].detail = {
        ...state.partList[length - 1].detail,
        ...payload
      }
    },
    setConfirmRef(state, { payload }) {
      state.confirmRef.open = payload.open
      state.confirmRef.message = payload.message
    },
    setConfirmRefOpen(state, { payload }: PayloadAction<boolean>) {
      state.confirmRef.open = payload
    },
    resetCurrentPart(
      state,
      { payload }: PayloadAction<{ userJob: ParameterOption; userDrawing: DataForDropdown; generateCode?: string }>
    ) {
      const { length } = state.partList
      const { userJob, userDrawing, generateCode } = payload
      const currentPart = state.partList[length - 1].detail
      const initDetail = isAssembly(currentPart) ? assemblyDetail : itemDetail
      const defaultValues = getDefaultValues(
        state.initData.parameters,
        {
          unit: 'UNIT'
        },
        initDetail
      )
      defaultValues.job_id = userJob.value
      defaultValues.drawing_id = userDrawing.value === -1 ? null : userDrawing
      if (generateCode) {
        defaultValues.dpn = generateCode
      }
      state.partList[length - 1].detail = defaultValues
    },
    removePart(state) {
      state.partList.pop()
    },
    setPartTab(state, { payload }: PayloadAction<number>) {
      const currentPart = _.last(state.partList)
      const { length } = state.partList
      if (length <= 0) {
        return
      }
      if (currentPart.tab !== payload) {
        state.partList[length - 1].tab = payload
      }
    },
    // Manufacturer
    setManuDetail(state, { payload }) {
      state.manufacturer.detail = {
        ...state.manufacturer.detail,
        ...payload
      }
    },
    setManuDialogOpen(state, { payload }: PayloadAction<boolean>) {
      state.manufacturer.dialogState.open = payload
    },
    setManuDialogLoading(state, { payload }: PayloadAction<boolean>) {
      state.manufacturer.dialogState.loading = payload
    },
    setManuInitData(
      state,
      { payload }: PayloadAction<ManufacturerInitDataForCE & { permissions: ManufacturerPermissions }>
    ) {
      state.manufacturer.initData = payload
    },
    addManufacturer(state, { payload }: PayloadAction<ItemManufacturer>) {
      const { length } = state.partList
      state.partList[length - 1].detail.manufacturers.push(payload)
    },
    setDrawingItems(state, { payload }: PayloadAction<any[]>) {
      const { length } = state.partList
      if (length <= 0) {
        return
      }
      ;(state.partList[length - 1].detail as AssemblyDetail).drawing_items = payload
    }
  }
})

export const { actions } = partSlice

// saga actions
export const sagaCreate = createAction<{ entity: PartEntity; formData: ItemDetail | AssemblyDetail }>(
  `${name}/${actionTypes.CREATE}`
)

export const sagaCloseDialog = createAction<PartEntity>(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaOpenCreateDialog = createAction<PartEntity>(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaGetItemCopy = createAction<DataForDropdown>(`${name}/GET_ITEM_COPY`)
export const sagaOpenUpdateDialog = createAction<{ id: number; entity: PartEntity }>(
  `${name}/${actionTypes.OPEN_UPDATE_DIALOG}`
)
export const sagaGetDrawingItems = createAction<number>(`${name}/GET_DRAWING_ITEMS`)

// saga actions Manufacturer
export const sagaOpenManuDialog = createAction<PartDetail>(`${name}/OPEN_UPDATE_MANU_DIALOG`)
export const sagaCreateManu = createAction<ManufacturerItem>(`${name}/CREATE_MANU`)
export const sagaCloseManuDialog = createAction(`${name}/CLOSE_MANU_DIALOG`)
export const sagaGetManuId = createAction<ManufacturerItem>(`${name}/GET_MANU_ID`)

// selectors
export const selectState = (state: RootReducerType) => state[name]
export const selectPartList = createSelector(selectState, (state) => state.partList)
export const selectParameters = createSelector(selectState, (state) => state.initData.parameters)
export const selectCurrentPart = createSelector(selectState, (state) => _.last(state.partList))
export const selectConfirmRef = createSelector(selectState, (state) => state.confirmRef)
export const selectPartManu = createSelector(selectState, (state) => state.manufacturer)
export const selectDrawingItems = createSelector(selectState, (state) => {
  const { partList } = state
  if (partList.length <= 0) {
    return []
  }
  const { detail } = _.last(partList)
  return (detail as AssemblyDetail).drawing_items || []
})

export default partSlice
