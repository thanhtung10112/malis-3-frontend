import { takeEvery, put, call, putResolve } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'
import _ from 'lodash'

import { tagStore, commonStore, advancedFilterActions } from '@/store/reducers'

import tagApi from '@/apis/tag.api'

function* fetchTagDataForList() {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const data = yield call(tagApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  if (_.isNull(data.selected_job)) {
    data.selected_job = {}
  }
  yield put(commonStore.actions.setUserValueJob(data.selected_job))
  yield put(tagStore.actions.setInitDataForList(data))
}

function* fetchTagList() {
  const { tableState, searchQuery, filterData, userJob, userDrawing } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    userJob: select(commonStore.selectUserValueJob),
    userDrawing: select(commonStore.selectUserValueDrawing)
  })
  if (!userJob.value) {
    return
  }
  const { page, per_page } = tableState
  const data = yield call(tagApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_id: userJob.value,
    ...filterData,
    drawing_id: userDrawing.value
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(tagStore.actions.setDataList(data.elements))
}

function* getTagList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchTagDataForList)
    const permissions = yield* select(tagStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchTagList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* changeUserJob({ payload }: ReturnType<typeof tagStore.sagaChangeUserJob>) {
  yield put(commonStore.actions.setUserValueJob(payload))
  yield call(getTagList)
}

function* changeUserDrawing({ payload }: ReturnType<typeof tagStore.sagaChangeUserDrawing>) {
  yield putResolve(commonStore.actions.setUserValueDrawing(payload))
  yield call(getTagList)
}

function* tagSaga() {
  yield takeEvery(tagStore.sagaGetList, getTagList)
  yield takeEvery(tagStore.sagaChangeUserJob, changeUserJob)
  yield takeEvery(tagStore.sagaChangeUserDrawing, changeUserDrawing)
}

export default tagSaga
