import {
  Budget,
  BudgetInitDataForCreateEdit,
  BudgetInitDataForList,
  BudgetItem,
  BudgetPermission,
  BudgetSum,
  BudgetUserValue
} from '@/types/Budget'
import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit'

import { v1 as uuidv1 } from 'uuid'
import { actionTypes } from '@/utils/constant'

import { RootReducerType } from './rootReducer'
import { NextRouter } from 'next/router'

export const name = 'budget'
export const resetState = createAction(name + '/RESET_STATE')

export const dialogState = {
  isOpen: false,
  isEdit: false,
  isLoading: false
}

export const importDialogState = {
  isOpen: false,
  isLoading: false,
  mode: 0 // 0 -> test, 1 -> write
}

export const resultImportDialog = {
  isOpen: false,
  success: true,
  result: '',
  isLoading: false
}

export const budgetDetail = {
  job_id: null,
  budget_id: '',
  puco: null,
  description: '',
  amount: null,
  currency: ''
}

export const initDataForList = {
  jobs: [],
  puco_list: [],
  selected_job: {
    description: '',
    value: null
  },
  user_puco: {
    description: '',
    value: null
  },
  permissions: {
    budget: null
  },
  wiki_page: '',
  column_tooltips: {}
} as BudgetInitDataForList

export const initDataForCreateEdit = {
  puco_list: [],
  user_currency: {
    description: '',
    value: null
  },
  user_job: {
    description: '',
    value: null
  },
  user_puco: {
    description: '',
    value: null
  },
  wiki_page: ''
} as BudgetInitDataForCreateEdit

const remindData = {
  open: false,
  helpText: ''
}

export const initialState = {
  dataList: [] as BudgetItem[],
  dialogState,
  importDialogState,
  resultImportDialog,
  budgetDetail,
  initDataForList,
  remindData,
  initDataForCreateEdit,
  budgetImportProcess: {
    celery_id: '',
    operation_id: '',
    openDialogProcess: false
  },
  budgetSum: {
    amount: 0,
    budget_id: '',
    currency_id: '',
    description: 'Total of selected cost codes',
    left_in_order: 0,
    left_in_rfq: 0,
    parameter_id: '',
    used_in_order: 0,
    used_in_rfq: 0,
    id: uuidv1()
  } as BudgetItem
}

const budget = createSlice({
  name,
  initialState,
  reducers: {
    setOpenDialog(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.isOpen = payload
    },
    setLoadingDialog(state, { payload }: PayloadAction<boolean>) {
      state.dialogState.isLoading = payload
    },
    setEditMode(state, action: PayloadAction<boolean>) {
      state.dialogState.isEdit = action.payload
    },
    setInitDataForList(state, { payload }: PayloadAction<BudgetInitDataForList>) {
      state.initDataForList = payload
    },
    setInitDataForCreateEdit(state, { payload }: PayloadAction<BudgetInitDataForCreateEdit>) {
      state.initDataForCreateEdit = payload
    },
    setDataList(state, { payload }: PayloadAction<BudgetItem[]>) {
      state.dataList = payload
    },
    setUserValues(state, { payload }: PayloadAction<{ value: 'puco' | 'job'; option: BudgetUserValue }>) {
      if (payload.value === 'puco') {
        state.initDataForList.user_puco = payload.option
      } else {
        state.initDataForList.selected_job = payload.option
      }
    },
    setBudgetDetail(state, { payload }: PayloadAction<Partial<Budget>>) {
      state.budgetDetail = {
        ...state.budgetDetail,
        ...payload
      }
    },
    setBudgetSum(state, { payload }: PayloadAction<BudgetSum>) {
      state.budgetSum.amount = payload.sum_amount
      state.budgetSum.used_in_rfq = payload.sum_used_in_rfq
      state.budgetSum.left_in_rfq = payload.sum_left_in_rfq
      state.budgetSum.used_in_order = payload.sum_used_in_order
      state.budgetSum.left_in_order = payload.sum_left_in_order
    },
    setPermissions(state, { payload }: PayloadAction<BudgetPermission>) {
      state.initDataForList.permissions.budget = payload
    },
    setImportOpen(state, { payload }: PayloadAction<boolean>) {
      state.importDialogState.isOpen = payload
    },
    setImportLoading(state, { payload }: PayloadAction<boolean>) {
      state.importDialogState.isLoading = payload
    },
    setImportMode(state, { payload }: PayloadAction<number>) {
      state.importDialogState.mode = payload
    },
    setImportResult(state, { payload }: PayloadAction<Partial<typeof resultImportDialog>>) {
      state.resultImportDialog = {
        ...state.resultImportDialog,
        ...payload
      }
    },
    setOpenImportProcess(state, { payload }: PayloadAction<boolean>) {
      state.budgetImportProcess.openDialogProcess = payload
    },
    setCeleryId(state, { payload }: PayloadAction<string>) {
      state.budgetImportProcess.celery_id = payload
    },
    setOperationId(state, { payload }: PayloadAction<string>) {
      state.budgetImportProcess.operation_id = payload
    },
    setRemindData(state, { payload }: PayloadAction<Partial<typeof remindData>>) {
      state.remindData = {
        ...state.remindData,
        ...payload
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
  setOpenDialog,
  setLoadingDialog,
  setEditMode,
  setInitDataForList,
  setDataList,
  setUserValues,
  setBudgetDetail,
  setInitDataForCreateEdit,
  setBudgetSum,
  setPermissions,
  setImportOpen,
  setImportLoading,
  setImportResult,
  setImportMode,
  setOpenImportProcess,
  setCeleryId,
  setOperationId,
  setRemindData
} = budget.actions

export const openUpdateDialog = createAction<number>(name + '/OPEN_UPDATE_DIALOG')
export const closeDialog = createAction(name + '/CLOSE_DIALOG')
export const openCreateDialog = createAction(name + '/OPEN_CREATE_DIALOG')
export const getList = createAction(name + '/GET_LIST')
export const changeUserValue = createAction<any>(name + '/CHANGE_USER_VALUE')
export const updateMultiple = createAction<{
  router: NextRouter
  href: string
}>(name + '/' + actionTypes.UPDATE_MULTIPLE)

export const create = createAction<Budget>(name + '/CREATE')
export const update = createAction<Budget>(name + '/UPDATE')
export const remove = createAction<number[]>(name + '/REMOVE')
export const importCostCode = createAction<{
  operationData: {
    job_id_pk: number
    file_type: 'text' | 'excel'
    mode: 'test' | 'write'
  }
  mode: number
  file: File
}>(name + '/IMPORT')
export const sendReportMail = createAction<FormData>(name + '/SEND_REPORT_MAIL')
export const getRemindData = createAction(name + '/GET_REMIND_DATA')

// selector
export const selectDialogState = (state: RootReducerType) => state.budget.dialogState
export const selectUserJob = (state: RootReducerType) => state.budget.initDataForList.selected_job
export const selectUserPuco = (state: RootReducerType) => state.budget.initDataForList.user_puco
export const selectDataList = (state: RootReducerType) => state.budget.dataList
export const selectJobList = (state: RootReducerType) => state.budget.initDataForList.jobs
export const selectPucoList = (state: RootReducerType) => state.budget.initDataForList.puco_list
export const selectBudgetDetail = (state: RootReducerType) => state.budget.budgetDetail
export const selectInitDataCreateEdit = (state: RootReducerType) => state.budget.initDataForCreateEdit
export const selectBudgetSum = (state: RootReducerType) => state.budget.budgetSum
export const selectPermissions = (state: RootReducerType) => state.budget.initDataForList.permissions.budget
export const selectImportDialogState = (state: RootReducerType) => state.budget.importDialogState
export const selectImportResultDialog = (state: RootReducerType) => state.budget.resultImportDialog
export const selectImportDialogProcess = (state: RootReducerType) => state.budget.budgetImportProcess
export const selectRemindData = (state: RootReducerType) => state.budget.remindData

export const selectInitDataForCE = (state: RootReducerType) => state.budget.initDataForCreateEdit

export const selectInitDataForList = (state: RootReducerType) => state.budget.initDataForList

export default budget.reducer
