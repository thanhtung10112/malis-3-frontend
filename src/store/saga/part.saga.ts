import { takeLatest, call, put, putResolve, takeEvery } from 'redux-saga/effects'
import { select, all } from 'typed-redux-saga'
import _ from 'lodash'

import { partStore, commonStore } from '@/store/reducers'
import { getDefaultValues } from '@/utils/getDefaultValues'
import { isAssemblyByDpn } from '@/utils/isAssembly'

import itemApi from '@/apis/item.api'
import assemblyApi from '@/apis/assembly.api'
import partRefApi from '@/apis/part.api'
import manufacturerApi from '@/apis/manufacturer.api'
import drawingApi from '@/apis/drawing.api'

import type { DataForDropdown } from '@/types/Common'
import type { PartEntity } from '@/types/Part'

const getPartApi = (entity: PartEntity) => (entity === 'item' ? itemApi : assemblyApi)

function* fetchGenerateCode(entity: PartEntity, drawing: DataForDropdown) {
  const partApi = getPartApi(entity)
  const { generated_code } = yield call(partApi.getGenerateCode, drawing.value)
  return generated_code
}

function* openPartCreateDialog({ payload }: ReturnType<typeof partStore.sagaOpenCreateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const partApi = getPartApi(payload)
    const { userJob, userDrawing } = yield* all({
      userJob: select(commonStore.selectUserValueJob),
      userDrawing: select(commonStore.selectUserValueDrawing)
    })
    const initDetail = payload === 'item' ? partStore.itemDetail : partStore.assemblyDetail
    const { permissions, wiki_page, ...initData } = yield call(partApi.getInitDataForCE, {
      job_id_pk: userJob.value
    })
    const defaultValues = getDefaultValues(initData.parameters, { unit: 'UNIT' }, initDetail)
    defaultValues.drawing_id = userDrawing.value < 0 ? null : userDrawing
    defaultValues.job_id = userJob.value
    if (defaultValues.drawing_id) {
      defaultValues.dpn = yield call(fetchGenerateCode, payload, defaultValues.drawing_id)
    }
    yield putResolve(partStore.actions.setInitData(initData))
    yield put(partStore.actions.addPart({ detail: defaultValues, wiki_page, permissions: permissions[payload] }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* createPart({ payload }: ReturnType<typeof partStore.sagaCreate>) {
  yield put(partStore.actions.setPartLoading(true))
  try {
    const { entity, formData } = payload
    const partApi = getPartApi(entity)
    const { message } = yield call(partApi.create, formData)
    const { userJob, userDrawing } = yield* all({
      userJob: select(commonStore.selectUserValueJob),
      userDrawing: select(commonStore.selectUserValueDrawing)
    })
    let generateCode = ''
    if (userDrawing.value >= 0) {
      generateCode = yield call(fetchGenerateCode, entity, userDrawing)
    }
    yield putResolve(partStore.actions.resetCurrentPart({ userJob, userDrawing, generateCode }))
    yield all([put(commonStore.actions.setSuccessMessage(message)), put(partStore.actions.setPartTab(0))])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(partStore.actions.setPartLoading(false))
}

const getPartDpn = (entity: PartEntity, dpn: string) => {
  // const type = entity === 'item' ? 'H' : 'G'
  const regexItem = /H\S+/g
  const regexAssembly = /G\S+/g
  const regex = entity === 'item' ? regexItem : regexAssembly
  const match = dpn.match(regex)
  if (_.isArray(match)) {
    return match[0]
  }
  return ''
}

function* fetchPartDetail(entity: PartEntity, id: number) {
  const partApi = getPartApi(entity)
  const data = yield call(partApi.getDetail, id)
  const partDetail = data[entity]
  partDetail.dpn = getPartDpn(entity, partDetail.dpn)
  partDetail.drawing_id = partDetail.related_drawing
  partDetail.items = (partDetail.components || []).map(({ id, quantity }) => ({
    item_id: id,
    quantity
  }))

  if (entity === 'item') {
    partDetail.manufacturer_equiv = partDetail.manufacturer_equiv_object
    partDetail.material_equiv = partDetail.material_equiv_object
  }
  return partDetail
}

function* openPartUpdateDialog({ payload }: ReturnType<typeof partStore.sagaOpenUpdateDialog>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { id, entity } = payload
    const partApi = getPartApi(entity)
    const partDetail = yield call(fetchPartDetail, entity, id)
    const { permissions, wiki_page, ...initData } = yield call(partApi.getInitDataForCE, {
      job_id_pk: partDetail.job_id
    })
    yield putResolve(partStore.actions.setInitData(initData))
    yield put(partStore.actions.addPart({ detail: partDetail, wiki_page, permissions: permissions[entity] }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function* closePartDialog() {
  try {
    yield putResolve(partStore.actions.removePart())
    const partList = yield* select(partStore.selectPartList)
    const { detail } = _.last(partList)
    const partEntity = (detail as any).is_assembly ? 'assembly' : 'item'
    const partDetail = yield call(fetchPartDetail, partEntity, detail.id)
    yield put(partStore.actions.updateCurrentPart(partDetail))
    if (isAssemblyByDpn(detail.dpn)) {
      yield call(getDrawingItems, { type: '', payload: partDetail.related_drawing.value })
    }
    return
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* openManuDialog({ payload }: ReturnType<typeof partStore.sagaOpenManuDialog>) {
  yield put(partStore.actions.setPartLoading(true))
  try {
    yield put(partStore.actions.updateCurrentPart(payload))
    const { next_code, ...initData } = yield call(manufacturerApi.getInitDataForCE)
    yield all([
      putResolve(partStore.actions.setManuDetail({ manufacturer_id: next_code })),
      putResolve(partStore.actions.setManuInitData(initData))
    ])
    yield put(partStore.actions.setManuDialogOpen(true))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(partStore.actions.setPartLoading(false))
}

function* createManu({ payload }: ReturnType<typeof partStore.sagaCreateManu>) {
  yield put(partStore.actions.setManuDialogLoading(true))
  try {
    const { message, id } = yield call(manufacturerApi.create, payload)
    const { next_code } = yield call(manufacturerApi.getInitDataForCE)
    const { name } = payload
    yield putResolve(
      partStore.actions.setManuDetail({ ...partStore.initialState.manufacturer.detail, manufacturer_id: next_code })
    )
    yield all([
      put(commonStore.actions.setSuccessMessage(message)),
      put(partStore.actions.addManufacturer({ manufacturer_id: id, reference: '', description: name }))
    ])
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(partStore.actions.setManuDialogLoading(false))
}

function* closeManuDialog() {
  yield putResolve(partStore.actions.setManuDialogOpen(false))
  yield put(partStore.actions.setManuDetail({ manufacturer_id: null, name: '' }))
}

function* getManuId({ payload }: ReturnType<typeof partStore.sagaGetManuId>) {
  yield put(partStore.actions.setManuDialogLoading(true))
  try {
    const { generated_code } = yield call(manufacturerApi.getNextCode, payload.manufacturer_id)
    yield put(partStore.actions.setManuDetail({ ...payload, manufacturer_id: generated_code }))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(partStore.actions.setManuDialogLoading(false))
}

function* getItemCopy({ payload }: ReturnType<typeof partStore.sagaGetItemCopy>) {
  yield put(partStore.actions.setPartLoading(true))
  try {
    const data = yield call(partRefApi.getDetail, payload.value)
    // get the allowed attributes
    const part = _.pick(data.part, [
      'descriptions',
      'manufacturer_equiv',
      'manufacturers',
      'mass',
      'material_equiv',
      'unit',
      'manufacturer_equiv_standards',
      'material_equiv_standards'
    ])
    part.manufacturer_equiv = data.part.manufacturer_equiv_object
    part.material_equiv = data.part.material_equiv_object
    yield put(partStore.actions.updateCurrentPart(part))
    yield put(commonStore.actions.setSuccessMessage(data.message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }

  yield put(partStore.actions.setPartLoading(false))
}

function* getDrawingItems({ payload }: ReturnType<typeof partStore.sagaGetDrawingItems>) {
  yield put(partStore.actions.setPartLoading(true))
  try {
    const { items } = yield call(drawingApi.getItemList, payload)
    yield put(partStore.actions.setDrawingItems(items))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(partStore.actions.setPartLoading(false))
}

function* partSaga() {
  yield takeLatest(partStore.sagaOpenCreateDialog, openPartCreateDialog)
  yield takeLatest(partStore.sagaCreate, createPart)
  yield takeLatest(partStore.sagaOpenUpdateDialog, openPartUpdateDialog)
  yield takeEvery(partStore.sagaCloseDialog, closePartDialog)
  yield takeLatest(partStore.sagaOpenManuDialog, openManuDialog)
  yield takeEvery(partStore.sagaCreateManu, createManu)
  yield takeEvery(partStore.sagaCloseManuDialog, closeManuDialog)
  yield takeLatest(partStore.sagaGetManuId, getManuId)
  yield takeLatest(partStore.sagaGetItemCopy, getItemCopy)
  yield takeLatest(partStore.sagaGetDrawingItems, getDrawingItems)
}

export default partSaga
