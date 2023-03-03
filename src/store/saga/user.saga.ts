import { takeEvery, put, putResolve } from 'redux-saga/effects'

import { select, all, call } from 'typed-redux-saga'

import { v1 as uuidv1 } from 'uuid'

import { advancedFilterActions, commonStore, userStore, authStore } from '@/store/reducers'

import userApi from '@/apis/user.api'
import { getProfile } from './auth.saga'
import { getDefaultValues } from '@/utils/getDefaultValues'

function* fetchInitDataForList() {
  const data = yield call(userApi.getInitDataForList)
  yield put(userStore.actions.setInitDataForList(data))
}

function* fetchDetail(id: number) {
  const { user } = yield call(userApi.getDetail, id)
  user.job_access = user.job_access.map((item) => ({
    ...item,
    id: uuidv1()
  }))
  yield put(userStore.actions.setDetail(user))
}

function* fetchList() {
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(userApi.getList, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(userStore.actions.setDataList(data.user_lists))
}

function* fetchInitDataForCE() {
  const data = yield call(userApi.getInitDataForCE)
  const defaultValue = getDefaultValues(data, {
    default_language: 'parameters.PLLA',
    puco: 'parameters.PUCO',
    time_zone: 'timezones'
  })
  yield all([put(userStore.actions.setInitDataForCE(data)), put(userStore.actions.setDetail(defaultValue))])
}

export function* getUserList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(userStore.selectPermissions)
    if (permissions.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openUserCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield put(userStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* createUser({ payload }: ReturnType<typeof userStore.sagaCreate>) {
  yield put(userStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(userApi.create, payload)
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(userStore.actions.resetDetail())])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(userStore.actions.setDialogStateLoading(false))
}

export function* openUserUpdateDialog({ payload: userId }: ReturnType<typeof userStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield call(fetchDetail, userId)
    yield put(userStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* resetPassword({ payload }: ReturnType<typeof userStore.sagaResetPassword>) {
  yield put(userStore.actions.setResetPwdDialogLoading(true))

  try {
    const { id } = yield* select(userStore.selectDetail)
    const { message } = yield call(userApi.update, id, payload)
    yield all([
      put(commonStore.actions.setSuccessMessage(message)),
      put(userStore.actions.setResetPwdDialogOpen(false))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(userStore.actions.setResetPwdDialogLoading(false))
}

export function* updateUser({ payload }: ReturnType<typeof userStore.sagaUpdate>) {
  yield put(userStore.actions.setDialogStateLoading(true))

  try {
    const { id, formData } = payload
    const profile = yield* select(authStore.selectProfile)
    const { message } = yield call(userApi.update, id, formData)
    yield put(commonStore.actions.setSuccessMessage(message))
    yield call(closeUserDialog)
    // fetch profile after updated myself
    if (formData.user_id === profile.user_name) {
      yield call(getProfile)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(userStore.actions.setDialogStateLoading(false))
}

export function* closeUserDialog() {
  try {
    yield putResolve(userStore.actions.setDialogStateOpen(false))
    yield call(getUserList)
    yield put(userStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* userSaga() {
  yield takeEvery(userStore.sagaGetList, getUserList)
  yield takeEvery(userStore.sagaOpenCreateDialog, openUserCreateDialog)
  yield takeEvery(userStore.sagaCreate, createUser)
  yield takeEvery(userStore.sagaOpenUpdateDialog, openUserUpdateDialog)
  yield takeEvery(userStore.sagaUpdate, updateUser)
  yield takeEvery(userStore.sagaResetPassword, resetPassword)
  yield takeEvery(userStore.sagaCloseDialog, closeUserDialog)
}

export default userSaga
