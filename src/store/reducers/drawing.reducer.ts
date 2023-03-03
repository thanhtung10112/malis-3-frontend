import { createSlice, createSelector, PayloadAction, createAction } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'
import { getDefaultValues } from '@/utils/getDefaultValues'

import type { RootReducerType } from './rootReducer'
import type { Entity, HistoryLog, ParameterOption } from '@/types/Common'
import type {
  DrawingInitDataForCE,
  DrawingInitDataForList,
  DrawingItem,
  DrawingPermissions,
  DrawingDetail,
  RevisionDetail
} from '@/types/Drawing'
import type { PartEntity } from '@/types/Part'

export const name: Entity = 'drawing'
export const resetState = createAction(`${name}/${actionTypes.RESET_STATE}`)

export const initialState = {
  drawingGroupId: -1,
  dataList: [] as DrawingItem[],
  detail: {
    job_id: null,
    drawing_id: '',
    revision: 'A',
    drawing_format: null,
    drawing_purpose: null,
    file_prefix: null,
    file_type: null,
    associated_documents: [],
    customer_id: '',
    additional_attributes: {},
    descriptions: [],
    exclude_from_customer: false,
    exclude_from_other: false,
    exclude_from_supplier: false,
    item_list: [],
    tag_list: [],
    is_detail_drawing: false,
    is_drawing: true,
    is_other_document: false,
    is_schematic: false,
    is_specification: false
  } as DrawingDetail,
  dialogState: {
    open: false,
    loading: false,
    tab: 0,
    historyLogs: [] as HistoryLog[]
  },
  initDataForList: {
    drawing_groups: [{ description: 'All', group_id: null, children: [] }],
    jobs: [],
    permissions: {
      drawing: null
    },
    parameters: {
      PLLA: []
    },
    wiki_page: '',
    column_tooltips: {}
  } as DrawingInitDataForList,
  initDataForCE: {
    parameters: {
      DWAT: [],
      DWPU: [], // drawing purpose
      FPRE: [], // file name prefix
      FTYP: [], // file type
      PLFO: [], // format
      PLLA: [], // descriptions
      PLAT: [] // extended properties
    },
    wiki_page: ''
  } as DrawingInitDataForCE,
  revisionDialog: {
    open: false,
    loading: false,
    detail: {
      new_revision: '',
      reason: '',
      description: ''
    } as RevisionDetail
  }
}

const drawing = createSlice({
  name,
  initialState,
  reducers: {
    setDataList(state, { payload }: PayloadAction<DrawingItem[]>) {
      state.dataList = payload
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
    setDialogStateLoading(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.loading = payload
    },
    setDialogStateTab(state, { payload }: PayloadAction<number>) {
      state.dialogState.tab = payload
    },
    setInitDataForList(state, { payload }: PayloadAction<DrawingInitDataForList>) {
      state.initDataForList = payload
    },
    setPermissions(state, { payload }: PayloadAction<DrawingPermissions>) {
      state.initDataForList.permissions.drawing = payload
    },
    setInitDataForCE(state, { payload }: PayloadAction<DrawingInitDataForCE>) {
      state.initDataForCE = payload
    },
    setHistoryLogs(state, { payload }: PayloadAction<HistoryLog[]>) {
      state.dialogState.historyLogs = payload
    },
    setDetail(state, { payload }: PayloadAction<Partial<DrawingDetail>>) {
      state.detail = {
        ...state.detail,
        ...payload
      }
    },
    setDrawingGroupId(state, { payload }: PayloadAction<number>) {
      state.drawingGroupId = payload
    },
    resetDetail(state, { payload: { userJob } }) {
      const detailDefaultValue = getDefaultValues(
        state.initDataForCE.parameters,
        {
          drawing_purpose: 'DWPU',
          file_prefix: 'FPRE',
          file_type: 'FTYP',
          drawing_format: 'PLFO'
        },
        initialState.detail
      )
      detailDefaultValue.job_id = userJob.value > -1 ? userJob.value : null
      state.detail = { ...detailDefaultValue }
      state.dialogState.tab = 0
    },
    setRevisionDialogOpen(state, { payload }: PayloadAction<boolean>) {
      state.revisionDialog.open = payload
    },
    setRevisionDialogLoading(state, { payload }: PayloadAction<boolean>) {
      state.revisionDialog.loading = payload
    },
    setRevisionDialogDetail(state, { payload }: PayloadAction<Partial<RevisionDetail>>) {
      state.revisionDialog.detail = {
        ...state.revisionDialog.detail,
        ...payload
      }
    },
    resetRevisionDialogDetail(state) {
      state.revisionDialog.detail = { ...initialState.revisionDialog.detail }
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})
// Actions
export const { actions } = drawing

// Saga actions
export const sagaGetList = createAction(`${name}/${actionTypes.GET_LIST}`)
export const sagaOpenCreateDialog = createAction(`${name}/${actionTypes.OPEN_CREATE_DIALOG}`)
export const sagaOpenUpdateDialog = createAction<number>(`${name}/${actionTypes.OPEN_UPDATE_DIALOG}`)
export const sagaOpenCreatePartDialog = createAction<PartEntity>(`${name}/OPEN_CREATE_PART_DIALOG`)
export const sagaChangeUserJob = createAction<ParameterOption>(`${name}/${actionTypes.CHANGE_USER_JOB}`)
export const sagaCloseDialog = createAction(`${name}/${actionTypes.CLOSE_DIALOG}`)
export const sagaCreate = createAction<DrawingDetail>(`${name}/${actionTypes.CREATE}`)
export const sagaUpdate = createAction<{ id: number; drawing: DrawingDetail }>(`${name}/${actionTypes.UPDATE}`)
export const sagaOpenRevDialog = createAction<string>(`${name}/OPEN_REV_DIALOG`)
export const sagaSaveNewRev = createAction<{ revision: RevisionDetail; drawingId: number }>(`${name}/SAVE_NEW_REV`)

// Selectors
const selectState = (state: RootReducerType) => state[name]
export const selectDialogState = createSelector(selectState, (state) => state.dialogState)
export const selectDataList = createSelector(selectState, (state) => state.dataList)
export const selectPermissions = createSelector(selectState, (state) => state.initDataForList.permissions.drawing)
export const selectDrawingGroups = createSelector(selectState, ({ initDataForList }) => {
  const { drawing_groups } = initDataForList
  return drawing_groups[0]
})

export const selectDetail = createSelector(selectState, ({ detail }) => detail)

export const selectInitDataForList = createSelector(selectState, (state) => state.initDataForList)

export const selectInitDataForCE = createSelector(selectState, ({ initDataForCE }) => initDataForCE)

export const selectParameters = createSelector(selectState, ({ initDataForCE }) => initDataForCE.parameters)

export const selectDrawingGroupId = createSelector(selectState, ({ drawingGroupId }) => drawingGroupId)

export const selectRevisionDialog = createSelector(selectState, (state) => state.revisionDialog)

export default drawing
