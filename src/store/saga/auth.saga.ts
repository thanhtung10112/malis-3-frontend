import { put, takeEvery } from 'redux-saga/effects'
import { call, all, select } from 'typed-redux-saga'

import _ from 'lodash'
import { setCookie } from 'nookies'
import { authStore, commonStore } from '@/store/reducers'

import authApi from '@/apis/auth.api'

import type { ParameterOption } from '@/types/Common'

export function* login({ payload }: ReturnType<typeof authStore.sagaLogin>) {
  yield put(authStore.actions.setLoading(true))
  try {
    const { remember, ...loginData } = payload
    const data = yield call(authApi.login, loginData)
    yield put(
      authStore.actions.saveTokenLogin({
        access_token: data.access_token,
        redirect_to: data.redirect_to,
        remember
      })
    )
  } catch (error) {
    const { message } = error
    yield put(commonStore.actions.setErrorMessage(message))
  }
  yield put(authStore.actions.setLoading(false))
}

export function* getProfile() {
  yield put(authStore.actions.setLoadingAuth(true))
  try {
    const data = yield call(authApi.getProfile)
    yield put(authStore.actions.setProfile(data))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(authStore.actions.setLoadingAuth(false))
}

export function* changePassword({ payload }: ReturnType<typeof authStore.sagaChangePassword>) {
  yield put(authStore.actions.setPwDialogState({ loading: true }))

  try {
    const { message } = yield call(authApi.changePassword, payload)
    yield all([
      put(commonStore.actions.setSuccessMessage(message)),
      put(authStore.actions.setPwDialogState({ open: false }))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(authStore.actions.setPwDialogState({ loading: false }))
}

export function* fetchSettingInitData() {
  const data = yield call(authApi.getInitDataForSetting)
  yield put(authStore.actions.setSettingInitData(data))
}

export function* fetchSettings() {
  const { message, success, ...detail } = yield call(authApi.getSettings)
  yield put(authStore.actions.setSettingDetail(detail))
}

export function* getSettings() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchSettingInitData)
    yield call(fetchSettings)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function getPathHomePage(options: ParameterOption[], homePageId: number) {
  const homePage = _.find(options, { value: homePageId })
  return homePage?.properties?.path || ''
}

export function* saveSettingsSaga({ payload }: ReturnType<typeof authStore.sagaSaveSettings>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { message } = yield call(authApi.saveSettings, payload)
    const parameters = yield* select(authStore.selectSettingsParameters)
    const homePagePath = getPathHomePage(parameters.PAGES, payload.home_page)
    if (homePagePath) {
      setCookie(null, 'redirect_to', homePagePath, {
        maxAge: 60 * 60 * 24 * 365 // 1 day
      })
    }
    yield put(authStore.actions.setDefaultLanguage(payload.default_language))
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

export function* logout({ payload }: ReturnType<typeof authStore.sagaLogout>) {
  const entity = yield* select(commonStore.selectEntity)
  if (payload?.confirm === 'save') {
    yield put(
      commonStore.sagaUpdateMultiple({
        entity: entity,
        action: authStore.actions.logout
      })
    )
  } else {
    yield put(authStore.actions.logout())
  }
}

function* authSaga() {
  yield takeEvery(authStore.sagaLogin, login)
  yield takeEvery(authStore.sagaGetProfile, getProfile)
  yield takeEvery(authStore.sagaChangePassword, changePassword)
  yield takeEvery(authStore.sagaGetSettings, getSettings)
  yield takeEvery(authStore.sagaSaveSettings, saveSettingsSaga)
  yield takeEvery(authStore.sagaLogout, logout)
}

export default authSaga
