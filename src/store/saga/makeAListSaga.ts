import { call, put, takeEvery, select, takeLatest, all } from 'redux-saga/effects'
import _ from 'lodash'

import { makeAListActions, exportProcessDialogActions, commonStore } from '@/store/reducers'

import { removalProperties } from '@/utils/constant'
import malApi from '@/apis/makeAList.api'
import { StatusCode } from '@/utils/StatusCode'

function* getEntityFromStore() {
  const entity = yield select(commonStore.selectEntity)
  return entity
}

function* fetchPresetList(filterType = '') {
  let type = filterType
  if (!type) {
    type = yield select((state) => state.makeAList.filterType)
  }
  const entity = yield getEntityFromStore()
  const { make_a_list_preset_list } = yield call(malApi.getList, {
    entity,
    type
  })
  yield put(makeAListActions.setPresetList(make_a_list_preset_list))
}

function* fetchPresetDetail(id) {
  const { make_a_list_preset } = yield call(malApi.getDetail, id)
  const filterType = yield select(makeAListActions.selectFilterType)
  if (filterType === 'shared') {
    make_a_list_preset.is_user_default = false
  }
  yield put(makeAListActions.setPresetDetail(make_a_list_preset))
}

function* fetchInitDataForCreateUpdate() {
  const entity = yield getEntityFromStore()
  const data = yield call(malApi.getInitDataForCE, entity)
  yield put(makeAListActions.setInitData(data))
}

function* fetchInitDataForList(isSetPresetDetail) {
  const entity = yield getEntityFromStore()
  const {
    current_default_preset,
    system_default_preset,
    permissions: { make_a_list }
  } = yield call(malApi.getInitDataForList, entity)
  yield all([
    put(makeAListActions.setPresetDefault(current_default_preset)),
    put(makeAListActions.setSystemPreset(system_default_preset)),
    put(makeAListActions.setPermissions(make_a_list))
  ])
  isSetPresetDetail && (yield put(makeAListActions.setPresetDetail(current_default_preset)))
}

function* changeFilterType({ payload: filterType }) {
  yield put(makeAListActions.setLoadingTable(true))
  try {
    yield call(fetchPresetList, filterType)
    yield put(makeAListActions.setFilterType(filterType))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(makeAListActions.setLoadingTable(false))
}

function* open() {
  yield put(commonStore.actions.setLoadingPage(true))
  const entity = yield getEntityFromStore()

  try {
    const { success } = yield call(malApi.checkPermissions, entity)
    if (success) {
      yield all([call(fetchPresetList), call(fetchInitDataForList, true), call(fetchInitDataForCreateUpdate)])

      yield put(makeAListActions.setOpen(true))
    }
  } catch (error) {
    const { message } = error
    yield put(commonStore.actions.setErrorMessage(message))
    yield put({
      type: `${entity}/setPermissions`,
      payload: { make_a_list: false }
    })
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* create({ payload }: ReturnType<typeof makeAListActions.create>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id, created_at, created_by, updated_at, updated_by, is_system_default, ...presetDetail } = payload
    const data = yield call(malApi.create, presetDetail)
    yield all([
      call(fetchPresetDetail, data.id),
      call(fetchPresetList),
      call(fetchInitDataForList, false),
      put(commonStore.actions.setSuccessMessage(data.message)),
      put(makeAListActions.setIsEditMode(true)),
      put(
        makeAListActions.setMalForm({
          clearError: true,
          error: ''
        })
      )
    ])
  } catch (error) {
    const { message, status } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(makeAListActions.setMalForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(makeAListActions.setMalForm({ clearError: false, error: '' }))
  yield put(commonStore.actions.setLoadingPage(false))
}

function* update({ payload }: ReturnType<typeof makeAListActions.update>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const presetDetail = _.omit(payload, [...removalProperties, 'is_system_default', 'is_shared'])
    const { message } = yield call(malApi.update, payload.id, presetDetail)
    yield all([
      call(fetchPresetList),
      call(fetchInitDataForList, false),
      put(commonStore.actions.setSuccessMessage(message)),
      put(
        makeAListActions.setMalForm({
          clearError: true,
          error: ''
        })
      )
    ])
  } catch (error) {
    const { message, status } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(makeAListActions.setMalForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(makeAListActions.setMalForm({ clearError: false, error: '' }))
  yield put(commonStore.actions.setLoadingPage(false))
}

function* getList() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchPresetList)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* getDetail({ payload: id }) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchPresetDetail, id)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* share({ payload }: ReturnType<typeof makeAListActions.share>) {
  yield put(makeAListActions.setLoadingTable(true))
  try {
    const { id, shared } = payload
    const { message } = yield call(malApi.share, id, shared)
    yield call(fetchPresetList)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(makeAListActions.setLoadingTable(false))
}

function* remove() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id } = yield select(makeAListActions.selectPresetDetail)
    const { message } = yield call(malApi.remove, id)
    yield all([call(fetchPresetList), call(fetchInitDataForList, true)])
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* clearDefault() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    const entity = yield getEntityFromStore()
    const { message } = yield call(malApi.clearDefault, entity)
    yield call(fetchInitDataForList, true)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* startMakeAListExport(exportEvent) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const exportDetails = exportEvent.payload
    const entity = yield getEntityFromStore()
    const requestData = {
      entity: entity,
      destination: exportDetails.destination,
      columns_displayed: exportDetails.displayedColumns,
      where_conditions: exportDetails.whereCondtions,
      sort_conditions: exportDetails.sortConditions,
      distinct: exportDetails.distinct,
      ignore_case: exportDetails.ignoreCase
    }
    const data = yield call(malApi.startMakeAListExport, requestData)
    if (data.success) {
      if (data.result_path) {
        const domain = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'
        const redirectUrl = `${domain}${data.result_path}`
        window.open(redirectUrl)
      } else {
        yield put(exportProcessDialogActions.setOperationId(data.operation_id))
        yield put(exportProcessDialogActions.setCeleryId(data.celery_id))
        yield put(exportProcessDialogActions.setOpen(true))
      }
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* stopMakeAListExport(operationData) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const requestData = operationData.payload
    const data = yield call(malApi.stopMakeAListExport, requestData)
    if (data.success) {
      put(commonStore.actions.setSuccessMessage(data.message))
      put(exportProcessDialogActions.setOpen(false))
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* saveAs({ payload }: ReturnType<typeof makeAListActions.saveAs>) {
  yield put(makeAListActions.setLoadingDialog(true))
  try {
    const { id, created_at, created_by, updated_at, updated_by, is_system_default, ...presetDetail } = payload
    const data = yield call(malApi.create, presetDetail)
    yield all([
      call(fetchPresetDetail, data.id),
      call(fetchPresetList),
      call(fetchInitDataForList, false),
      put(commonStore.actions.setSuccessMessage(data.message)),
      put(makeAListActions.setIsEditMode(true)),
      put(
        makeAListActions.setSaveAsForm({
          open: false,
          clearError: true,
          error: ''
        })
      )
    ])
  } catch (error) {
    const { message, status } = error
    if (status === StatusCode.BAD_REQUEST) {
      yield put(makeAListActions.setSaveAsForm({ error: message }))
    } else {
      yield put(commonStore.actions.setError(error))
    }
  }
  yield put(makeAListActions.setSaveAsForm({ clearError: false, error: '' }))
  yield put(makeAListActions.setLoadingDialog(false))
}

function* makeAListSaga() {
  yield takeEvery(makeAListActions.create, create)
  yield takeEvery(makeAListActions.getList, getList)
  yield takeEvery(makeAListActions.getDetail, getDetail)
  yield takeEvery(makeAListActions.share, share)
  yield takeEvery(makeAListActions.update, update)
  yield takeLatest(makeAListActions.remove, remove)
  yield takeLatest(makeAListActions.open, open)
  yield takeLatest(makeAListActions.clearDefault, clearDefault)
  yield takeLatest(makeAListActions.exportMakeAList, startMakeAListExport)
  yield takeLatest(makeAListActions.changeFilterType, changeFilterType)
  yield takeLatest(makeAListActions.saveAs, saveAs)
  yield takeLatest(makeAListActions.stopMakeAList, stopMakeAListExport)
}

export default makeAListSaga
