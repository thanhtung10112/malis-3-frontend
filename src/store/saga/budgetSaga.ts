import { takeEvery, put } from 'redux-saga/effects'
import { call, select, all } from 'typed-redux-saga'
import immer from 'immer'
import _ from 'lodash'

import { budgetActions, commonStore, advancedFilterActions, summaryReportActions } from '@/store/reducers'
import commonApi from '@/apis/common.api'
import budgetApi from '@/apis/budget.api'

export function* fetchInitDataForList() {
  const userPuco = yield* select(budgetActions.selectUserPuco)
  const userJob = yield* select(budgetActions.selectUserJob)
  const data = yield call(budgetApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  if (_.isNull(data.selected_job)) {
    ;(data as any).selected_job = {}
  }
  // set all_value for all option
  data.puco_list = immer(data.puco_list, (draft) => {
    const index = _.findIndex(draft, (item: any) => _.isNull(item.value))
    draft[index].value = 'all_value'
  })
  // if puco was selected, then set response.user_puco = current selected puco
  if (!_.isNull(userPuco.value)) {
    data.user_puco = userPuco
  }
  yield put(budgetActions.setInitDataForList(data))
}

export function* fetchInitDataForCreateEdit() {
  const userJob = yield* select(budgetActions.selectUserJob)
  const data = yield call(budgetApi.getInitDataForCE, {
    job_id_pk: userJob.value
  })
  yield put(budgetActions.setInitDataForCreateEdit(data))
  yield put(budgetActions.setBudgetDetail({ job_id: userJob.value }))
}

function* fetchList() {
  // eslint-disable-next-line prefer-const
  let { tableState, searchQuery, filterData, userJob, userPuco } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    userJob: select(budgetActions.selectUserJob),
    userPuco: select(budgetActions.selectUserPuco)
  })
  if (!userJob.value) {
    return
  }
  if ((userPuco as any).value === 'all_value') {
    userPuco = immer(userPuco, (draft) => {
      draft.value = null
    })
  }
  const { page, per_page } = tableState
  const data = yield call(budgetApi.getList, {
    page,
    per_page,
    s: searchQuery,
    job_id: userJob?.value,
    puco_id: userPuco?.value,
    ...filterData
  })
  yield put(budgetActions.setDataList(data.budgets))
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(budgetActions.setBudgetSum(data.budgets_sum))
  yield put(budgetActions.setPermissions(data.permissions))
}

function* fetchDetail(id: number) {
  const { budget } = yield call(budgetApi.getDetail, id)
  budget.amount = budget.amount.toString() as any
  yield put(budgetActions.setBudgetDetail(budget))
}

function* getList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(budgetActions.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* changeUserValue({ payload }) {
  try {
    const { value, option, confirm } = payload
    if (confirm === 'save') {
      yield put(
        commonStore.sagaUpdateMultiple({
          entity: 'budget',
          action: budgetActions.changeUserValue,
          payloadAction: { value, option }
        })
      )
    } else {
      yield put(budgetActions.setUserValues({ value, option }))
      yield call(getList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* openCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCreateEdit)
    yield put(budgetActions.setOpenDialog(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* create({ payload }: ReturnType<typeof budgetActions.create>) {
  yield put(budgetActions.setLoadingDialog(true))
  try {
    const { message } = yield call(budgetApi.create, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
    const budgetDetail = {
      ...budgetActions.budgetDetail,
      job_id: payload.job_id
    }
    yield put(budgetActions.setBudgetDetail(budgetDetail))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(budgetActions.setLoadingDialog(false))
}

function* openUpdateDialog({ payload }: ReturnType<typeof budgetActions.openUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield all([call(fetchInitDataForCreateEdit), call(fetchDetail, payload)])
    yield put(budgetActions.setOpenDialog(true))
    yield put(budgetActions.setEditMode(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* update({ payload }: ReturnType<typeof budgetActions.update>) {
  yield put(budgetActions.setLoadingDialog(true))
  try {
    const { message } = yield call(budgetApi.updateMultiple, [payload])
    yield put(commonStore.actions.setSuccessMessage(message))
    yield call(closeDialog)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(budgetActions.setLoadingDialog(false))
}

function* remove({ payload }: ReturnType<typeof budgetActions.remove>) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    const data = yield call(budgetApi.executeOperation, 'delete', payload)
    if (data.failed_count > 0) {
      yield put(summaryReportActions.setReportData(data))
      yield put(summaryReportActions.setOpen(true))
    } else {
      yield put(commonStore.actions.setSuccessMessage(data.message))
    }
    yield call(fetchList)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* importCostCode({ payload }: ReturnType<typeof budgetActions.importCostCode>) {
  yield put(budgetActions.setImportLoading(true))
  try {
    const data = yield call(commonApi.startBackgroundJob, 'import_budget', payload.operationData, payload.file)
    yield all([
      put(budgetActions.setCeleryId(data.celery_id)),
      put(budgetActions.setOperationId(data.operation_id)),
      put(budgetActions.setOpenImportProcess(true)),
      put(budgetActions.setImportMode(payload.mode))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(budgetActions.setImportLoading(false))
}

function* sendReportMail({ payload }: ReturnType<typeof budgetActions.sendReportMail>) {
  yield put(budgetActions.setImportLoading(true))
  try {
    const { message } = yield call(commonApi.sendReportMail, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(budgetActions.setImportLoading(false))
}

function* getRemindData() {
  yield put(budgetActions.setImportLoading(true))
  try {
    const userJob = yield* select(budgetActions.selectUserJob)
    const remindData = yield* select(budgetActions.selectRemindData)
    if (remindData.helpText) {
      yield put(budgetActions.setRemindData({ open: true }))
    } else {
      const { help_text } = yield call(budgetApi.getInitDataForImport, userJob.value)
      yield put(budgetActions.setRemindData({ helpText: help_text, open: true }))
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(budgetActions.setImportLoading(false))
}

function* closeDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield put(budgetActions.setOpenDialog(false))
    yield call(fetchList)
    yield put(budgetActions.setBudgetDetail({ ...budgetActions.budgetDetail }))
    yield put(budgetActions.setEditMode(false))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* watchBudgetSaga() {
  yield takeEvery(budgetActions.openCreateDialog, openCreateDialog)
  yield takeEvery(budgetActions.closeDialog, closeDialog)
  yield takeEvery(budgetActions.openUpdateDialog, openUpdateDialog)
  yield takeEvery(budgetActions.getList, getList)
  yield takeEvery(budgetActions.changeUserValue, changeUserValue)
  yield takeEvery(budgetActions.create, create)
  yield takeEvery(budgetActions.update, update)
  yield takeEvery(budgetActions.remove, remove)
  yield takeEvery(budgetActions.importCostCode, importCostCode)
  yield takeEvery(budgetActions.sendReportMail, sendReportMail)
  yield takeEvery(budgetActions.getRemindData, getRemindData)
}

export default watchBudgetSaga
