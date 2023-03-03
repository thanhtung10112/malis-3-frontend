import { takeEvery, putResolve } from 'redux-saga/effects'

import { call, put, all, select } from 'typed-redux-saga'

import { jobStore, commonStore, advancedFilterActions } from '@/store/reducers'

import jobApi from '@/apis/job.api'
import _ from 'lodash'
import { getDefaultValue } from '@/utils/getDefaultValues'

function* fetchInitDataForList() {
  const data = yield call(jobApi.getInitDataForList)
  const selectedJobCategory = yield* select(jobStore.selectSelectedJobCategory)
  if (_.isNull(selectedJobCategory.id)) {
    const defaultJobCategory = getDefaultValue(data.job_categories, false)
    yield put(jobStore.actions.setSelectedCategory(defaultJobCategory))
  }
  yield put(jobStore.actions.setInitDataForList(data))
}

function* fetchInitDataForCE() {
  const data = yield call(jobApi.getInitDataForCE)
  data.job_template = _.pick(data.job_template, [
    'language',
    'equipment_type',
    'erection_site',
    'people_responsible',
    'squad_leader',
    'drawings_responsible',
    'job_users'
  ])
  const jobStandard = data.parameters.PLNO.map((item) => _.pick(item, ['description', 'id', 'parameter_id']))

  yield put(
    jobStore.actions.setDetail({
      ...data.job_template,
      job_standard: jobStandard
    })
  )
  yield put(jobStore.actions.setInitDataForCE(data))
}

function* fetchList() {
  const { tableState, searchQuery, filterData, selectedCategory } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    selectedCategory: select(jobStore.selectSelectedJobCategory)
  })
  const { page, per_page } = tableState
  const data = yield call(jobApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_category_id: selectedCategory?.id,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(jobStore.actions.setDataList(data.jobs))
}

function* getJobList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForList)
    const permissions = yield* select(jobStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* openJobCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchInitDataForCE)
    yield put(jobStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* getUserGroupMapping({ payload }: ReturnType<typeof jobStore.sagaGetUserGroupMapping>) {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    const data = yield call(jobApi.getUserGroupMapping, payload)
    yield put(jobStore.actions.setTransferUserAvailableList(data.available_users))
    yield put(jobStore.actions.setOpenTransferList(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(commonStore.actions.setLoadingPage(false))
}

function* createJob({ payload }: ReturnType<typeof jobStore.sagaCreate>) {
  yield put(jobStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(jobApi.create, payload)
    const { job_template } = yield* select(jobStore.selectInitDataForCE)
    yield put(jobStore.actions.setDetail(job_template))
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(jobStore.actions.setDialogStateLoading(false))
}

function* closeJobDialog() {
  try {
    yield putResolve(jobStore.actions.setDialogStateOpen(false))
    yield call(getJobList)
    yield put(jobStore.actions.resetDetail())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* openJobUpdateDialog({ payload }: ReturnType<typeof jobStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchInitDataForCE)
    const { job } = yield call(jobApi.getDetail, payload)
    job.job_currencies = job.job_currencies.map((currency) => ({
      id: currency.currency_id,
      ...currency
    }))
    yield putResolve(jobStore.actions.setDetail(job))
    yield put(jobStore.actions.setDialogState({ open: true, editMode: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* updateJob({ payload }: ReturnType<typeof jobStore.sagaUpdate>) {
  yield put(jobStore.actions.setDialogStateLoading(true))

  try {
    const { id, formData } = payload
    const { message } = yield call(jobApi.update, id, formData)
    yield put(commonStore.actions.setSuccessMessage(message))
    yield call(closeJobDialog)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(jobStore.actions.setDialogStateLoading(false))
}

function* jobSaga() {
  yield takeEvery(jobStore.sagaGetList, getJobList)
  yield takeEvery(jobStore.sagaOpenCreateDialog, openJobCreateDialog)
  yield takeEvery(jobStore.sagaGetUserGroupMapping, getUserGroupMapping)
  yield takeEvery(jobStore.sagaCreate, createJob)
  yield takeEvery(jobStore.sagaCloseDialog, closeJobDialog)
  yield takeEvery(jobStore.sagaOpenUpdateDialog, openJobUpdateDialog)
  yield takeEvery(jobStore.sagaUpdate, updateJob)
}

export default jobSaga
