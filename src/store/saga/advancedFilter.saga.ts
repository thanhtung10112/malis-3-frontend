import { put, takeEvery, takeLatest } from 'redux-saga/effects'
import { select, all, call } from 'typed-redux-saga'
import { createAction } from '@reduxjs/toolkit'

import { authStore, advancedFilterActions, commonStore } from '@/store/reducers'
import afApi from '@/apis/advancedFilter.api'
import { StatusCode } from '@/utils/StatusCode'
import { actionTypes } from '@/utils/constant'

function* getEntity() {
  const entity = yield* select(commonStore.selectEntity)
  return entity
}

function* fetchDefaultFilter() {
  const entity = yield getEntity()
  const data = yield call(afApi.getInitDataForList, entity)
  yield put(advancedFilterActions.setDefaultFilter(data.default_filter))
  yield put(advancedFilterActions.setPermissions(data.permissions.advanced_filters))
  yield put(advancedFilterActions.setSystemPreset(data.system_default_filter))
}

function* fetchFilterList(filterType = '') {
  let type = filterType
  if (!type) {
    type = yield* select(advancedFilterActions.selectFilterType)
  }
  const entity = yield getEntity()
  const { filter_preset_list } = yield call(afApi.getList, { entity, type })
  yield put(advancedFilterActions.setFilterPresetList(filter_preset_list))
}

function* fetchInitDataForCreateEdit() {
  const entity = yield getEntity()
  const data = yield call(afApi.getInitDataForCE, entity)
  yield put(advancedFilterActions.setInitData(data))
}

function* fetchFilterDetail(id: number) {
  const { filter_preset } = yield call(afApi.getDetail, id)
  const filterType = yield* select(advancedFilterActions.selectFilterType)
  if (filterType === 'shared') {
    filter_preset.is_user_default = false
  }
  yield put(advancedFilterActions.setFilterDetail(filter_preset))
}

function* open() {
  yield put(advancedFilterActions.setOpenAdvanceSearch(true))
  yield put(advancedFilterActions.setLoadingSection(true))

  try {
    yield all([call(fetchDefaultFilter), call(fetchFilterList), call(fetchInitDataForCreateEdit)])
    const { user, defaultFilter } = yield* all({
      user: select(authStore.selectProfile),
      defaultFilter: select(advancedFilterActions.selectDefaultFilter)
    })
    if (user.user_id === defaultFilter.created_by) {
      yield put(advancedFilterActions.setEditMode(true))
    }
    yield call(fetchFilterDetail, defaultFilter.id)
    yield put(advancedFilterActions.setExpandedSection(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(advancedFilterActions.setLoadingSection(false))
}

function* changeFilterType({ payload: filterType }) {
  yield put(advancedFilterActions.setLoadingTable(true))
  try {
    yield call(fetchFilterList, filterType)
    yield put(advancedFilterActions.setFilterType(filterType))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(advancedFilterActions.setLoadingTable(false))
}

function* getList() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchFilterList)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* getDefaultFilter() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchDefaultFilter)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* create() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id, created_at, created_by, updated_at, updated_by, is_system_default, ...filterDetail } = yield select(
      advancedFilterActions.selectFilterDetail
    )
    const data = yield call(afApi.create, filterDetail)
    yield all([call(fetchDefaultFilter), call(fetchFilterList)])
    const userInfo = yield select(authStore.selectProfile)
    yield put(advancedFilterActions.setEditMode(true))
    yield put(
      advancedFilterActions.setFilterDetail({
        id: data.id,
        created_by: userInfo.user_id,
        is_system_default: false
      })
    )
    yield put(commonStore.actions.setSuccessMessage(data.message))
    yield put(
      advancedFilterActions.setAfForm({
        clearError: true,
        error: ''
      })
    )
  } catch (error) {
    const { status, message } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(advancedFilterActions.setAfForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(advancedFilterActions.setAfForm({ clearError: false, error: '' }))
  yield put(commonStore.actions.setLoadingPage(false))
}

function* update() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id, created_at, created_by, updated_at, updated_by, is_system_default, ...filterDetail } = yield select(
      advancedFilterActions.selectFilterDetail
    )
    const { message } = yield call(afApi.update, id, filterDetail)
    yield all([call(fetchDefaultFilter), call(fetchFilterList)])
    yield put(commonStore.actions.setSuccessMessage(message))
    yield put(
      advancedFilterActions.setAfForm({
        clearError: true,
        error: ''
      })
    )
  } catch (error) {
    const { status, message } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(advancedFilterActions.setAfForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(advancedFilterActions.setAfForm({ clearError: false, error: '' }))
  yield put(commonStore.actions.setLoadingPage(false))
}

function* share({ payload }: ReturnType<typeof advancedFilterActions.share>) {
  yield put(advancedFilterActions.setLoadingTable(true))
  try {
    const { id, is_shared } = payload
    const { message } = yield call(afApi.share, id, is_shared)
    yield call(fetchFilterList)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(advancedFilterActions.setLoadingTable(false))
}

function* getDetail({ payload: id }) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield all([call(fetchInitDataForCreateEdit), call(fetchFilterDetail, id)])
    yield put(advancedFilterActions.setEditMode(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* remove() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id } = yield select(advancedFilterActions.selectFilterDetail)
    const { message } = yield call(afApi.remove, id)
    yield all([call(fetchDefaultFilter), call(fetchFilterList)])
    const defaultFilter = yield select(advancedFilterActions.selectDefaultFilter)
    yield call(fetchFilterDetail, defaultFilter.id)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* clearDefaultFilter() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const entity = yield getEntity()
    const { message } = yield call(afApi.clearDefault, entity)
    yield call(fetchDefaultFilter)
    const filterDefault = yield select(advancedFilterActions.selectDefaultFilter)
    yield put(advancedFilterActions.setFilterDetail(filterDefault))
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* saveAs({ payload: name }) {
  yield put(advancedFilterActions.setLoadingDialog(true))
  try {
    const { id, created_at, created_by, updated_at, updated_by, is_system_default, ...filterDetail } = yield select(
      advancedFilterActions.selectFilterDetail
    )
    const copyFilterDetail = { ...filterDetail, name }
    const data = yield call(afApi.create, copyFilterDetail)
    yield all([call(fetchDefaultFilter), call(fetchFilterList)])
    const userInfo = yield select(authStore.selectProfile)
    yield put(advancedFilterActions.setEditMode(true))
    yield put(
      advancedFilterActions.setFilterDetail({
        id: data.id,
        created_by: userInfo.user_id,
        is_system_default: false,
        name
      })
    )
    yield put(commonStore.actions.setSuccessMessage(data.message))
    yield put(
      advancedFilterActions.setSaveAsForm({
        open: false,
        clearError: true,
        error: ''
      })
    )
  } catch (error) {
    const { message, status } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(advancedFilterActions.setSaveAsForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(advancedFilterActions.setSaveAsForm({ clearError: false, error: '' }))
  yield put(advancedFilterActions.setLoadingDialog(false))
}

function* apply() {
  let entity = yield* getEntity()
  if (entity === 'manufacturing_standard' || entity === 'material_standard') {
    entity = 'equivalence'
  }
  const getListAction = createAction(`${entity}/${actionTypes.GET_LIST}`)
  yield put(commonStore.actions.setTableState({ page: 1 }))
  yield put(getListAction())
  yield put(
    commonStore.actions.setSuccessMessage('The filter preset is applied successfully! This result is temporary')
  )
}

function* close() {
  let entity = yield* getEntity()
  if (entity === 'manufacturing_standard' || entity === 'material_standard') {
    entity = 'equivalence'
  }
  const getListAction = createAction(`${entity}/${actionTypes.GET_LIST}`)
  yield put(getListAction())
}

function* advancedFilterSaga() {
  yield takeEvery(advancedFilterActions.getList, getList)
  yield takeEvery(advancedFilterActions.create, create)
  yield takeEvery(advancedFilterActions.update, update)
  yield takeEvery(advancedFilterActions.getDetail, getDetail)
  yield takeEvery(advancedFilterActions.share, share)
  yield takeLatest(advancedFilterActions.remove, remove)
  yield takeLatest(advancedFilterActions.clearDefaultFilter, clearDefaultFilter)
  yield takeEvery(advancedFilterActions.getDefaultFilter, getDefaultFilter)
  yield takeEvery(advancedFilterActions.changeFilterType, changeFilterType)
  yield takeEvery(advancedFilterActions.saveAs, saveAs)
  yield takeEvery(advancedFilterActions.open, open)
  yield takeEvery(advancedFilterActions.apply, apply)
  yield takeEvery(advancedFilterActions.close, close)
}

export default advancedFilterSaga
