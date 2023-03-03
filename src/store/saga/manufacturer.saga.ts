import { takeEvery, put, putResolve, call } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'

import { manufacturerStore, commonStore, advancedFilterActions } from '@/store/reducers'

import manufacturerApi from '@/apis/manufacturer.api'

export function* fetchList() {
  const { tableState, searchQuery, filterData } = yield all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(manufacturerApi.getList, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(manufacturerStore.actions.setDataList(data.manufacturers))
}

export function* fetchInitDataForList() {
  const data = yield call(manufacturerApi.getInitDataForList)
  yield put(manufacturerStore.actions.setInitDataForList(data))
}

export function* fetchInitDataForCE() {
  const { permissions, ...response } = yield call(manufacturerApi.getInitDataForCE)
  yield all([
    put(manufacturerStore.actions.setPermissions(permissions)),
    put(manufacturerStore.actions.setInitDataForCE(response)),
    put(
      manufacturerStore.actions.setDetail({
        manufacturer_id: response.next_code
      })
    )
  ])
}

export function* fetchDetail(id: number) {
  const { manufacturer } = yield call(manufacturerApi.getDetail, id)
  yield put(manufacturerStore.actions.setDetail(manufacturer))
}

export function* getManufacturerList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(manufacturerStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openManuCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield put(manufacturerStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openManuUpdateDialog({ payload: id }: ReturnType<typeof manufacturerStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, id)
    yield put(manufacturerStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* createManu({ payload }: ReturnType<typeof manufacturerStore.sagaCreate>) {
  yield put(manufacturerStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(manufacturerApi.create, payload)
    yield call(fetchInitDataForCE)
    yield put(commonStore.actions.setSuccessMessage(message))
    yield put(manufacturerStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(manufacturerStore.actions.setDialogStateLoading(false))
}

export function* updateManu({ payload }: ReturnType<typeof manufacturerStore.sagaUpdate>) {
  yield put(manufacturerStore.actions.setDialogStateLoading(true))
  try {
    const { id, formData } = payload
    const { message } = yield call(manufacturerApi.update, id, formData)
    yield call(closeManuDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(manufacturerStore.actions.setDialogStateLoading(false))
}

export function* generateManuId({ payload: formData }: ReturnType<typeof manufacturerStore.sagaGenerateCode>) {
  yield put(manufacturerStore.actions.setDialogStateLoading(true))
  try {
    const data = yield call(manufacturerApi.getNextCode, formData.manufacturer_id)
    yield put(
      manufacturerStore.actions.setDetail({
        ...formData,
        manufacturer_id: data.generated_code
      })
    )
    yield put(commonStore.actions.setSuccessMessage(data.message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(manufacturerStore.actions.setDialogStateLoading(false))
}

export function* closeManuDialog() {
  yield putResolve(manufacturerStore.actions.setDialogStateOpen(false))
  yield call(getManufacturerList)
  yield put(manufacturerStore.actions.resetDetail())
}

function* manufacturerSaga() {
  yield takeEvery(manufacturerStore.sagaGetList, getManufacturerList)
  yield takeEvery(manufacturerStore.sagaOpenCreateDialog, openManuCreateDialog)
  yield takeEvery(manufacturerStore.sagaOpenUpdateDialog, openManuUpdateDialog)
  yield takeEvery(manufacturerStore.sagaCreate, createManu)
  yield takeEvery(manufacturerStore.sagaUpdate, updateManu)
  yield takeEvery(manufacturerStore.sagaGenerateCode, generateManuId)
  yield takeEvery(manufacturerStore.sagaCloseDialog, closeManuDialog)
}

export default manufacturerSaga
