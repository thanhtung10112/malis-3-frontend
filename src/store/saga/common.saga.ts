import { takeEvery, putResolve } from 'redux-saga/effects'
import { select, put, call } from 'typed-redux-saga'
import { createAction } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'
import _ from 'lodash'
import Router from 'next/router'
import HttpService from '@/helper/HttpService'

import { commonStore, summaryReportActions } from '@/store/reducers'

import commonApi from '@/apis/common.api'

import { plural } from 'pluralize'

import type { Entity } from '@/types/Common'

const getApiUpdateMultiple = (entity) => {
  const pluralEntity = plural(entity)
  const api = new HttpService(pluralEntity)
  return api.updateMultiple
}

function* updateMultiple({ payload }) {
  try {
    const { entity, action, payloadAction, href } = payload
    const api = getApiUpdateMultiple(entity)
    const editRow = yield* select(commonStore.selectEditRows)
    yield putResolve(commonStore.actions.setLoadingPage(true))
    const data = yield call(api, editRow)
    yield put(commonStore.actions.setSuccessMessage(data.message))
    yield putResolve(commonStore.actions.setLoadingPage(false))
    if (href) {
      Router.push(href)
    } else if (action && _.isFunction(action)) {
      yield put(action(payloadAction))
    } else if (entity) {
      const getListAction = createAction(`${entity}/${actionTypes.GET_LIST}`)
      yield put(getListAction())
    }
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* cancelBackgroundJob({ payload }: ReturnType<typeof commonStore.sagaCancelBackgroundJob>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { message } = yield call(commonApi.stopBackgroundJob, payload)
    yield put(commonStore.actions.setSuccessMessage(message))
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
  yield put(commonStore.actions.setLoadingPage(false))
}

function getExecuteOperationApi(entityParam: Entity) {
  let entity = entityParam
  if (entity === 'manufacturing_standard' || entity === 'material_standard') {
    entity = 'equivalence'
  }
  const pluralEntity = plural(entity)
  const api = new HttpService(pluralEntity)
  return api.executeOperation
}

function* executeOperation({ payload }: ReturnType<typeof commonStore.sagaExecuteOperation>) {
  yield put(commonStore.actions.setLoadingPage(true))
  try {
    const { entity, operation, operationList } = payload
    const apiReq = getExecuteOperationApi(entity)
    const data = yield call(apiReq, operation, operationList)
    yield putResolve(commonStore.actions.setLoadingPage(false))
    if (data.failed_count > 0) {
      yield put(summaryReportActions.setReportData(data))
      yield put(summaryReportActions.setOpen(true))
    } else {
      yield put(commonStore.actions.setSuccessMessage(data.message))
    }
    const getListAction = createAction(`${entity}/${actionTypes.GET_LIST}`)
    yield putResolve(getListAction())
  } catch (error) {
    yield put(commonStore.actions.setError(error))
  }
}

function* commonSaga() {
  yield takeEvery(commonStore.sagaUpdateMultiple, updateMultiple)
  yield takeEvery(commonStore.sagaCancelBackgroundJob, cancelBackgroundJob)
  yield takeEvery(commonStore.sagaExecuteOperation, executeOperation)
}

export default commonSaga
