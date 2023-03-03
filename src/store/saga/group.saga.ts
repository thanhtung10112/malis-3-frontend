import { takeEvery, put, putResolve } from 'redux-saga/effects'

import { select, call, all } from 'typed-redux-saga'

import groupApi from '@/apis/group.api'

import { advancedFilterActions, commonStore, groupStore } from '@/store/reducers'

function* fetchInitDataForList() {
  const data = yield call(groupApi.getInitDataForList)
  yield put(groupStore.actions.setInitDataForList(data))
}

function* fetchList() {
  const { tableState, searchQuery, filterData } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData)
  })
  const { page, per_page } = tableState
  const data = yield call(groupApi.getList, {
    per_page,
    page,
    s: searchQuery,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(groupStore.actions.setDataList(data.group_list))
}

function* getGroupList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(groupStore.selectPermissions)
    if (permissions.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* createGroup({ payload }: ReturnType<typeof groupStore.sagaCreate>) {
  yield put(groupStore.actions.setDialogStateLoading(true))

  try {
    yield call(fetchGroupInitDataForCE)
    const { message } = yield call(groupApi.create, payload)
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(groupStore.actions.resetDetail())])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(groupStore.actions.setDialogStateLoading(false))
}

function* fetchGroupInitDataForCE() {
  const data = yield call(groupApi.getInitDataForCE)
  yield put(groupStore.actions.setInitDataForCE(data))
}

function* openGroupCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchGroupInitDataForCE)
    yield put(groupStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* openUpdateDialog({ payload: id }: ReturnType<typeof groupStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchGroupInitDataForCE)
    const { group } = yield call(groupApi.getDetail, id)
    yield put(groupStore.actions.setDetail(group))
    yield put(groupStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* updateGroup({ payload }: ReturnType<typeof groupStore.sagaUpdate>) {
  yield put(groupStore.actions.setDialogStateLoading(true))

  try {
    const { id, formData } = payload
    const { message } = yield call(groupApi.update, id, formData)
    yield call(closeGroupDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(groupStore.actions.setDialogStateLoading(false))
}

function* getGroupPermissions() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const data = yield call(groupApi.getPermissionsList)
    yield put(groupStore.actions.setGroupPermissions(data))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* updateGroupPermissions({ payload }) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    const { message } = yield call(groupApi.updatePermissionsList, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* closeGroupDialog() {
  try {
    yield putResolve(groupStore.actions.setDialogStateOpen(false))
    yield call(getGroupList)
    yield put(groupStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* groupSaga() {
  yield takeEvery(groupStore.sagaGetList, getGroupList)
  yield takeEvery(groupStore.sagaCreate, createGroup)
  yield takeEvery(groupStore.sagaOpenUpdateDialog, openUpdateDialog)
  yield takeEvery(groupStore.sagaUpdate, updateGroup)
  yield takeEvery(groupStore.sagaCloseDialog, closeGroupDialog)
  yield takeEvery(groupStore.sagaOpenCreateDialog, openGroupCreateDialog)

  yield takeEvery(groupStore.sagaGetGroupPermissions, getGroupPermissions)
  yield takeEvery(groupStore.sagaUpdateGroupPermissions, updateGroupPermissions)
}

export default groupSaga
