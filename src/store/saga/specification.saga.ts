import { takeEvery, put, call, putResolve } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'
import _ from 'lodash'

import {
  specificationStore,
  commonStore,
  advancedFilterActions,
  summaryReportActions,
  drawingStore
} from '@/store/reducers'

import specificationApi from '@/apis/specification.api'

import type { DataForDropdown } from '@/types/Common'

function* fetchSpecificationInitDataForList() {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const data = yield call(specificationApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  if (_.isNull(data.selected_job)) {
    data.selected_job = {}
  }
  yield put(commonStore.actions.setUserValueJob(data.selected_job))
  yield put(specificationStore.actions.setInitDataForList(data))
}

function* fetchSpecificationInitDataForCE(jobId = null) {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const { permissions, selected_job, ...dataInit } = yield call(specificationApi.getInitDataForCE, {
    job_id_pk: jobId || userJob.value
  })
  yield put(specificationStore.actions.setInitDataForCE(dataInit))
  yield put(specificationStore.actions.setDetail({ job_id: selected_job.value }))
}

function* createSpecification({ payload }: ReturnType<typeof specificationStore.sagaCreate>) {
  yield put(specificationStore.actions.setDialogStateLoading(true))
  try {
    yield call(fetchSpecificationInitDataForCE)
    const { message } = yield call(specificationApi.create, payload)
    const userJob = yield* select(commonStore.selectUserValueJob)
    yield putResolve(specificationStore.actions.resetDetail({ userJob }))
    yield all([
      put(commonStore.actions.setSuccessMessage(message)),
      put(specificationStore.actions.setDialogStateTab(0))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(specificationStore.actions.setDialogStateLoading(false))
}

function* getSpecGenerateCode({ payload }: ReturnType<typeof specificationStore.sagaGenerateCode>) {
  yield put(specificationStore.actions.setDialogStateLoading(true))

  try {
    const { drawing, formData } = payload
    const { generated_code } = yield call(specificationApi.getGenerateCode, drawing.value)

    yield put(
      specificationStore.actions.setDetail({
        ...formData,
        drawing_id: drawing,
        spec_id: generated_code
      })
    )
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(specificationStore.actions.setDialogStateLoading(false))
}

function* openSpecificationCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))

  try {
    yield call(fetchSpecificationInitDataForCE)
    yield put(specificationStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* fetchSpecificationList() {
  const { tableState, searchQuery, filterData, userJob } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    userJob: select(commonStore.selectUserValueJob)
  })
  if (!userJob.value) {
    return
  }
  const { page, per_page } = tableState
  const data = yield call(specificationApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_id: userJob.value,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(specificationStore.actions.setDataList(data.specifications))
}

function* closeSpecificationDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const userJob = yield* select(commonStore.selectUserValueJob)
    yield put(specificationStore.actions.setDialogStateOpen(false))
    yield call(getSpecificationList)
    yield put(specificationStore.actions.resetDetail({ userJob }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* getSpecificationList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchSpecificationInitDataForList)
    const permissions = yield* select(specificationStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchSpecificationList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* removeSpecs({ payload }: ReturnType<typeof specificationStore.sagaRemove>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const data = yield call(specificationApi.executeOperation, 'delete', payload)

    if (data.failed_count > 0) {
      yield put(summaryReportActions.setReportData(data))
      yield put(summaryReportActions.setOpen(true))
    } else {
      yield put(commonStore.actions.setSuccessMessage(data.message))
    }
    yield call(fetchSpecificationList)
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* changeUserJob({ payload }: ReturnType<typeof specificationStore.sagaChangeUserJob>) {
  yield put(commonStore.actions.setUserValueJob(payload))
  yield call(getSpecificationList)
}

function getSpecificationId(spec_id: string) {
  const REGEX = /D\S+/g
  const match = spec_id.match(REGEX)
  if (_.isArray(match)) {
    return match[0]
  }
  return ''
}

function* openDrawingDialog({ payload }: ReturnType<typeof specificationStore.sagaOpenDrawingDialog>) {
  try {
    const { drawing_id } = payload
    yield put(specificationStore.actions.setDetail(payload))
    yield put(drawingStore.sagaOpenUpdateDialog((drawing_id as DataForDropdown).value))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

export function* fetchSpecificationDetail(specId: number) {
  const { specification } = yield call(specificationApi.getDetail, specId)
  specification.drawing_id = specification.related_drawing
  specification.spec_id = getSpecificationId(specification.spec_id)
  return specification
}

function* openSpecUpdateDialog({ payload }: ReturnType<typeof specificationStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const specification = yield call(fetchSpecificationDetail, payload)
    yield call(fetchSpecificationInitDataForCE, specification.job_id)
    yield putResolve(specificationStore.actions.setDetail(specification))
    yield put(specificationStore.actions.setDialogState({ editMode: true, open: true }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* updateSpec({ payload }: ReturnType<typeof specificationStore.sagaUpdate>) {
  yield put(specificationStore.actions.setDialogStateLoading(true))
  try {
    const { id, formData } = payload
    const { message } = yield call(specificationApi.update, id, formData)
    yield call(closeSpecificationDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(specificationStore.actions.setDialogStateLoading(false))
}

function* specificationSaga() {
  yield takeEvery(specificationStore.sagaGetList, getSpecificationList)
  yield takeEvery(specificationStore.sagaCreate, createSpecification)
  yield takeEvery(specificationStore.sagaGenerateCode, getSpecGenerateCode)
  yield takeEvery(specificationStore.sagaOpenCreateDialog, openSpecificationCreateDialog)
  yield takeEvery(specificationStore.sagaCloseDialog, closeSpecificationDialog)
  yield takeEvery(specificationStore.sagaRemove, removeSpecs)
  yield takeEvery(specificationStore.sagaChangeUserJob, changeUserJob)
  yield takeEvery(specificationStore.sagaOpenUpdateDialog, openSpecUpdateDialog)
  yield takeEvery(specificationStore.sagaUpdate, updateSpec)
  yield takeEvery(specificationStore.sagaOpenDrawingDialog, openDrawingDialog)
}

export default specificationSaga
