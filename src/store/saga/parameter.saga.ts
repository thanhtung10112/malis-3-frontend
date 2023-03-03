import { takeEvery, put, takeLatest, putResolve } from 'redux-saga/effects'
import { call, select, all } from 'typed-redux-saga'
import immer from 'immer'
import Router from 'next/router'

import parameterApi from '@/apis/parameter.api'

import { parameterStore, advancedFilterActions, commonStore, summaryReportActions } from '@/store/reducers'

function* fetchInitDataForList() {
  const data = yield call(parameterApi.getInitDataForList)
  yield put(parameterStore.actions.setInitDataForList(data))
}

function* fetchInitDataForCE() {
  const { param_type_id } = Router.query
  const { permissions, ...response } = yield call(parameterApi.getInitDataForCE, {
    param_type_id
  })
  yield all([
    put(parameterStore.actions.setPermissions(permissions)),
    put(parameterStore.actions.setInitDataForCE(response)),
    put(parameterStore.actions.setDetail({ parameter_type_id: param_type_id }))
  ])
}

function* fetchList() {
  const { param_type_id } = Router.query
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(parameterApi.getList, param_type_id as string, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield all([
    put(commonStore.actions.setTableState({ total_items: data.total_items })),
    put(parameterStore.actions.setData(data.parameters)),
    put(parameterStore.actions.setParameterType(data.parameter_type))
  ])
}

function* fetchDetail(id: number) {
  const { parameter } = yield call(parameterApi.getDetail, id)
  const { is_multilingual } = yield* select(parameterStore.selectInitDataForCE)
  const formatParameter = immer(parameter, (draft: any) => {
    if (is_multilingual) {
      draft.descriptions = draft.multilingual_descriptions
      delete draft.multilingual_descriptions
    }
  })
  yield put(parameterStore.actions.setDetail(formatParameter))
}

function* getList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const viewPermission = yield* select(parameterStore.selectViewPermission)
    if (viewPermission) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* openCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield put(parameterStore.actions.setDialogState({ open: true, editMode: false }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* executeOperation({ payload }) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { operation, parameters } = payload
    const data = yield call(parameterApi.executeOperation, operation, parameters)
    yield call(fetchList)
    if (data.failed_count > 0) {
      yield put(summaryReportActions.setReportData(data))
      yield put(summaryReportActions.setOpen(true))
    } else {
      yield put(commonStore.actions.setSuccessMessage(data.message))
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* closeDialog() {
  try {
    yield putResolve(parameterStore.actions.setDialogStateOpen(false))
    yield call(getList)
    yield all([
      put(parameterStore.actions.setDialogStateEditMode(false)),
      put(parameterStore.actions.resetLocationDetail())
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* create({ payload }) {
  yield put(parameterStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(parameterApi.create, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
    yield put(parameterStore.actions.resetLocationDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(parameterStore.actions.setDialogStateLoading(false))
}

function* openUpdateDialog({ payload: id }) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, id)
    yield put(parameterStore.actions.setDialogState({ editMode: true, open: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* update({ payload }) {
  yield put(parameterStore.actions.setDialogStateLoading(true))

  try {
    const { message } = yield call(parameterApi.update, payload.id, payload.formData)
    yield call(closeDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(parameterStore.actions.setDialogStateLoading(false))
}

function* parameterSaga() {
  yield takeEvery(parameterStore.extraActions.getList, getList)
  yield takeLatest(parameterStore.extraActions.executeOperation, executeOperation)
  yield takeEvery(parameterStore.extraActions.openCreateDialog, openCreateDialog)
  yield takeEvery(parameterStore.extraActions.closeDialog, closeDialog)
  yield takeLatest(parameterStore.extraActions.create, create)
  yield takeLatest(parameterStore.extraActions.openUpdateDialog, openUpdateDialog)
  yield takeLatest(parameterStore.extraActions.update, update)
}

export default parameterSaga
