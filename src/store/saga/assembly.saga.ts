import { takeEvery, put, call, putResolve } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'
import _ from 'lodash'

import { assemblyStore, commonStore, advancedFilterActions } from '@/store/reducers'
import assemblyApi from '@/apis/assembly.api'

function* fetchAssemblyInitDataForList() {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const data = yield call(assemblyApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  // when logged in as the fresh user, the API will not send the selected_job attribute
  // then we will set selected_job as an empty object
  if (_.isNull(data.selected_job)) {
    data.selected_job = {}
  }
  // the API will not send the selected_job attribute if you are in the all_job or all_standard mode,
  // then we will set selected_job = current selected user job
  if (userJob.value === -1 || userJob.value === -2) {
    data.selected_job = userJob
  }
  yield all([
    put(commonStore.actions.setUserValueJob(data.selected_job)),
    put(assemblyStore.actions.setInitDataForList(data))
  ])
}

function* fetchAssemblyList() {
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
  const data = yield call(assemblyApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_id: userJob.value,
    drawing_id: userDrawing.value,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(assemblyStore.actions.setDataList(data.assemblies))
}

function* getAssemblyList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchAssemblyInitDataForList)
    const permissions = yield* select(assemblyStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchAssemblyList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* changeUserJob({ payload }: ReturnType<typeof assemblyStore.sagaChangeUserJob>) {
  yield all([
    put(commonStore.actions.setUserValueJob(payload)),
    put(commonStore.actions.setUserValueDrawing(commonStore.initialState.userValue.drawing))
  ])
  yield call(getAssemblyList)
}

function* changeUserDrawing({ payload }: ReturnType<typeof assemblyStore.sagaChangeUserDrawing>) {
  yield putResolve(commonStore.actions.setUserValueDrawing(payload))
  yield call(getAssemblyList)
}

function* assemblySaga() {
  yield takeEvery(assemblyStore.sagaGetList, getAssemblyList)
  yield takeEvery(assemblyStore.sagaChangeUserJob, changeUserJob)
  yield takeEvery(assemblyStore.sagaChangeUserDrawing, changeUserDrawing)
}

export default assemblySaga
