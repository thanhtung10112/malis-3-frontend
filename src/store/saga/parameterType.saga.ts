import { takeEvery, put, putResolve } from 'redux-saga/effects'

import { select, call, all } from 'typed-redux-saga'

import { advancedFilterActions, summaryReportActions, commonStore, parameterTypeStore } from '@/store/reducers'

import parameterTypeApi from '@/apis/parameterType.api'

export function* fetchInitDataForList() {
  const data = yield call(parameterTypeApi.getInitDataForList)
  yield put(parameterTypeStore.actions.setInitDataForList(data))
}

export function* fetchInitDataForCE() {
  const { permissions, ...initData } = yield call(parameterTypeApi.getInitDataForCE)
  yield all([
    put(parameterTypeStore.actions.setInitDataForCE(initData)),
    put(parameterTypeStore.actions.setPermissions(permissions))
  ])
}

export function* fetchDetail(id: number) {
  const { parameter_type } = yield call(parameterTypeApi.getDetail, id)
  yield put(parameterTypeStore.actions.setDetail(parameter_type))
}

export function* fetchList() {
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(parameterTypeApi.getList, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(parameterTypeStore.actions.setDataList(data.parameter_types))
}

export function* getListSaga() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(parameterTypeStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openCreateDialogSaga() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield put(parameterTypeStore.actions.setDialogState({ open: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openUpdateDialogSaga({ payload: id }) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, id)
    yield put(parameterTypeStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* createSaga({ payload }) {
  yield put(parameterTypeStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(parameterTypeApi.create, payload)
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(parameterTypeStore.actions.resetDetail())])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(parameterTypeStore.actions.setDialogStateLoading(false))
}

export function* updateSaga({ payload }) {
  yield put(parameterTypeStore.actions.setDialogStateLoading(true))

  try {
    const { id, parameterType } = payload
    const { message } = yield call(parameterTypeApi.update, id, parameterType)
    yield call(closeDialogSaga)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(parameterTypeStore.actions.setDialogStateLoading(false))
}

export function* executeOperationSaga({ payload }) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { operation, parameter_types } = payload
    const data = yield call(parameterTypeApi.executeOperation, operation, parameter_types)
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

export function* closeDialogSaga() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield putResolve(parameterTypeStore.actions.setDialogStateOpen(false))
    yield call(fetchList)
    yield all([
      put(parameterTypeStore.actions.resetDetail()),
      put(parameterTypeStore.actions.setDialogStateEditMode(false))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* parameterTypeSaga() {
  yield takeEvery(parameterTypeStore.extraActions.getList, getListSaga)
  yield takeEvery(parameterTypeStore.extraActions.openCreateDialog, openCreateDialogSaga)
  yield takeEvery(parameterTypeStore.extraActions.openUpdateDialog, openUpdateDialogSaga)
  yield takeEvery(parameterTypeStore.extraActions.create, createSaga)
  yield takeEvery(parameterTypeStore.extraActions.update, updateSaga)
  yield takeEvery(parameterTypeStore.extraActions.executeOperation, executeOperationSaga)
  yield takeEvery(parameterTypeStore.extraActions.closeDialog, closeDialogSaga)
}

export default parameterTypeSaga
