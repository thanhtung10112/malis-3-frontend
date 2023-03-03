import { takeEvery, put, putResolve } from 'redux-saga/effects'
import { select, call, all } from 'typed-redux-saga'

import {
  drawingStore,
  commonStore,
  advancedFilterActions,
  specificationStore,
  partStore,
  tagStore
} from '@/store/reducers'

import _ from 'lodash'
import { getDefaultValues } from '@/utils/getDefaultValues'

import { fetchSpecificationDetail } from '@/store/saga/specification.saga'

import drawingApi from '@/apis/drawing.api'

export function* fetchDrawingInitDataForList() {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const data = yield call(drawingApi.getInitDataForList, {
    job_id_pk: userJob.value
  })
  if (_.isNull(data.selected_job)) {
    data.selected_job = {}
  }
  if (userJob.value === -1 || userJob.value === -2) {
    data.selected_job = userJob
  }
  yield put(commonStore.actions.setUserValueJob(data.selected_job))
  yield put(drawingStore.actions.setInitDataForList(data))
}

export function* fetchDrawingInitDataForCE(jobId = null) {
  const userJob = yield* select(commonStore.selectUserValueJob)
  const { permissions, user_job, ...dataInit } = yield call(drawingApi.getInitDataForCE, {
    job_id_pk: jobId || userJob.value
  })
  const detailDefaultValue = getDefaultValues(dataInit.parameters, {
    drawing_purpose: 'DWPU',
    file_prefix: 'FPRE',
    file_type: 'FTYP',
    drawing_format: 'PLFO'
  })
  // if you are in create mode, then set jobId for the assembly form
  if (_.isNull(jobId)) {
    detailDefaultValue.job_id = userJob.value
  }
  if (!_.isNull(detailDefaultValue.drawing_purpose) && _.isNull(jobId)) {
    const drawingPurpose = _.find(dataInit.parameters.DWPU, {
      id: detailDefaultValue.drawing_purpose
    })
    const { exclude_from } = drawingPurpose?.properties
    if (_.isString(exclude_from) && _.size(exclude_from) > 0) {
      const excludeList = {
        C: 'exclude_from_customer',
        O: 'exclude_from_other',
        S: 'exclude_from_supplier'
      }
      const excludeFrom = exclude_from.split(';') // C;O;S => [C, O, S]
      _.forIn(excludeList, (value, key) => {
        if (excludeFrom.includes(key)) {
          detailDefaultValue[value] = true
        }
      })
    }
  }
  yield put(drawingStore.actions.setInitDataForCE(dataInit))
  yield put(drawingStore.actions.setDetail(detailDefaultValue))
  yield put(drawingStore.actions.setPermissions(permissions.drawing))
}

export function* fetchDrawingList() {
  const { tableState, searchQuery, filterData, userJob, drawingGroup } = yield* all({
    tableState: select(commonStore.selectTableState),
    searchQuery: select(commonStore.selectSearchQuery),
    filterData: select(advancedFilterActions.selectFilterData),
    userJob: select(commonStore.selectUserValueJob),
    drawingGroup: select(drawingStore.selectDrawingGroupId)
  })
  if (!userJob.value) {
    return
  }
  const { page, per_page } = tableState
  const data = yield call(drawingApi.getList, {
    per_page,
    page,
    s: searchQuery,
    job_id: userJob.value,
    drawing_group_id: drawingGroup,
    ...filterData
  })
  yield put(commonStore.actions.setTableState({ total_items: data.total_items }))
  yield put(drawingStore.actions.setDataList(data.drawings))
}

export function* getDrawingList() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchDrawingInitDataForList)
    const permissions = yield* select(drawingStore.selectPermissions)
    if (permissions?.view) {
      yield call(fetchDrawingList)
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* openDrawingCreateDialog() {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    yield call(fetchDrawingInitDataForCE)
    yield put(drawingStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* changeUserJob({ payload }: ReturnType<typeof drawingStore.sagaChangeUserJob>) {
  yield putResolve(commonStore.actions.setUserValueJob(payload))
  yield call(getDrawingList)
}

export function* createDrawing({ payload }: ReturnType<typeof drawingStore.sagaCreate>) {
  yield put(drawingStore.actions.setDialogStateLoading(true))
  try {
    const { message } = yield call(drawingApi.create, payload)
    const userJob = yield* select(commonStore.selectUserValueJob)
    yield putResolve(drawingStore.actions.resetDetail({ userJob }))
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(drawingStore.actions.setDialogStateTab(0))])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(drawingStore.actions.setDialogStateLoading(false))
}

export function* closeDrawingDialog() {
  try {
    const userJob = yield* select(commonStore.selectUserValueJob)
    const entity = yield* select(commonStore.selectEntity)
    const specDetail = yield* select(specificationStore.selectDetail)
    yield putResolve(drawingStore.actions.setDialogStateOpen(false))
    if (entity === 'specification') {
      yield put(commonStore.actions.setLoadingPage(true))
      const { drawing_id } = yield call(fetchSpecificationDetail, specDetail.id)
      yield put(specificationStore.actions.setDetail({ drawing_id }))
      yield put(commonStore.actions.setLoadingPage(false))
    } else if (entity === 'element') {
      yield put(tagStore.sagaGetList())
    } else {
      yield call(getDrawingList)
    }
    yield put(drawingStore.actions.resetDetail({ userJob }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

export function* openDrawingUpdateDialog({ payload: id }: ReturnType<typeof drawingStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { drawing } = yield call(drawingApi.getDetail, id)
    drawing.drawing_id = drawing.drawing_id.split(' ')[1]
    yield call(fetchDrawingInitDataForCE, drawing.job_id)
    yield putResolve(drawingStore.actions.setDetail(drawing))
    yield put(drawingStore.actions.setDialogStateOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

export function* updateDrawing({ payload }: ReturnType<typeof drawingStore.sagaUpdate>) {
  yield put(drawingStore.actions.setDialogStateLoading(true))

  try {
    const { id, drawing } = payload
    const { message } = yield call(drawingApi.update, id, drawing)
    yield call(closeDrawingDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(drawingStore.actions.setDialogStateLoading(false))
}

export function* openRevisionDialog({ payload }: ReturnType<typeof drawingStore.sagaOpenRevDialog>) {
  yield put(drawingStore.actions.setDialogStateLoading(true))

  try {
    const { next_revision } = yield call(drawingApi.getInitDataForRevise, payload)
    yield putResolve(
      drawingStore.actions.setRevisionDialogDetail({
        new_revision: next_revision
      })
    )
    yield put(drawingStore.actions.setRevisionDialogOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(drawingStore.actions.setDialogStateLoading(false))
}

export function* saveNewRev({ payload }: ReturnType<typeof drawingStore.sagaSaveNewRev>) {
  yield put(drawingStore.actions.setRevisionDialogLoading(true))

  try {
    const { drawingId, revision } = payload
    const { message } = yield call(drawingApi.saveRevision, drawingId, revision)
    yield put(drawingStore.actions.setRevisionDialogOpen(false))
    yield call(closeDrawingDialog)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(drawingStore.actions.setRevisionDialogLoading(false))
}

export function* openCreatePartDialog({ payload }: ReturnType<typeof drawingStore.sagaOpenCreatePartDialog>) {
  yield put(drawingStore.actions.setDialogStateLoading(true))
  try {
    const drawingDetail = yield* select(drawingStore.selectDetail)
    yield putResolve(
      commonStore.actions.setUserValueDrawing({
        description: '',
        entity_id: drawingDetail.drawing_id,
        value: drawingDetail.id
      })
    )
    yield put(partStore.sagaOpenCreateDialog(payload))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(drawingStore.actions.setDialogStateLoading(false))
}

function* drawingSaga() {
  yield takeEvery(drawingStore.sagaGetList, getDrawingList)
  yield takeEvery(drawingStore.sagaOpenCreateDialog, openDrawingCreateDialog)
  yield takeEvery(drawingStore.sagaChangeUserJob, changeUserJob)
  yield takeEvery(drawingStore.sagaCreate, createDrawing)
  yield takeEvery(drawingStore.sagaCloseDialog, closeDrawingDialog)
  yield takeEvery(drawingStore.sagaOpenUpdateDialog, openDrawingUpdateDialog)
  yield takeEvery(drawingStore.sagaUpdate, updateDrawing)
  yield takeEvery(drawingStore.sagaOpenRevDialog, openRevisionDialog)
  yield takeEvery(drawingStore.sagaSaveNewRev, saveNewRev)
  yield takeEvery(drawingStore.sagaOpenCreatePartDialog, openCreatePartDialog)
}

export default drawingSaga
