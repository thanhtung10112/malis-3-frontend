import { takeEvery, put, call, takeLatest } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'

import { commonStore, advancedFilterActions, equivalenceStore } from '@/store/reducers'

import equivalenceApi from '@/apis/equivalence.api'

function* fetchInitDataForList() {
  const data = yield call(equivalenceApi.getInitDataForList)
  yield put(equivalenceStore.actions.setInitDataForList(data))
}

function* fetchInitDataForCE() {
  const equivalenceType = yield* select(equivalenceStore.selectEquivalenceType)
  const data = yield call(equivalenceApi.getInitDataForCE, {
    equivalence_type: equivalenceType
  })
  yield put(equivalenceStore.actions.setInitDataForCE(data))
  yield put(equivalenceStore.actions.setDetail({ equiv_id: data.next_code }))
}

function* fetchList() {
  const equivalenceType = yield* select(equivalenceStore.selectEquivalenceType)
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const { equivalences } = yield call(equivalenceApi.getList, equivalenceType, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: equivalences.length }))
  yield put(equivalenceStore.actions.setDataList(equivalences))
}

function* getEquivalenceList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(equivalenceStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* fetchDetail(id: number) {
  const { equivalence } = yield call(equivalenceApi.getDetail, id)
  yield put(equivalenceStore.actions.setDetail(equivalence))
}

function* openEquivCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield put(equivalenceStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* createEquiv({ payload }: ReturnType<typeof equivalenceStore.sagaCreate>) {
  yield put(equivalenceStore.actions.setDialogStateLoading(true))

  try {
    const equivalenceType = yield* select(equivalenceStore.selectEquivalenceType)
    const { message } = yield call(equivalenceApi.create, payload)
    const { generated_code } = yield call(equivalenceApi.getNextCode, equivalenceType, null)
    yield put(commonStore.actions.setSuccessMessage(message))
    yield put(
      equivalenceStore.actions.setDetail({
        ...equivalenceStore.equivalenceDetail,
        equiv_id: generated_code
      })
    )
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(equivalenceStore.actions.setDialogStateLoading(false))
}

function* closeEquivDialog() {
  try {
    yield put(equivalenceStore.actions.setDialogStateOpen(false))
    yield call(getEquivalenceList)
    yield put(equivalenceStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* openEquivUpdateDialog({ payload: id }: ReturnType<typeof equivalenceStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, id)
    yield put(equivalenceStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* updateEquiv({ payload }: ReturnType<typeof equivalenceStore.sagaUpdate>) {
  yield put(equivalenceStore.actions.setDialogStateLoading(true))
  try {
    const { id, formData } = payload
    const { message } = yield call(equivalenceApi.update, id, formData)
    yield call(closeEquivDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(equivalenceStore.actions.setDialogStateLoading(false))
}

function* getNextEquivCode({ payload }: ReturnType<typeof equivalenceStore.sagaGetNextCode>) {
  yield put(equivalenceStore.actions.setDialogStateLoading(true))
  try {
    const equivalenceType = yield* select(equivalenceStore.selectEquivalenceType)
    const { generated_code } = yield call(equivalenceApi.getNextCode, equivalenceType, payload.equiv_id)
    payload.equiv_id = generated_code
    yield put(equivalenceStore.actions.setDetail(payload))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(equivalenceStore.actions.setDialogStateLoading(false))
}

function* equivalenceSaga() {
  yield takeEvery(equivalenceStore.sagaGetList, getEquivalenceList)
  yield takeEvery(equivalenceStore.sagaCreate, createEquiv)
  yield takeEvery(equivalenceStore.sagaOpenCreateDialog, openEquivCreateDialog)
  yield takeEvery(equivalenceStore.sagaCloseDialog, closeEquivDialog)
  yield takeEvery(equivalenceStore.sagaOpenUpdateDialog, openEquivUpdateDialog)
  yield takeEvery(equivalenceStore.sagaUpdate, updateEquiv)
  yield takeLatest(equivalenceStore.sagaGetNextCode, getNextEquivCode)
}

export default equivalenceSaga
