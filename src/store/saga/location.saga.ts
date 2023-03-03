import { takeEvery, put, putResolve } from 'redux-saga/effects'

import { call, select, all, takeLatest } from 'typed-redux-saga'
import immer from 'immer'

import { advancedFilterActions, commonStore, locationStore } from '@/store/reducers'

import locationApi from '@/apis/location.api'

export function* fetchInitDataForList() {
  const data = yield call(locationApi.getInitDataForList)
  yield put(locationStore.actions.setInitDataForList(data))
}

export function* fetchInitDataForCE() {
  const { permissions, ...data } = yield call(locationApi.getInitDataForCE)
  yield put(locationStore.actions.setInitDataForCE(data))
  yield put(locationStore.actions.setDetail({ location_id: data.next_code }))
}

export function* fetchList() {
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(locationApi.getList, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(locationStore.actions.setDataList(data.locations))
}

export function* fetchDetail(id: number) {
  const { location } = yield call(locationApi.getDetail, id)
  yield put(locationStore.actions.setDetail(location))
}

export function* getLocationList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(locationStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openLocationCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    yield put(locationStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* createLocation({ payload }: ReturnType<typeof locationStore.sagaCreate>) {
  yield put(locationStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(locationApi.create, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
    const { generated_code } = yield call(locationApi.getNextCode, null)
    yield put(
      locationStore.actions.setDetail({
        ...locationStore.initialState.detail,
        location_id: generated_code
      })
    )
    yield put(locationStore.actions.setNextCode(generated_code))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(locationStore.actions.setDialogStateLoading(false))
}

export function* updateLocation({ payload }: ReturnType<typeof locationStore.sagaUpdate>) {
  yield put(locationStore.actions.setDialogStateLoading(true))
  try {
    const permissions = yield* select(locationStore.selectPermissions)
    const { id } = payload
    // delete location_type if user not have change_type permission
    const location = immer(payload.location, (draft) => {
      if (!permissions.change_type) {
        delete draft.location_type
      }
    })
    const { message } = yield call(locationApi.update, id, location)
    yield call(closeLocationDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(locationStore.actions.setDialogStateLoading(false))
}

export function* openLocationUpdateDialog({ payload }: ReturnType<typeof locationStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield put(locationStore.actions.setDialogStateEditMode(true))
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, payload)
    yield put(locationStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* getLocationNextCode({ payload }: ReturnType<typeof locationStore.sagaGetNextCode>) {
  yield put(locationStore.actions.setDialogStateLoading(true))
  try {
    const { generated_code } = yield call(locationApi.getNextCode, payload.location_id)
    const newDetail = immer(payload, (draft) => {
      draft.location_id = generated_code
    })
    yield put(locationStore.actions.setDetail(newDetail))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(locationStore.actions.setDialogStateLoading(false))
}

export function* closeLocationDialog() {
  try {
    yield putResolve(locationStore.actions.setDialogStateOpen(false))
    yield call(getLocationList)
    yield all([put(locationStore.actions.setDialogStateEditMode(false)), put(locationStore.actions.resetDetail())])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* locationSaga() {
  yield takeEvery(locationStore.sagaGetList, getLocationList)
  yield takeEvery(locationStore.sagaOpenCreateDialog, openLocationCreateDialog)
  yield takeEvery(locationStore.sagaCreate, createLocation)
  yield takeEvery(locationStore.sagaOpenUpdateDialog, openLocationUpdateDialog)
  yield takeEvery(locationStore.sagaUpdate, updateLocation)
  yield takeEvery(locationStore.sagaCloseDialog, closeLocationDialog)
  yield takeLatest(locationStore.sagaGetNextCode, getLocationNextCode)
}

export default locationSaga
